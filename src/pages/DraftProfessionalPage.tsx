import { ArrowLeft, Clock3, MapPin, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { noupaRudiDraft } from '../data/draftProfiles'
import { ShareProfileButton } from '../components/ShareProfileButton'

export function DraftProfessionalPage() {
  const consultation = noupaRudiDraft.firstConsultation
  const presentation = noupaRudiDraft.presentation

  return (
    <section className="draft-page">
      <div className="container">
        <Link className="draft-back" to="/professionnels">
          <ArrowLeft size={15} /> Retour à l’annuaire
        </Link>

        <div className="draft-warning" role="status">
          <ShieldAlert size={20} />
          <div>
            <strong>Maquette — profil non vérifié</strong>
            <p>Cette fiche est visible uniquement en développement. Les justificatifs n’ont pas été contrôlés et le profil ne peut pas proposer de consultations.</p>
          </div>
        </div>

        <article className="draft-profile">
          <div className="draft-profile__portrait">
            <img src={noupaRudiDraft.profileImage} alt="Portrait de maquette recadré depuis l’image de bannière fournie" />
            <p>{noupaRudiDraft.imageNotice}</p>
          </div>
          <div className="draft-profile__content">
            <span className="eyebrow"><span className="eyebrow-line" /> Vérification à confirmer</span>
            <h1>{noupaRudiDraft.name}</h1>
            <p className="draft-profile__profession">{noupaRudiDraft.profession} · {noupaRudiDraft.specialty}</p>
            <div className="draft-profile__location">
              <MapPin size={16} /> Ville d’exercice à renseigner
            </div>
            <ShareProfileButton
              name={noupaRudiDraft.name}
              description={`${noupaRudiDraft.profession} · ${noupaRudiDraft.specialty}`}
              isDraft
            />

            <div className="consultation-card">
              <span className="eyebrow">Tarif communiqué pour la maquette</span>
              <h2>{consultation.label}</h2>
              <div className="consultation-card__details">
                <span><Clock3 size={16} /> {consultation.durationMinutes} minutes</span>
                <strong>{consultation.priceXaf.toLocaleString('fr-FR')} FCFA</strong>
              </div>
              <button className="button button--nav" type="button" disabled>
                Réservation indisponible
              </button>
              <p>La réservation sera activée après mise en place du service et validation du profil.</p>
            </div>
          </div>
        </article>

        <section className="draft-presentation" aria-labelledby="draft-presentation-title">
          <div className="draft-presentation__intro">
            <span className="eyebrow"><span className="eyebrow-line" /> Présentation proposée — à valider</span>
            <h2 id="draft-presentation-title">{presentation.title}</h2>
            <p>{presentation.introduction}</p>
          </div>

          <div className="draft-concerns">
            {presentation.concerns.map((concern) => (
              <article className="draft-concern" key={concern.title}>
                <h3>{concern.title}</h3>
                <p>{concern.description}</p>
              </article>
            ))}
          </div>

          <div className="draft-approach">
            <h3>{presentation.approachTitle}</h3>
            <p>{presentation.approach}</p>
          </div>

          <div className="draft-first-step">
            <h3>{presentation.firstStepTitle}</h3>
            <p>{presentation.firstStep}</p>
          </div>
        </section>

        <p className="draft-footnote">
          Le texte et les informations de cette maquette restent à valider. Ils n’attestent ni de l’identité, ni de l’inscription professionnelle, ni de la disponibilité d’un service réel ou de l’exactitude juridique des démarches évoquées.
        </p>
      </div>
    </section>
  )
}
