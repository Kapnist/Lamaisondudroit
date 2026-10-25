import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found">
      <span className="eyebrow">Erreur 404</span>
      <h1>Cette page reste à trouver.</h1>
      <p>Le lien demandé n’existe pas ou n’est plus disponible.</p>
      <Link className="button button--nav" to="/">Retour à l’accueil</Link>
    </section>
  )
}
