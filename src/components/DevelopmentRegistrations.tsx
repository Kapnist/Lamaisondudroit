import { Clock3, ShieldAlert } from 'lucide-react'
import { useMemo } from 'react'
import { getDevelopmentRegistrations } from '../data/developmentRegistrations'

type DevelopmentRegistrationsProps = {
  query: string
  city: string
  profession: string
}

export function DevelopmentRegistrations({
  query,
  city,
  profession,
}: DevelopmentRegistrationsProps) {
  const registrations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    return getDevelopmentRegistrations().filter((registration) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          registration.name,
          registration.profession,
          registration.city,
          ...registration.categories,
        ]
          .join(' ')
          .toLocaleLowerCase('fr')
          .includes(normalizedQuery)

      return (
        matchesQuery &&
        (!city || registration.city === city) &&
        (!profession || registration.profession === profession)
      )
    })
  }, [query, city, profession])

  if (registrations.length === 0) return null

  return (
    <section className="development-registrations" aria-labelledby="development-registrations-title">
      <div className="development-registrations__heading">
        <ShieldAlert size={17} />
        <div>
          <h3 id="development-registrations-title">Candidatures de cette session — prévisualisation locale</h3>
          <p>Ces profils ne sont pas publiés ni vérifiés. Ils ne sont visibles que dans ce navigateur de développement.</p>
        </div>
      </div>
      <div className="development-registrations__list">
        {registrations.map((registration) => (
          <article className="development-registration-card" key={registration.id}>
            <div className="development-registration-card__avatar" aria-hidden="true">
              {registration.name.trim().charAt(0).toLocaleUpperCase('fr')}
            </div>
            <div className="development-registration-card__details">
              <strong>{registration.name}</strong>
              <span>{registration.profession} · {registration.city}</span>
              <span>{registration.categories.join(' · ')}</span>
            </div>
            <div className="development-registration-card__status">
              <Clock3 size={14} /> En attente de vérification
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
