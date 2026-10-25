import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { PresentationSection } from './lawyerApplications'

export type PublishedProfessional = {
  id: string
  name: string
  profession: string
  city: string
  specialties: string[]
  verified: boolean
  photoUrl: string | null
  presentationSections: PresentationSection[]
}

export type ProfessionalDashboardProfile = {
  id: string
  full_name: string
  profession: string
  lawyer_status: 'Titulaire' | 'Stagiaire' | null
  city: string
  categories: string[]
  photo_path: string | null
  presentation_sections: PresentationSection[]
  verification_status: string
  verified: boolean
  consultations_enabled: boolean
}

type PublishedProfileRow = {
  id: string
  full_name: string
  profession: string
  city: string
  categories: string[]
  photo_path: string | null
  presentation_sections: PresentationSection[] | null
  verified: boolean
}

function isVerificationState(
  value: unknown,
): value is Pick<ProfessionalDashboardProfile, 'id' | 'verification_status' | 'verified' | 'consultations_enabled'> {
  return typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'verification_status' in value && typeof value.verification_status === 'string' &&
    'verified' in value && typeof value.verified === 'boolean' &&
    'consultations_enabled' in value && typeof value.consultations_enabled === 'boolean'
}

export async function getProfessionalAvatarUrl(path: string | null): Promise<string | null> {
  const client = supabase
  if (!client || !path) return null
  const { data, error } = await client.storage.from('professional-avatars').createSignedUrl(path, 60 * 60)
  if (error) {
    throw new Error(`Impossible de charger la photo du profil : ${error.message}`)
  }
  return data.signedUrl
}

async function mapPublishedProfile(
  profile: PublishedProfileRow,
  client: SupabaseClient,
): Promise<PublishedProfessional> {
  let photoUrl: string | null = null
  if (profile.photo_path) {
    const { data, error } = await client.storage.from('professional-avatars').createSignedUrl(profile.photo_path, 60 * 60)
    if (error) {
      throw new Error(`Impossible de charger la photo du profil : ${error.message}`)
    }
    photoUrl = data.signedUrl
  }
  return {
    id: profile.id,
    name: profile.full_name,
    profession: profile.profession,
    city: profile.city,
    specialties: profile.categories,
    verified: profile.verified,
    photoUrl,
    presentationSections: profile.presentation_sections ?? [],
  }
}

export async function getPublishedProfessionals(): Promise<PublishedProfessional[]> {
  const client = supabase
  if (!client) return []
  const { data, error } = await client
    .from('published_professional_profiles')
    .select('id,full_name,profession,city,categories,photo_path,presentation_sections,verified')
    .order('full_name')

  if (error) {
    throw new Error(`Impossible de charger l’annuaire des professionnels : ${error.message}`)
  }
  return await Promise.all((data ?? []).map((profile) => mapPublishedProfile(profile, client)))
}

export async function getPublishedProfessionalById(id: string): Promise<PublishedProfessional | null> {
  const client = supabase
  if (!client) return null
  const { data, error } = await client
    .from('published_professional_profiles')
    .select('id,full_name,profession,city,categories,photo_path,presentation_sections,verified')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    throw new Error(`Impossible de charger ce profil professionnel : ${error.message}`)
  }
  return data ? await mapPublishedProfile(data, client) : null
}

export async function getMyProfessionalProfile(): Promise<ProfessionalDashboardProfile | null> {
  const client = supabase
  if (!client) throw new Error('Le tableau de bord nécessite une configuration Supabase.')
  const { data, error } = await client.rpc('get_my_professional_profile')
  if (error) {
    throw new Error(`Impossible de charger le profil professionnel : ${error.message}`)
  }
  return (data?.[0] as ProfessionalDashboardProfile | undefined) ?? null
}

export async function saveMyProfessionalProfile(
  profile: ProfessionalDashboardProfile,
  photo: File | null,
) {
  const client = supabase
  if (!client) throw new Error('Le tableau de bord nécessite une configuration Supabase.')
  let photoPath = profile.photo_path

  if (photo) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(photo.type)) {
      throw new Error('La photo doit être au format JPG, PNG ou WebP.')
    }
    if (photo.size === 0 || photo.size > 5 * 1024 * 1024) {
      throw new Error('La photo doit peser au maximum 5 Mo.')
    }
    const { data: sessionData, error: sessionError } = await client.auth.getSession()
    if (sessionError) {
      throw new Error(`Impossible de vérifier votre session : ${sessionError.message}`)
    }
    const ownerId = sessionData.session?.user.id
    if (!ownerId) throw new Error('Votre session a expiré. Reconnectez-vous avant de modifier votre photo.')

    const extension = photo.name.split('.').pop()?.toLocaleLowerCase('en') ?? ''
    photoPath = `${ownerId}/${crypto.randomUUID()}.${extension}`
    const { error } = await client.storage
      .from('professional-avatars')
      .upload(photoPath, photo, { contentType: photo.type, upsert: false })
    if (error) {
      throw new Error(`Impossible de téléverser la photo : ${error.message}`)
    }
  }

  const { data, error } = await client.rpc('save_my_professional_profile', {
    p_full_name: profile.full_name,
    p_profession: profile.profession,
    p_lawyer_status: profile.lawyer_status,
    p_city: profile.city,
    p_categories: profile.categories,
    p_photo_path: photoPath,
    p_presentation_sections: profile.presentation_sections,
  })
  if (error) {
    if (photo && photoPath) {
      const { error: cleanupError } = await client.storage.from('professional-avatars').remove([photoPath])
      throw new Error(
        `Impossible d’enregistrer le profil : ${error.message}${cleanupError ? ` La suppression de la nouvelle photo a échoué : ${cleanupError.message}` : ''}`,
      )
    }
    throw new Error(`Impossible d’enregistrer le profil : ${error.message}`)
  }

  const verificationState = Array.isArray(data) ? data[0] : null
  if (!isVerificationState(verificationState)) {
    throw new Error('Le profil a été enregistré, mais son statut de vérification n’a pas pu être confirmé. Rechargez le tableau de bord.')
  }

  return { ...profile, photo_path: photoPath, ...verificationState }
}
