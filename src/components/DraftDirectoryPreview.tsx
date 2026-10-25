import { Clock3, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { noupaRudiDraft } from '../data/draftProfiles'

export function DraftDirectoryPreview() {
  const consultation = noupaRudiDraft.firstConsultation

  return (
    <section className="draft-directory-preview" aria-labelledby="draft-preview-title">
      <div className="draft-directory-preview__heading">
        <ShieldAlert size={17} />
        <div>
          <h3 id="draft-preview-title">Profil fictif de démonstration — non vérifié</h3>
          <p>Cette fiche fictive est affichée à titre de démonstration et ne représente pas un professionnel réel.</p>
        </div>
      </div>
      <article className="draft-directory-card">
        <img src={noupaRudiDraft.profileImage} alt="Photo de la maquette du profil de Maître Noupa Rudi" />
        <div className="draft-directory-card__details">
          <strong>{noupaRudiDraft.name}</strong>
          <span>{noupaRudiDraft.profession} · {noupaRudiDraft.specialty}</span>
          <span className="draft-directory-card__status">Profil fictif · non vérifié</span>
        </div>
        <div className="draft-directory-card__price">
          <span><Clock3 size={14} /> {consultation.durationMinutes} min</span>
          <strong>{consultation.priceXaf.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <Link className="button button--outline" to="/professionnels/demo/maitre-noupa-rudi">
          Voir le profil
        </Link>
      </article>
    </section>
  )
}
