import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, BriefcaseBusiness, MapPin, Search, ShieldCheck, SlidersHorizontal, UsersRound } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { cities, filterProfessionals, professions, professionals, regions } from '../data/catalogue'
import { ProfessionalSearch } from '../components/ProfessionalSearch'

const DraftDirectoryPreview = import.meta.env.DEV
  ? lazy(() =>
      import('../components/DraftDirectoryPreview').then(({ DraftDirectoryPreview: preview }) => ({
        default: preview,
      })),
    )
  : null

const DevelopmentRegistrations = import.meta.env.DEV
  ? lazy(() =>
      import('../components/DevelopmentRegistrations').then(({ DevelopmentRegistrations: component }) => ({
        default: component,
      })),
    )
  : null

export function ProfessionalsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [city, setCity] = useState(searchParams.get('ville') ?? '')
  const [profession, setProfession] = useState(searchParams.get('profession') ?? '')
  const [region, setRegion] = useState(searchParams.get('region') ?? '')

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
    setCity(searchParams.get('ville') ?? '')
    setProfession(searchParams.get('profession') ?? '')
    setRegion(searchParams.get('region') ?? '')
  }, [searchParams])

  const results = useMemo(
    () => filterProfessionals(professionals, query, city, profession, region),
    [query, city, profession, region],
  )
  const appliedQuery = searchParams.get('q') ?? ''
  const appliedCity = searchParams.get('ville') ?? ''
  const appliedProfession = searchParams.get('profession') ?? ''
  const appliedRegion = searchParams.get('region') ?? ''
  const isDraftProfileSearch =
    import.meta.env.DEV &&
    Boolean(DraftDirectoryPreview) &&
    !appliedCity &&
    !appliedRegion &&
    (!appliedProfession || appliedProfession === 'Avocat') &&
    /famille|noupa|rudi/i.test(appliedQuery)
  const hasDevelopmentRegistrations = Boolean(DevelopmentRegistrations && import.meta.env.DEV)

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query.trim())
    if (city) next.set('ville', city)
    if (profession) next.set('profession', profession)
    if (region) next.set('region', region)
    setSearchParams(next)
  }

  function clearFilters() {
    setQuery('')
    setCity('')
    setProfession('')
    setRegion('')
    setSearchParams({})
  }

  return (
    <>
      <section className="directory-hero">
        <div className="container">
          <div className="breadcrumbs"><Link to="/">Accueil</Link><span>/</span><span>Professionnels</span></div>
          <span className="eyebrow eyebrow--gold"><span className="eyebrow-line" /> Annuaire des professionnels</span>
          <h1>Trouvez le bon interlocuteur<br /><em>pour avancer.</em></h1>
          <p>Parcourez les profils professionnels publiés et vérifiés sur la plateforme.</p>
          <div className="directory-search">
            <ProfessionalSearch compact initialQuery={query} />
          </div>
        </div>
      </section>

      <section className="directory-section section">
        <div className="container directory-layout">
          <aside className="filters-card">
            <div className="filters-heading"><SlidersHorizontal size={18} /><h2>Affiner la recherche</h2></div>
            <form onSubmit={applyFilters}>
              <label className="filter-label" htmlFor="directory-query">Nom ou spécialité</label>
              <div className="filter-input"><Search size={16} /><input id="directory-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. droit du travail" /></div>
              <label className="filter-label" htmlFor="directory-profession">Profession</label>
              <select id="directory-profession" className="filter-select" value={profession} onChange={(event) => setProfession(event.target.value)}>
                <option value="">Toutes les professions</option>
                {professions.map((item) => <option key={item}>{item}</option>)}
              </select>
              <label className="filter-label" htmlFor="directory-city">Ville</label>
              <select id="directory-city" className="filter-select" value={city} onChange={(event) => setCity(event.target.value)}>
                <option value="">Toutes les villes</option>
                {cities.map((item) => <option key={item}>{item}</option>)}
              </select>
              <label className="filter-label" htmlFor="directory-region">Région</label>
              <select id="directory-region" className="filter-select" value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="">Toutes les régions</option>
                {regions.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button className="button button--nav filter-submit" type="submit">Appliquer les filtres <ArrowRight size={16} /></button>
              <button className="clear-filters" type="button" onClick={clearFilters}>Effacer les filtres</button>
            </form>
          </aside>

          <div className="directory-results" aria-live="polite">
            <div className="results-heading">
              <div><span className="eyebrow">L’annuaire</span><h2>Professionnels du droit</h2></div>
              <span className="results-count">
                {results.length} profil{results.length === 1 ? '' : 's'} vérifié{results.length === 1 ? '' : 's'}
              </span>
            </div>
            {results.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon"><UsersRound size={25} /></div>
                <span className="eyebrow">Annuaire en cours de constitution</span>
                <h3>Aucun profil publié pour le moment</h3>
                <p>
                  Les profils apparaîtront ici après vérification. Nous préférons attendre les premiers professionnels validés plutôt que d’afficher des profils fictifs.
                </p>
                {(query || city || profession || region) && <button className="text-link" type="button" onClick={clearFilters}>Effacer la recherche <ArrowRight size={15} /></button>}
              </div>
            ) : (
              <div className="professional-list">
                {results.map((professional) => (
                  <article className="professional-card" key={professional.id}>
                    <div className="professional-card__avatar"><BriefcaseBusiness size={24} /></div>
                    <div className="professional-card__details">
                      <div className="professional-card__name">{professional.name} <span><ShieldCheck size={14} /> Vérifié</span></div>
                      <p>{professional.profession} · {professional.city}</p>
                      <div className="professional-card__specialties">{professional.specialties.join(' · ')}</div>
                    </div>
                    <button className="button button--outline" type="button" disabled>Profil indisponible</button>
                  </article>
                ))}
              </div>
            )}
            {isDraftProfileSearch && DraftDirectoryPreview && (
              <Suspense fallback={null}>
                <DraftDirectoryPreview />
              </Suspense>
            )}
            {hasDevelopmentRegistrations && DevelopmentRegistrations && (
              <Suspense fallback={null}>
                <DevelopmentRegistrations query={appliedQuery} city={appliedCity} profession={appliedProfession} region={appliedRegion} />
              </Suspense>
            )}
            <div className="directory-disclaimer"><MapPin size={15} /><span>La présence dans un domaine ne constitue pas une garantie de compétence juridique.</span></div>
          </div>
        </div>
      </section>
    </>
  )
}
