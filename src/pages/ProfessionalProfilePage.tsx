import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, ShieldCheck, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ShareProfileButton } from '../components/ShareProfileButton'
import { getPublishedProfessionalById } from '../services/professionalProfiles'
import type { PublishedProfessional } from '../services/professionalProfiles'

export function ProfessionalProfilePage() {
  const { id = '' } = useParams()
  const [profile, setProfile] = useState<PublishedProfessional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError('')
    void getPublishedProfessionalById(id)
      .then((result) => {
        if (active) setProfile(result)
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Le profil n’a pas pu être chargé.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  return (
    <section className="draft-page">
      <div className="container">
        <Link className="draft-back" to="/professionnels"><ArrowLeft size={15} /> Retour à l’annuaire</Link>
        {isLoading && <p role="status">Chargement du profil…</p>}
        {error && <p className="signup-submit-error" role="alert">{error}</p>}
        {!isLoading && !error && !profile && (
          <div className="empty-state">
            <span className="eyebrow">Profil indisponible</span>
            <h1>Ce profil n’est pas publié.</h1>
            <p>Seuls les professionnels validés apparaissent dans l’annuaire public.</p>
          </div>
        )}
        {profile && (
          <>
            <article className="published-profile">
              {profile.photoUrl
                ? <img className="published-profile__photo" src={profile.photoUrl} alt={`Photo de ${profile.name}`} />
                : <div className="published-profile__placeholder" aria-hidden="true"><UserRound size={48} /></div>}
              <div className="published-profile__content">
                <span className="published-profile__verified"><ShieldCheck size={15} /> Professionnel vérifié</span>
                <h1>{profile.name}</h1>
                <p className="draft-profile__profession">{profile.profession}</p>
                <p className="draft-profile__location"><MapPin size={16} /> {profile.city}</p>
                <div className="published-profile__specialties" aria-label="Spécialités">
                  {profile.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
                </div>
                <ShareProfileButton name={profile.name} description={`${profile.profession} · ${profile.specialties.join(', ')}`} />
              </div>
            </article>
            <section className="draft-presentation" aria-labelledby="published-presentation-title">
              <div className="draft-presentation__intro">
                <span className="eyebrow"><span className="eyebrow-line" /> Présentation professionnelle</span>
                <h2 id="published-presentation-title">À propos</h2>
              </div>
              {profile.presentationSections.length > 0
                ? profile.presentationSections.map((section, index) => (
                    <article className="published-presentation-section" key={`${section.title}-${index}`}>
                      <h3>{section.title}</h3>
                      <p>{section.text}</p>
                    </article>
                  ))
                : <p>La présentation de ce professionnel sera bientôt disponible.</p>}
            </section>
          </>
        )}
      </div>
    </section>
  )
}
