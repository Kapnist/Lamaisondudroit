import { Landmark } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand${compact ? ' brand--compact' : ''}`} to="/" aria-label="La Maison du Droit — Accueil">
      <span className="brand__mark" aria-hidden="true">
        <Landmark size={25} strokeWidth={1.7} />
      </span>
      <span className="brand__words">
        <span className="brand__name">La Maison du Droit</span>
        {!compact && <span className="brand__tagline">Vos droits, notre engagement.</span>}
      </span>
    </Link>
  )
}
