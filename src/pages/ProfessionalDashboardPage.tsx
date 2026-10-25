import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { ArrowRight, Check, CircleUserRound, Plus, ShieldAlert, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cities, legalCategories } from '../data/catalogue'
import { supabase, supabaseConfigurationError } from '../lib/supabase'
import {
  getProfessionalAvatarUrl,
  getMyProfessionalProfile,
  saveMyProfessionalProfile,
} from '../services/professionalProfiles'
import type { ProfessionalDashboardProfile } from '../services/professionalProfiles'
import type { PresentationSection } from '../services/lawyerApplications'

const statusLabels: Record<string, string> = {
  pending_verification: 'Vérification en attente',
  needs_more_information: 'Informations complémentaires demandées',
  approved: 'Profil vérifié',
  rejected: 'Candidature refusée',
  suspended: 'Profil suspendu',
}

export function ProfessionalDashboardPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfessionalDashboardProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [storedPhotoUrl, setStoredPhotoUrl] = useState('')

  useEffect(() => {
    if (!photo) {
      setPhotoPreview('')
      return
    }
    const objectUrl = URL.createObjectURL(photo)
    setPhotoPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return
    }
    let active = true
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession)
    })
    void supabase.auth.getSession().then(({ data: result, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError(`Impossible de vérifier la session : ${sessionError.message}`)
      setSession(result.session)
      setIsLoading(false)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || !session) {
      setProfile(null)
      return
    }
    let active = true
    setIsLoading(true)
    void getMyProfessionalProfile()
      .then((result) => {
        if (active) setProfile(result)
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Impossible de charger le profil.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [session])

  useEffect(() => {
    if (!profile?.photo_path) {
      setStoredPhotoUrl('')
      return
    }
    let active = true
    void getProfessionalAvatarUrl(profile.photo_path)
      .then((url) => {
        if (active && url) setStoredPhotoUrl(url)
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Impossible de charger la photo.')
      })
    return () => {
      active = false
    }
  }, [profile?.photo_path])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    setError('')
    setIsLoading(true)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (authError) {
      setError(`Connexion impossible : ${authError.message}`)
      return
    }
    setSession(data.session)
  }

  async function signOut() {
    if (!supabase) return
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(`Déconnexion impossible : ${signOutError.message}`)
      return
    }
    setProfile(null)
    setSession(null)
    setMessage('')
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profile) return
    setIsSaving(true)
    setError('')
    setMessage('')
    try {
      const updatedProfile = await saveMyProfessionalProfile(profile, photo)
      setProfile(updatedProfile)
      setPhoto(null)
      setMessage(
        profile.verified && !updatedProfile.verified
          ? 'Votre profil a été modifié et repasse en vérification avant sa publication et la reprise des consultations.'
          : 'Votre profil a été enregistré.',
      )
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer le profil.')
    } finally {
      setIsSaving(false)
    }
  }

  function changeSection(index: number, field: keyof PresentationSection, value: string) {
    setProfile((current) => current
      ? {
          ...current,
          presentation_sections: current.presentation_sections.map((section, itemIndex) =>
            itemIndex === index ? { ...section, [field]: value } : section,
          ),
        }
      : current)
  }

  function toggleCategory(category: string) {
    setProfile((current) => {
      if (!current) return current
      const categories = current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category]
      return { ...current, categories }
    })
  }

  if (isLoading) {
    return <section className="dashboard-page"><div className="container"><p role="status">Chargement de votre espace professionnel…</p></div></section>
  }

  if (supabaseConfigurationError) {
    return (
      <section className="dashboard-page">
        <div className="container dashboard-container">
          <div className="signup-notice" role="alert"><ShieldAlert size={19} /><p>{supabaseConfigurationError}</p></div>
        </div>
      </section>
    )
  }

  if (!supabase) {
    return (
      <section className="dashboard-page">
        <div className="container dashboard-container">
          <span className="eyebrow"><CircleUserRound size={16} /> Espace professionnel</span>
          <h1>Tableau de bord</h1>
          <div className="signup-notice" role="note"><ShieldAlert size={19} /><p>Le tableau de bord nécessite une configuration Supabase. Les aperçus locaux ne sont pas des comptes professionnels et ne peuvent pas modifier un profil public.</p></div>
          <Link className="button button--nav" to="/professionnels/inscription">Créer un profil de démonstration <ArrowRight size={15} /></Link>
        </div>
      </section>
    )
  }

  if (!session) {
    return (
      <section className="dashboard-page">
        <div className="container dashboard-container">
          <span className="eyebrow"><CircleUserRound size={16} /> Espace professionnel</span>
          <h1>Connectez-vous à votre <em>tableau de bord.</em></h1>
          <form className="dashboard-login" onSubmit={signIn}>
            <label className="signup-field" htmlFor="dashboard-email">Adresse électronique
              <input id="dashboard-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="signup-field" htmlFor="dashboard-password">Mot de passe
              <input id="dashboard-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <button className="button button--nav" type="submit">Se connecter <ArrowRight size={15} /></button>
          </form>
          {error && <p className="signup-submit-error" role="alert">{error}</p>}
          <p className="signup-footnote">Pas encore de compte ? <Link to="/professionnels/inscription">Créer votre profil professionnel</Link>.</p>
        </div>
      </section>
    )
  }

  if (!profile) {
    return (
      <section className="dashboard-page">
        <div className="container dashboard-container">
          <span className="eyebrow"><CircleUserRound size={16} /> Espace professionnel</span>
          <h1>Bienvenue</h1>
          {error
            ? <p className="signup-submit-error" role="alert">{error}</p>
            : <p>Aucun profil professionnel n’est associé à ce compte. Terminez une inscription professionnelle pour accéder au tableau de bord.</p>}
          <div className="dashboard-actions">
            <Link className="button button--nav" to="/professionnels/inscription">Compléter mon inscription <ArrowRight size={15} /></Link>
            <button className="button button--outline" type="button" onClick={() => void signOut()}>Se déconnecter</button>
          </div>
        </div>
      </section>
    )
  }

  const photoUrl = photoPreview || storedPhotoUrl

  return (
    <section className="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow"><CircleUserRound size={16} /> Espace professionnel</span>
            <h1>Votre <em>profil.</em></h1>
            <p>Gérez les informations et la présentation affichées sur votre profil public après vérification.</p>
          </div>
          <button className="button button--outline" type="button" onClick={() => void signOut()}>Se déconnecter</button>
        </div>

        <div className={`verification-banner${profile.verified ? ' verification-banner--verified' : ''}`} role="status">
          <ShieldAlert size={19} />
          <div>
            <strong>{statusLabels[profile.verification_status] ?? 'Statut de vérification indisponible'}</strong>
            <p>{profile.verified
              ? 'Votre profil est publié dans l’annuaire. Toute modification du profil déclenche une nouvelle vérification.'
              : 'Votre profil et votre photo ne sont pas visibles dans l’annuaire public tant que la vérification n’est pas terminée.'}</p>
          </div>
        </div>

        <form className="dashboard-form" onSubmit={saveProfile}>
          <div className="dashboard-photo">
            {photoUrl
              ? <img src={photoUrl} alt="Photo actuelle du profil professionnel" />
              : <span className="dashboard-photo__placeholder"><CircleUserRound size={36} /></span>}
            <label className="signup-field" htmlFor="dashboard-photo">Photo de profil
              <input id="dashboard-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
              <small>JPG, PNG ou WebP, 5 Mo maximum.</small>
            </label>
          </div>

          <div className="signup-fields">
            <label className="signup-field signup-field--wide" htmlFor="dashboard-name">Nom et prénom
              <input id="dashboard-name" value={profile.full_name} maxLength={160} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} required />
            </label>
            <label className="signup-field" htmlFor="dashboard-profession">Profession
              <input id="dashboard-profession" value={profile.profession} readOnly aria-readonly="true" />
            </label>
            {profile.lawyer_status && (
              <label className="signup-field" htmlFor="dashboard-lawyer-status">Statut
                <input id="dashboard-lawyer-status" value={`Avocat ${profile.lawyer_status.toLocaleLowerCase('fr')}`} readOnly aria-readonly="true" />
              </label>
            )}
            <label className="signup-field" htmlFor="dashboard-city">Ville d’exercice
              <select id="dashboard-city" value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} required>
                {cities.map((city) => <option value={city} key={city}>{city}</option>)}
              </select>
            </label>
            <fieldset className="signup-field signup-field--wide signup-category-group">
              <legend>Spécialités et domaines</legend>
              <div className="signup-category-options">
                {legalCategories.map((category) => (
                  <label className="signup-category-option" key={category}>
                    <input type="checkbox" checked={profile.categories.includes(category)} onChange={() => toggleCategory(category)} />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="signup-field signup-field--wide signup-category-group">
              <legend>Présentation</legend>
              <p className="signup-category-intro">Chaque section contient un titre et un texte. Ces contenus ne sont publics qu’avec le profil vérifié.</p>
              {profile.presentation_sections.map((section, index) => (
                <div className="presentation-editor" key={index}>
                  <label className="signup-field" htmlFor={`dashboard-section-title-${index}`}>Titre de la section
                    <input id={`dashboard-section-title-${index}`} value={section.title} maxLength={120} onChange={(event) => changeSection(index, 'title', event.target.value)} required />
                  </label>
                  <label className="signup-field" htmlFor={`dashboard-section-text-${index}`}>Texte
                    <textarea id={`dashboard-section-text-${index}`} value={section.text} maxLength={5000} rows={5} onChange={(event) => changeSection(index, 'text', event.target.value)} required />
                  </label>
                  <button className="presentation-remove" type="button" onClick={() => setProfile({ ...profile, presentation_sections: profile.presentation_sections.filter((_, itemIndex) => itemIndex !== index) })}>
                    <Trash2 size={14} /> Supprimer cette section
                  </button>
                </div>
              ))}
              <button className="presentation-add" type="button" disabled={profile.presentation_sections.length >= 12} onClick={() => setProfile({ ...profile, presentation_sections: [...profile.presentation_sections, { title: '', text: '' }] })}>
                <Plus size={15} /> Ajouter une section
              </button>
            </fieldset>
          </div>

          <div className="dashboard-actions">
            <button className="button button--nav" type="submit" disabled={isSaving || profile.categories.length === 0 || profile.presentation_sections.length === 0}>
              <Check size={15} /> {isSaving ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
            <Link className="button button--outline" to="/professionnels">Voir l’annuaire</Link>
          </div>
          {error && <p className="signup-submit-error" role="alert">{error}</p>}
          {message && <p className="signup-submit-success" role="status">{message}</p>}
        </form>
      </div>
    </section>
  )
}
