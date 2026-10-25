import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cities, professions } from '../data/catalogue'

type ProfessionalSearchProps = {
  compact?: boolean
  initialQuery?: string
}

export function ProfessionalSearch({ compact = false, initialQuery = '' }: ProfessionalSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState('')
  const [profession, setProfession] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (city) params.set('ville', city)
    if (profession) params.set('profession', profession)
    navigate(`/professionnels${params.size ? `?${params.toString()}` : ''}`)
  }

  return (
    <form className={`search-form${compact ? ' search-form--compact' : ''}`} onSubmit={handleSubmit}>
      <label className="search-field search-field--query">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">Nom, spécialité ou besoin</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nom, spécialité ou besoin"
          type="search"
        />
      </label>
      <label className="search-field">
        <MapPin size={18} aria-hidden="true" />
        <span className="sr-only">Ville</span>
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="">Toutes les villes</option>
          {cities.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      {!compact && (
        <label className="search-field search-field--profession">
          <span className="sr-only">Profession</span>
          <select value={profession} onChange={(event) => setProfession(event.target.value)}>
            <option value="">Tous les professionnels</option>
            {professions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      )}
      <button className="button button--gold search-submit" type="submit">
        {compact ? 'Rechercher' : 'Trouver un professionnel'} <ArrowRight size={17} />
      </button>
    </form>
  )
}
