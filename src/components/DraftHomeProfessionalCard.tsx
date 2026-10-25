import { ArrowRight, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { noupaRudiDraft } from '../data/draftProfiles'

export function DraftHomeProfessionalCard() {
  return (
    <article className="popular-professional-card popular-professional-card--draft">
      <img src={noupaRudiDraft.profileImage} alt="Photo de la maquette du profil de Maître Noupa Rudi" />
      <div className="popular-professional-card__body">
        <span className="popular-professional-card__draft"><ShieldAlert size={14} /> Maquette · non vérifié</span>
        <h3>{noupaRudiDraft.name}</h3>
        <p>{noupaRudiDraft.profession}</p>
        <div className="popular-professional-card__specialties">
          <span>{noupaRudiDraft.specialty}</span>
        </div>
        <Link to="/professionnels/demo/maitre-noupa-rudi" className="text-link">
          Voir le profil <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  )
}
