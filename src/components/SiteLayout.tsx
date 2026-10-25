import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Brand } from './Brand'

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <div className="announcement">
        <span className="announcement__dot" />
        Une nouvelle façon d’accéder au droit au Cameroun
      </div>
      <header className="site-header">
        <div className="container nav-shell">
          <Brand />
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`main-nav${menuOpen ? ' main-nav--open' : ''}`} aria-label="Navigation principale">
            <NavLink onClick={closeMenu} to="/professionnels">Trouver un professionnel</NavLink>
            <NavLink onClick={closeMenu} to="/professionnels/inscription">Inscription professionnelle</NavLink>
            <NavLink onClick={closeMenu} to="/professionnel/tableau-de-bord">Tableau de bord</NavLink>
            <a onClick={closeMenu} href="/#fonctionnement">Comment ça marche</a>
            <a onClick={closeMenu} href="/#ressources">Conseils & ressources</a>
            <Link className="button button--nav" onClick={closeMenu} to="/professionnels/inscription">
              Espace professionnel <ArrowUpRight size={15} />
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Brand compact />
            <p>Rendre le droit plus accessible, un échange à la fois.</p>
          </div>
          <div>
            <h2>Explorer</h2>
            <Link to="/professionnels">Trouver un professionnel</Link>
            <a href="/#domaines">Domaines juridiques</a>
            <a href="/#fonctionnement">Comment ça marche</a>
          </div>
          <div>
            <h2>La plateforme</h2>
            <Link to="/professionnels/inscription">Inscription professionnelle</Link>
            <a href="/#ressources">Conseils & ressources</a>
            <a href="/#confidentialite">Confidentialité</a>
          </div>
          <div className="footer-note" id="confidentialite">
            <span className="eyebrow">Un service en construction</span>
            <p>Les profils et services seront publiés après vérification. Aucune donnée fictive n’est affichée.</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} La Maison du Droit</span>
          <span>Vous n’êtes plus seul.</span>
        </div>
      </footer>
    </>
  )
}
