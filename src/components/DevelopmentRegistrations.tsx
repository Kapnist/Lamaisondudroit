import { Clock3, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  developmentRegistrationsStorageKey,
  getDevelopmentRegistrations,
} from '../data/developmentRegistrations'
import { getRegionForCity } from '../data/catalogue'

type DevelopmentRegistrationsProps = {
  query: string
  city: string
  profession: string
  region: string
}

export function DevelopmentRegistrations({
  query,
  city,
  profession,
  region,
}: DevelopmentRegistrationsProps) {
  const [allRegistrations, setAllRegistrations] = useState(getDevelopmentRegistrations)

  useEffect(() => {
    function refreshRegistrations(event: StorageEvent) {
      if (event.key === developmentRegistrationsStorageKey || event.key === null) {
        setAllRegistrations(getDevelopmentRegistrations())
      }
    }

    window.addEventListener('storage', refreshRegistrations)
    return () => window.removeEventListener('storage', refreshRegistrations)
  }, [])

  const registrations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    return allRegistrations.filter((registration) => {
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
        (!region || getRegionForCity(registration.city) === region) &&
        (!profession || registration.profession === profession)
      )
    })
  }, [allRegistrations, query, city, profession, region])

  if (registrations.length === 0) return null

  return (
    <section className="development-registrations" aria-labelledby="development-registrations-title">
      <div className="development-registrations__heading">
        <ShieldAlert size={17} />
        <div>
          <h3 id="development-registrations-title">Profils inscrits — prévisualisation locale</h3>
          <p>Ces candidatures ne sont pas vérifiées. Elles sont enregistrées dans ce navigateur de développement et visibles dans l’annuaire avec leur statut.</p>
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
              <span>{registration.profession}{registration.lawyerStatus ? ` ${registration.lawyerStatus.toLocaleLowerCase('fr')}` : ''} · {registration.city}{getRegionForCity(registration.city) ? `, région ${getRegionForCity(registration.city)}` : ''}</span>
              <span>{registration.categories.join(' · ')}</span>
            </div>
            <div className="development-registration-card__status">
              <Clock3 size={14} /> Profil non vérifié
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
