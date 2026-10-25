create extension if not exists pgcrypto;

create table if not exists public.professional_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) between 2 and 160),
  profession text not null check (profession in ('Avocat', 'Notaire', 'Juriste')),
  lawyer_status text check (lawyer_status is null or lawyer_status in ('Titulaire', 'Stagiaire')),
  city text not null check (length(trim(city)) between 2 and 100),
  categories text[] not null check (cardinality(categories) > 0),
  photo_path text,
  presentation_sections jsonb not null default '[]'::jsonb
    check (jsonb_typeof(presentation_sections) = 'array'),
  verification_status text not null default 'pending_verification'
    check (verification_status in ('pending_verification', 'needs_more_information', 'approved', 'rejected', 'suspended')),
  verified boolean not null default false,
  consultations_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (profession = 'Avocat' and lawyer_status is not null)
    or (profession <> 'Avocat' and lawyer_status is null)
  ),
  check (verified = (verification_status = 'approved')),
  check (consultations_enabled = verified)
);

create table if not exists public.lawyer_verification_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.professional_profiles(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  diploma text not null,
  professional_registration_number text not null,
  bar_association text not null,
  oath_city text not null,
  internship_firm text not null,
  document_paths jsonb not null check (jsonb_typeof(document_paths) = 'object'),
  status text not null default 'pending_verification'
    check (status in ('pending_verification', 'needs_more_information', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  reviewer_note text,
  unique (profile_id, id)
);

create index if not exists lawyer_verification_queue_idx
  on public.lawyer_verification_submissions (status, submitted_at);
create index if not exists lawyer_verification_owner_idx
  on public.lawyer_verification_submissions (owner_id, submitted_at desc);
create index if not exists professional_profiles_public_idx
  on public.professional_profiles (verification_status, city);
create index if not exists professional_profiles_categories_idx
  on public.professional_profiles using gin (categories);

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  target_id uuid not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.professional_profiles enable row level security;
alter table public.lawyer_verification_submissions enable row level security;
alter table public.platform_admins enable row level security;
alter table public.audit_logs enable row level security;

revoke all on public.professional_profiles from anon, authenticated;
revoke all on public.lawyer_verification_submissions from anon, authenticated;
revoke all on public.platform_admins from anon, authenticated;
revoke all on public.audit_logs from anon, authenticated;
grant select on public.professional_profiles to anon, authenticated;
grant select on public.lawyer_verification_submissions to authenticated;

create policy "Public profiles are readable"
  on public.professional_profiles for select
  to anon, authenticated
  using (true);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to anon, authenticated;

create policy "Applicants and administrators can read submissions"
  on public.lawyer_verification_submissions for select
  to authenticated
  using (owner_id = (select auth.uid()) or public.is_platform_admin());

create or replace function public.save_my_professional_profile(
  p_full_name text,
  p_profession text,
  p_lawyer_status text,
  p_city text,
  p_categories text[],
  p_photo_path text,
  p_presentation_sections jsonb
)
returns table (
  id uuid,
  verification_status text,
  verified boolean,
  consultations_enabled boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_profile_id uuid;
  v_current_status text;
  v_profile_changed boolean;
begin
  if v_owner_id is null then
    raise exception 'Une session est requise pour modifier le profil.';
  end if;
  if length(trim(coalesce(p_full_name, ''))) not between 2 and 160
    or p_profession is null
    or p_profession not in ('Avocat', 'Notaire', 'Juriste')
    or length(trim(coalesce(p_city, ''))) not between 2 and 100
    or coalesce(cardinality(p_categories), 0) = 0
    or cardinality(p_categories) > 18
    or exists (
      select 1 from unnest(p_categories) as category
      where length(trim(category)) not between 1 and 80
    )
    or case
      when jsonb_typeof(p_presentation_sections) = 'array'
        then jsonb_array_length(p_presentation_sections) not between 1 and 12
      else true
    end
    or (p_profession = 'Avocat' and coalesce(p_lawyer_status, '') not in ('Titulaire', 'Stagiaire'))
    or (p_profession <> 'Avocat' and p_lawyer_status is not null)
    or (p_photo_path is not null and p_photo_path not like v_owner_id::text || '/%') then
    raise exception 'Les informations du profil sont invalides.';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_presentation_sections) as section(value)
    where length(trim(coalesce(section.value->>'title', ''))) not between 1 and 120
      or length(trim(coalesce(section.value->>'text', ''))) not between 1 and 5000
  ) then
    raise exception 'Chaque section de présentation doit avoir un titre et un texte valides.';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_presentation_sections) as section(value)
    where (select count(*) from jsonb_object_keys(section.value)) <> 2
      or not (section.value ?& array['title', 'text'])
  ) then
    raise exception 'Une section de présentation contient des champs inattendus.';
  end if;
  if p_photo_path is not null and not exists (
    select 1
    from storage.objects
    where bucket_id = 'professional-avatars'
      and name = p_photo_path
      and (storage.foldername(name))[1] = v_owner_id::text
  ) then
    raise exception 'La photo de profil n’a pas été téléversée dans votre espace.';
  end if;

  select id,
         verification_status,
         full_name is distinct from trim(p_full_name)
           or city is distinct from trim(p_city)
           or categories is distinct from p_categories
           or photo_path is distinct from p_photo_path
           or presentation_sections is distinct from p_presentation_sections
    into v_profile_id, v_current_status, v_profile_changed
  from public.professional_profiles
  where owner_id = v_owner_id
  for update;

  if v_profile_id is null then
    raise exception 'Aucun profil professionnel n’est associé à ce compte.';
  end if;

  update public.professional_profiles
  set full_name = trim(p_full_name),
      city = trim(p_city),
      categories = p_categories,
      photo_path = p_photo_path,
      presentation_sections = p_presentation_sections,
      verification_status = case
        when v_current_status = 'approved' and v_profile_changed then 'pending_verification'
        else verification_status
      end,
      verified = case
        when v_current_status = 'approved' and v_profile_changed then false
        else verified
      end,
      consultations_enabled = case
        when v_current_status = 'approved' and v_profile_changed then false
        else consultations_enabled
      end,
      updated_at = now()
  where id = v_profile_id;

  insert into public.audit_logs (actor_id, action, target_id, details)
  values (v_owner_id, 'professional_profile_updated', v_profile_id, '{}'::jsonb);

  return query
  select profile.id, profile.verification_status, profile.verified, profile.consultations_enabled
  from public.professional_profiles as profile
  where profile.id = v_profile_id;
end;
$$;

create or replace function public.get_my_professional_profile()
returns table (
  id uuid,
  full_name text,
  profession text,
  lawyer_status text,
  city text,
  categories text[],
  photo_path text,
  presentation_sections jsonb,
  verification_status text,
  verified boolean,
  consultations_enabled boolean
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Une session est requise pour consulter le tableau de bord.';
  end if;
  return query
  select profile.id, profile.full_name, profile.profession, profile.lawyer_status,
         profile.city, profile.categories, profile.photo_path,
         profile.presentation_sections, profile.verification_status,
         profile.verified, profile.consultations_enabled
  from public.professional_profiles as profile
  where profile.owner_id = auth.uid();
end;
$$;

create or replace view public.published_professional_profiles as
select id, full_name, profession, city, categories,
       photo_path,
       presentation_sections, verified
from public.professional_profiles
where verification_status = 'approved'
  and verified
  and consultations_enabled;

revoke all on public.professional_profiles from anon, authenticated;
grant select on public.published_professional_profiles to anon, authenticated;
revoke all on public.published_professional_profiles from public;

create or replace function public.submit_professional_application(
  p_full_name text,
  p_profession text,
  p_city text,
  p_categories text[],
  p_photo_path text,
  p_presentation_sections jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_profile_id uuid;
  v_current_status text;
begin
  if v_owner_id is null then
    raise exception 'Une session est requise pour transmettre une candidature.';
  end if;
  if p_profession is null
    or p_profession not in ('Notaire', 'Juriste')
    or length(trim(coalesce(p_full_name, ''))) not between 2 and 160
    or length(trim(coalesce(p_city, ''))) not between 2 and 100
    or coalesce(cardinality(p_categories), 0) = 0
    or cardinality(p_categories) > 18
    or exists (
      select 1 from unnest(p_categories) as category
      where length(trim(category)) not between 1 and 80
    )
    or case
      when jsonb_typeof(p_presentation_sections) = 'array'
        then jsonb_array_length(p_presentation_sections) not between 1 and 12
      else true
    end then
    raise exception 'Les champs obligatoires de la candidature sont incomplets.';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_presentation_sections) as section(value)
    where length(trim(coalesce(section.value->>'title', ''))) not between 1 and 120
      or length(trim(coalesce(section.value->>'text', ''))) not between 1 and 5000
      or (select count(*) from jsonb_object_keys(section.value)) <> 2
      or not (section.value ?& array['title', 'text'])
  ) then
    raise exception 'Chaque section de présentation doit avoir un titre et un texte valides.';
  end if;
  if p_photo_path is not null and not exists (
    select 1 from storage.objects
    where bucket_id = 'professional-avatars'
      and name = p_photo_path
      and (storage.foldername(name))[1] = v_owner_id::text
  ) then
    raise exception 'La photo de profil n’a pas été téléversée dans votre espace.';
  end if;

  select id, verification_status into v_profile_id, v_current_status
  from public.professional_profiles
  where owner_id = v_owner_id
  for update;

  if v_profile_id is not null and v_current_status not in ('needs_more_information', 'rejected') then
    raise exception 'Une candidature est déjà en cours ou ce profil est déjà vérifié.';
  end if;

  if v_profile_id is null then
    insert into public.professional_profiles (
      owner_id, full_name, profession, city, categories, photo_path, presentation_sections
    ) values (
      v_owner_id, trim(p_full_name), p_profession, trim(p_city), p_categories,
      p_photo_path, p_presentation_sections
    )
    returning id into v_profile_id;
  else
    update public.professional_profiles
    set full_name = trim(p_full_name),
        profession = p_profession,
        lawyer_status = null,
        city = trim(p_city),
        categories = p_categories,
        photo_path = p_photo_path,
        presentation_sections = p_presentation_sections,
        verification_status = 'pending_verification',
        verified = false,
        consultations_enabled = false,
        updated_at = now()
    where id = v_profile_id;
  end if;
  return v_profile_id;
end;
$$;

create or replace function public.submit_lawyer_application(
  p_submission_id uuid,
  p_full_name text,
  p_lawyer_status text,
  p_city text,
  p_categories text[],
  p_diploma text,
  p_registration_number text,
  p_bar_association text,
  p_oath_city text,
  p_internship_firm text,
  p_document_paths jsonb,
  p_photo_path text,
  p_presentation_sections jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_profile_id uuid;
  v_last_status text;
  v_uploaded_count integer;
begin
  if v_owner_id is null then
    raise exception 'Une session est requise pour transmettre une candidature.';
  end if;
  if p_submission_id is null
    or length(trim(coalesce(p_full_name, ''))) not between 2 and 160
    or coalesce(p_lawyer_status, '') not in ('Titulaire', 'Stagiaire')
    or length(trim(coalesce(p_city, ''))) not between 2 and 100
    or coalesce(cardinality(p_categories), 0) = 0
    or cardinality(p_categories) > 18
    or exists (
      select 1 from unnest(p_categories) as category
      where length(trim(category)) not between 1 and 80
    )
    or length(trim(coalesce(p_diploma, ''))) = 0
    or length(trim(coalesce(p_registration_number, ''))) = 0
    or length(trim(coalesce(p_bar_association, ''))) = 0
    or length(trim(coalesce(p_oath_city, ''))) = 0
    or length(trim(coalesce(p_internship_firm, ''))) = 0
    or case
      when jsonb_typeof(p_presentation_sections) = 'array'
        then jsonb_array_length(p_presentation_sections) not between 1 and 12
      else true
    end then
    raise exception 'Les champs obligatoires de la candidature sont incomplets.';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_presentation_sections) as section(value)
    where length(trim(coalesce(section.value->>'title', ''))) not between 1 and 120
      or length(trim(coalesce(section.value->>'text', ''))) not between 1 and 5000
      or (select count(*) from jsonb_object_keys(section.value)) <> 2
      or not (section.value ?& array['title', 'text'])
  ) then
    raise exception 'Chaque section de présentation doit avoir un titre et un texte valides.';
  end if;

  if p_photo_path is not null and not exists (
    select 1 from storage.objects
    where bucket_id = 'professional-avatars'
      and name = p_photo_path
      and (storage.foldername(name))[1] = v_owner_id::text
  ) then
    raise exception 'La photo de profil n’a pas été téléversée dans votre espace.';
  end if;

  if case
    when jsonb_typeof(p_document_paths) = 'object'
      then (select count(*) from jsonb_object_keys(p_document_paths)) <> 5
    else true
  end
    or not (p_document_paths ?& array['diploma', 'registration', 'bar', 'oath', 'internship']) then
    raise exception 'Les cinq justificatifs obligatoires sont requis.';
  end if;

  select count(*) into v_uploaded_count
  from jsonb_each_text(p_document_paths) as document(kind, object_path)
  join storage.objects as stored
    on stored.bucket_id = 'lawyer-verification'
    and stored.name = document.object_path
    and (storage.foldername(stored.name))[1] = v_owner_id::text
  where document.object_path like v_owner_id::text || '/' || p_submission_id::text || '/%';

  if v_uploaded_count <> 5 then
    raise exception 'Un ou plusieurs justificatifs privés sont absents.';
  end if;

  select id, verification_status
    into v_profile_id, v_last_status
  from public.professional_profiles
  where owner_id = v_owner_id
  for update;

  if v_profile_id is not null and v_last_status not in ('needs_more_information', 'rejected') then
    raise exception 'Une candidature est déjà en cours ou ce profil est déjà vérifié.';
  end if;

  if v_profile_id is null then
    insert into public.professional_profiles (
      owner_id, full_name, profession, lawyer_status, city, categories, photo_path, presentation_sections
    ) values (
      v_owner_id, trim(p_full_name), 'Avocat', p_lawyer_status, trim(p_city),
      p_categories, p_photo_path, p_presentation_sections
    )
    returning id into v_profile_id;
  else
    update public.professional_profiles
    set full_name = trim(p_full_name),
        lawyer_status = p_lawyer_status,
        city = trim(p_city),
        categories = p_categories,
        photo_path = p_photo_path,
        presentation_sections = p_presentation_sections,
        verification_status = 'pending_verification',
        verified = false,
        consultations_enabled = false,
        updated_at = now()
    where id = v_profile_id;
  end if;

  insert into public.lawyer_verification_submissions (
    id, profile_id, owner_id, diploma, professional_registration_number,
    bar_association, oath_city, internship_firm, document_paths
  ) values (
    p_submission_id, v_profile_id, v_owner_id, trim(p_diploma),
    trim(p_registration_number), trim(p_bar_association), trim(p_oath_city),
    trim(p_internship_firm), p_document_paths
  );

  return v_profile_id;
end;
$$;

revoke all on function public.save_my_professional_profile(text, text, text, text, text[], text, jsonb) from public, anon;
revoke all on function public.get_my_professional_profile() from public, anon;
revoke all on function public.submit_professional_application(text, text, text, text[], text, jsonb) from public, anon;
revoke all on function public.submit_lawyer_application(uuid, text, text, text, text[], text, text, text, text, text, jsonb, text, jsonb) from public, anon;
grant execute on function public.save_my_professional_profile(text, text, text, text, text[], text, jsonb) to authenticated;
grant execute on function public.get_my_professional_profile() to authenticated;
grant execute on function public.submit_professional_application(text, text, text, text[], text, jsonb) to authenticated;
grant execute on function public.submit_lawyer_application(uuid, text, text, text, text[], text, text, text, text, text, jsonb, text, jsonb) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('professional-avatars', 'professional-avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_read_professional_avatar(p_object_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (storage.foldername(p_object_path))[1] = (select auth.uid())::text
    or public.is_platform_admin()
    or exists (
      select 1
      from public.professional_profiles as profile
      where profile.photo_path = p_object_path
        and profile.verification_status = 'approved'
        and profile.verified
        and profile.consultations_enabled
    );
$$;

revoke all on function public.can_read_professional_avatar(text) from public, anon;
grant execute on function public.can_read_professional_avatar(text) to anon, authenticated;

create policy "Published avatars and their owners are readable"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'professional-avatars'
    and public.can_read_professional_avatar(name)
  );

create policy "Professionals can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'professional-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Professionals can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'professional-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'professional-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Professionals can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'professional-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create or replace function public.submit_lawyer_application(
  p_submission_id uuid,
  p_full_name text,
  p_lawyer_status text,
  p_city text,
  p_categories text[],
  p_diploma text,
  p_registration_number text,
  p_bar_association text,
  p_oath_city text,
  p_internship_firm text,
  p_document_paths jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_profile_id uuid;
  v_last_status text;
  v_uploaded_count integer;
begin
  if v_owner_id is null then
    raise exception 'Une session est requise pour transmettre une candidature.';
  end if;
  if p_submission_id is null
    or length(trim(coalesce(p_full_name, ''))) not between 2 and 160
    or p_lawyer_status not in ('Titulaire', 'Stagiaire')
    or length(trim(coalesce(p_city, ''))) not between 2 and 100
    or coalesce(cardinality(p_categories), 0) = 0
    or length(trim(coalesce(p_diploma, ''))) = 0
    or length(trim(coalesce(p_registration_number, ''))) = 0
    or length(trim(coalesce(p_bar_association, ''))) = 0
    or length(trim(coalesce(p_oath_city, ''))) = 0
    or length(trim(coalesce(p_internship_firm, ''))) = 0 then
    raise exception 'Les champs obligatoires de la candidature sont incomplets.';
  end if;

  if jsonb_typeof(p_document_paths) <> 'object'
    or (select count(*) from jsonb_object_keys(p_document_paths)) <> 5
    or not (p_document_paths ?& array['diploma', 'registration', 'bar', 'oath', 'internship']) then
    raise exception 'Les cinq justificatifs obligatoires sont requis.';
  end if;

  select count(*) into v_uploaded_count
  from jsonb_each_text(p_document_paths) as document(kind, object_path)
  join storage.objects as stored
    on stored.bucket_id = 'lawyer-verification'
    and stored.name = document.object_path
    and (storage.foldername(stored.name))[1] = v_owner_id::text
  where document.object_path like v_owner_id::text || '/' || p_submission_id::text || '/%';

  if v_uploaded_count <> 5 then
    raise exception 'Un ou plusieurs justificatifs privés sont absents.';
  end if;

  select id, verification_status
    into v_profile_id, v_last_status
  from public.professional_profiles
  where owner_id = v_owner_id
  for update;

  if v_profile_id is not null and v_last_status not in ('needs_more_information', 'rejected') then
    raise exception 'Une candidature est déjà en cours ou ce profil est déjà vérifié.';
  end if;

  if v_profile_id is null then
    insert into public.professional_profiles (
      owner_id, full_name, profession, lawyer_status, city, categories
    ) values (
      v_owner_id, trim(p_full_name), 'Avocat', p_lawyer_status, trim(p_city), p_categories
    )
    returning id into v_profile_id;
  else
    update public.professional_profiles
    set full_name = trim(p_full_name),
        lawyer_status = p_lawyer_status,
        city = trim(p_city),
        categories = p_categories,
        verification_status = 'pending_verification',
        verified = false,
        consultations_enabled = false,
        updated_at = now()
    where id = v_profile_id;
  end if;

  insert into public.lawyer_verification_submissions (
    id, profile_id, owner_id, diploma, professional_registration_number,
    bar_association, oath_city, internship_firm, document_paths
  ) values (
    p_submission_id, v_profile_id, v_owner_id, trim(p_diploma),
    trim(p_registration_number), trim(p_bar_association), trim(p_oath_city),
    trim(p_internship_firm), p_document_paths
  );

  return v_profile_id;
end;
$$;

drop function public.submit_lawyer_application(uuid, text, text, text, text[], text, text, text, text, text, jsonb);

create or replace function public.get_lawyer_verification_queue()
returns table (
  profile_id uuid,
  submission_id uuid,
  applicant_email text,
  full_name text,
  lawyer_status text,
  city text,
  categories text[],
  diploma text,
  registration_number text,
  bar_association text,
  oath_city text,
  internship_firm text,
  document_paths jsonb,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Accès réservé aux administrateurs habilités.';
  end if;

  return query
  select profile.id, submission.id, account.email::text, profile.full_name,
         profile.lawyer_status, profile.city, profile.categories,
         submission.diploma, submission.professional_registration_number,
         submission.bar_association, submission.oath_city, submission.internship_firm,
         submission.document_paths, submission.submitted_at
  from public.lawyer_verification_submissions as submission
  join public.professional_profiles as profile on profile.id = submission.profile_id
  join auth.users as account on account.id = submission.owner_id
  where submission.status = 'pending_verification'
    and profile.verification_status = 'pending_verification'
  order by submission.submitted_at asc;
end;
$$;

create or replace function public.review_lawyer_application(
  p_profile_id uuid,
  p_decision text,
  p_reviewer_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Accès réservé aux administrateurs habilités.';
  end if;
  if p_decision not in ('approved', 'needs_more_information', 'rejected') then
    raise exception 'Décision de vérification invalide.';
  end if;

  select submission.id into v_submission_id
  from public.lawyer_verification_submissions as submission
  where submission.profile_id = p_profile_id
    and submission.status = 'pending_verification'
  order by submission.submitted_at desc
  limit 1
  for update;

  if v_submission_id is null then
    raise exception 'Aucune candidature en attente pour ce profil.';
  end if;

  update public.lawyer_verification_submissions
  set status = p_decision,
      reviewed_at = now(),
      reviewed_by = auth.uid(),
      reviewer_note = nullif(trim(coalesce(p_reviewer_note, '')), '')
  where id = v_submission_id;

  update public.professional_profiles
  set verification_status = p_decision,
      verified = (p_decision = 'approved'),
      consultations_enabled = (p_decision = 'approved'),
      updated_at = now()
  where id = p_profile_id;

  insert into public.audit_logs (actor_id, action, target_id, details)
  values (
    auth.uid(),
    'lawyer_verification_' || p_decision,
    p_profile_id,
    jsonb_build_object('submission_id', v_submission_id, 'reviewer_note', p_reviewer_note)
  );
end;
$$;

create or replace function public.get_professional_review_queue()
returns table (
  profile_id uuid,
  applicant_email text,
  full_name text,
  profession text,
  lawyer_status text,
  city text,
  categories text[],
  verification_status text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Accès réservé aux administrateurs habilités.';
  end if;
  return query
  select profile.id, account.email::text, profile.full_name, profile.profession,
         profile.lawyer_status, profile.city, profile.categories,
         profile.verification_status, profile.created_at
  from public.professional_profiles as profile
  join auth.users as account on account.id = profile.owner_id
  where profile.verification_status = 'pending_verification'
  order by profile.created_at asc;
end;
$$;

create or replace function public.review_professional_profile(
  p_profile_id uuid,
  p_decision text,
  p_reviewer_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profession text;
  v_submission_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Accès réservé aux administrateurs habilités.';
  end if;
  if p_decision not in ('approved', 'needs_more_information', 'rejected', 'suspended') then
    raise exception 'Décision de vérification invalide.';
  end if;

  select profession into v_profession
  from public.professional_profiles
  where id = p_profile_id
    and verification_status = 'pending_verification'
  for update;
  if v_profession is null then
    raise exception 'Aucun profil en attente pour cette vérification.';
  end if;

  if v_profession = 'Avocat' then
    select id into v_submission_id
    from public.lawyer_verification_submissions
    where profile_id = p_profile_id
      and status = 'pending_verification'
    order by submitted_at desc
    limit 1
    for update;
    if p_decision = 'approved'
      and v_submission_id is null
      and not exists (
        select 1
        from public.lawyer_verification_submissions
        where profile_id = p_profile_id
          and status = 'approved'
      ) then
      raise exception 'Un avocat doit avoir transmis son dossier justificatif avant validation.';
    end if;
    if v_submission_id is not null and p_decision <> 'suspended' then
      update public.lawyer_verification_submissions
      set status = p_decision,
          reviewed_at = now(),
          reviewed_by = auth.uid(),
          reviewer_note = nullif(trim(coalesce(p_reviewer_note, '')), '')
      where id = v_submission_id;
    end if;
  end if;

  update public.professional_profiles
  set verification_status = p_decision,
      verified = (p_decision = 'approved'),
      consultations_enabled = (p_decision = 'approved'),
      updated_at = now()
  where id = p_profile_id;

  insert into public.audit_logs (actor_id, action, target_id, details)
  values (
    auth.uid(),
    'professional_profile_' || p_decision,
    p_profile_id,
    jsonb_build_object('reviewer_note', p_reviewer_note)
  );
end;
$$;

create or replace function public.can_offer_consultations(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.professional_profiles
    where id = p_profile_id
      and verified
      and consultations_enabled
      and verification_status = 'approved'
  );
$$;

revoke all on function public.get_lawyer_verification_queue() from public, anon;
revoke all on function public.review_lawyer_application(uuid, text, text) from public, anon;
revoke all on function public.get_professional_review_queue() from public, anon;
revoke all on function public.review_professional_profile(uuid, text, text) from public, anon;
revoke all on function public.can_offer_consultations(uuid) from public, anon;
grant execute on function public.get_lawyer_verification_queue() to authenticated;
grant execute on function public.review_lawyer_application(uuid, text, text) to authenticated;
grant execute on function public.get_professional_review_queue() to authenticated;
grant execute on function public.review_professional_profile(uuid, text, text) to authenticated;
grant execute on function public.can_offer_consultations(uuid) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lawyer-verification',
  'lawyer-verification',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Applicants and administrators can view verification files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'lawyer-verification'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or public.is_platform_admin()
    )
  );

create policy "Applicants can upload files to their private folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'lawyer-verification'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (storage.foldername(name))[2] is not null
    and lower(storage.extension(name)) in ('pdf', 'jpg', 'jpeg', 'png')
  );

create policy "Applicants can remove files not attached to a submission"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'lawyer-verification'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and not exists (
      select 1
      from public.lawyer_verification_submissions as submission
      cross join lateral jsonb_each_text(submission.document_paths) as document(kind, object_path)
      where submission.owner_id = (select auth.uid())
        and document.object_path = storage.objects.name
    )
  );
