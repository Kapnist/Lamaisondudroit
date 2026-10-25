import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  FileText,
  HeartHandshake,
  House,
  Landmark,
  MapPin,
  Search,
  Scale,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProfessionalSearch } from '../components/ProfessionalSearch'
import { legalCategories } from '../data/catalogue'
import { getPublishedProfessionals } from '../services/professionalProfiles'
import type { PublishedProfessional } from '../services/professionalProfiles'

const heroImage = '/images/hero-cabinet.jpg'
const categoryIcons = [Scale, HeartHandshake, FileText, House, Landmark, BriefcaseBusiness]
const visibleCategories = legalCategories.slice(0, 6)
const DraftHomeProfessionalCard = import.meta.env.DEV
  ? lazy(() =>
      import('../components/DraftHomeProfessionalCard').then(({ DraftHomeProfessionalCard: card }) => ({
        default: card,
      })),
    )
  : null

export function HomePage() {
  const [featuredProfessionals, setFeaturedProfessionals] = useState<PublishedProfessional[]>([])
  const [professionalLoadError, setProfessionalLoadError] = useState('')

  useEffect(() => {
    let active = true
    void getPublishedProfessionals()
      .then((profiles) => {
        if (active) setFeaturedProfessionals(profiles.slice(0, 3))
      })
      .catch((error: unknown) => {
        if (active) {
          setProfessionalLoadError(
            error instanceof Error ? error.message : 'Les profils professionnels n’ont pas pu être chargés.',
          )
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero__image" style={{ backgroundImage: `url("${heroImage}")` }} />
        <div className="hero__shade" />
        <div className="container hero__content">
          <div className="hero__copy">
            <span className="hero-kicker"><span /> Le droit, plus proche de vous</span>
            <h1>Vos droits méritent <em>les bons alliés.</em></h1>
            <p className="hero__lead">
              Trouvez un professionnel du droit, comprenez vos options et préparez vos démarches en toute confiance.
            </p>
            <div className="hero__actions">
              <Link className="button button--gold" to="/professionnels">
                Trouver un professionnel <ArrowRight size={17} />
              </Link>
              <a className="text-link text-link--light" href="#fonctionnement">
                Découvrir la plateforme <ArrowDown size={16} />
              </a>
            </div>
            <div className="hero__trust">
              <span className="trust-icon"><ShieldCheck size={17} /></span>
              <span>Des profils publiés après vérification</span>
            </div>
          </div>
        </div>
        <div className="container hero__search-wrap">
          <div className="hero-search-card">
            <div className="search-heading">
              <div>
                <span className="eyebrow">Le premier pas</span>
                <h2>Comment pouvons-nous vous aider ?</h2>
              </div>
              <span className="search-heading__icon"><SearchIcon /></span>
            </div>
            <ProfessionalSearch />
            <p className="search-note">Recherchez par nom, domaine juridique ou ville.</p>
          </div>
        </div>
      </section>

      <section className="benefit-strip" aria-label="Les engagements de la plateforme">
        <div className="container benefit-strip__inner">
          <div><ShieldCheck /><span>Profils soumis à vérification</span></div>
          <div><HeartHandshake /><span>Un parcours simple et humain</span></div>
          <div><LockIcon /><span>Vos échanges, en toute confidentialité</span></div>
          <div><MapPinIcon /><span>Une plateforme ancrée au Cameroun</span></div>
        </div>
      </section>

      <section className="section categories-section" id="domaines">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> Explorer par domaine</span>
              <h2>Quel que soit le sujet,<br /><em>commencez ici.</em></h2>
            </div>
            <p>Des repères pour vous orienter vers les domaines qui correspondent à votre situation.</p>
          </div>
          <div className="category-grid">
            {visibleCategories.map((category, index) => {
              const Icon = categoryIcons[index] ?? Scale
              return (
                <Link
                  className="category-card"
                  key={category}
                  to={`/professionnels?q=${encodeURIComponent(category)}`}
                  aria-label={`Trouver un professionnel en ${category}`}
                >
                  <span className="category-card__icon"><Icon size={23} strokeWidth={1.55} /></span>
                  <span className="category-card__title">{category}</span>
                  <ChevronRight className="category-card__arrow" size={17} />
                </Link>
              )
            })}
          </div>
          <div className="categories-footer">
            <p>Ces domaines sont des points d’entrée et ne constituent pas une garantie de compétence.</p>
            <Link className="text-link" to="/professionnels">Voir tous les domaines <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section how-section" id="fonctionnement">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow"><span className="eyebrow-line" /> Simplement, à votre rythme</span>
            <h2>Le droit commence par <em>une rencontre.</em></h2>
            <p>Un chemin clair pour passer de vos questions aux prochaines étapes.</p>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-card__number">01</span>
              <div className="step-card__icon"><Search size={22} /></div>
              <h3>Explorez</h3>
              <p>Recherchez par profession, ville ou domaine pour trouver le bon interlocuteur.</p>
            </article>
            <article className="step-card">
              <span className="step-card__number">02</span>
              <div className="step-card__icon"><UsersRound size={22} /></div>
              <h3>Comparez</h3>
              <p>Découvrez les informations publiées et les qualifications qui ont été vérifiées.</p>
            </article>
            <article className="step-card">
              <span className="step-card__number">03</span>
              <div className="step-card__icon"><BriefcaseBusiness size={22} /></div>
              <h3>Échangez</h3>
              <p>Contactez un professionnel pour organiser la suite adaptée à votre besoin.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section popular-professionals" aria-labelledby="popular-professionals-title">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> Des profils à découvrir</span>
              <h2 id="popular-professionals-title">Les experts les plus <em>sollicités.</em></h2>
            </div>
            <p>
              Le classement par sollicitations sera établi à partir des réservations réelles. En attendant,
              découvrez les profils vérifiés disponibles.
            </p>
          </div>

          {professionalLoadError && <p className="popular-professionals__error" role="alert">{professionalLoadError}</p>}
          {featuredProfessionals.length > 0 || DraftHomeProfessionalCard ? (
            <div className="popular-professionals__grid">
              {DraftHomeProfessionalCard && (
                <Suspense fallback={null}>
                  <DraftHomeProfessionalCard />
                </Suspense>
              )}
              {featuredProfessionals.map((professional) => (
                <article className="popular-professional-card" key={professional.id}>
                  {professional.photoUrl
                    ? <img src={professional.photoUrl} alt="" />
                    : <div className="popular-professional-card__avatar" aria-hidden="true"><UserRound size={30} /></div>}
                  <div className="popular-professional-card__body">
                    <span className="popular-professional-card__verified"><ShieldCheck size={14} /> Profil vérifié</span>
                    <h3>{professional.name}</h3>
                    <p>{professional.profession} · {professional.city}</p>
                    <div className="popular-professional-card__specialties">
                      {professional.specialties.slice(0, 3).map((specialty) => <span key={specialty}>{specialty}</span>)}
                    </div>
                    <Link to={`/professionnels/${professional.id}`} className="text-link">
                      Découvrir le profil <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : !professionalLoadError ? (
            <div className="popular-professionals__empty">
              <UsersRound size={24} />
              <p>Aucun profil vérifié n’est publié pour le moment. Les profils apparaîtront ici après validation.</p>
            </div>
          ) : null}
          <Link className="popular-professionals__directory text-link" to="/professionnels">
            Voir tous les professionnels <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section professionals-callout" id="professionnels">
        <div className="container callout-panel">
          <div className="callout-panel__ornament" aria-hidden="true"><Landmark size={105} strokeWidth={0.7} /></div>
          <div className="callout-panel__copy">
            <span className="eyebrow eyebrow--gold"><span className="eyebrow-line" /> Pour les professionnels du droit</span>
            <h2>Votre expertise mérite<br /><em>d’être visible.</em></h2>
            <p>La plateforme prépare un espace pour présenter votre activité et faciliter la prise de contact.</p>
            <Link className="button button--gold signup-callout-button" to="/professionnels/inscription">
              Préparer mon inscription <ArrowRight size={16} />
            </Link>
          </div>
          <div className="callout-panel__seal"><Sparkles size={19} /><span>Une présence<br />professionnelle</span></div>
        </div>
      </section>

      <section className="section resources-section" id="ressources">
        <div className="container resource-panel">
          <div className="resource-panel__icon"><BookOpen size={28} strokeWidth={1.4} /></div>
          <div>
            <span className="eyebrow"><span className="eyebrow-line" /> S’informer avec confiance</span>
            <h2>Des ressources juridiques <em>en préparation.</em></h2>
            <p>Les conseils et articles seront publiés après validation éditoriale par des professionnels compétents.</p>
          </div>
          <span className="resource-status"><Check size={15} /> Contenus vérifiés avant publication</span>
        </div>
      </section>

      <section className="closing-cta">
        <div className="container closing-cta__inner">
          <div><span className="eyebrow eyebrow--gold">Un premier pas, simplement</span><h2>Vous avez une question ?<br /><em>Commençons par chercher.</em></h2></div>
          <Link className="button button--gold" to="/professionnels">Explorer l’annuaire <ArrowUpRight size={17} /></Link>
        </div>
      </section>
    </>
  )
}

function SearchIcon() {
  return <Search size={19} />
}

function LockIcon() {
  return <ShieldCheck />
}

function MapPinIcon() {
  return <MapPin />
}
