export const legalCategories = [
  'Droit de la famille',
  'Divorce et séparation',
  'Successions et héritage',
  'Droit foncier',
  'Droit immobilier',
  'Droit des locataires',
  'Droit des propriétaires',
  'Droit du travail',
  'Droit des affaires',
  "Création d'entreprise",
  'Droit pénal',
  'Procédures judiciaires',
  'Droits des femmes',
  'Droit des enfants',
  'Violences conjugales',
  "Abus de pouvoir et d'autorité",
  'Fraudes et escroqueries',
  'Litiges avec les administrations',
] as const

export const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bangangté', 'Bamena'] as const
export const professions = ['Avocat', 'Notaire', 'Juriste'] as const
export const regions = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest',
] as const

export const cityRegions: Record<(typeof cities)[number], (typeof regions)[number]> = {
  Douala: 'Littoral',
  Yaoundé: 'Centre',
  Bafoussam: 'Ouest',
  Garoua: 'Nord',
  Bangangté: 'Ouest',
  Bamena: 'Ouest',
}

export function getRegionForCity(city: string): (typeof regions)[number] | undefined {
  const matchingCity = cities.find((item) => item === city)
  return matchingCity ? cityRegions[matchingCity] : undefined
}

export type Professional = {
  id: string
  name: string
  profession: (typeof professions)[number]
  city: (typeof cities)[number]
  specialties: string[]
  verified: boolean
}

// Public profiles remain empty until verified professionals are supplied by the backend.
export const professionals: Professional[] = []

export function filterProfessionals(
  records: Professional[],
  query: string,
  city: string,
  profession: string,
  region = '',
): Professional[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('fr')

  return records.filter((professional) => {
    const matchesQuery =
      !normalizedQuery ||
      [
        professional.name,
        professional.profession,
        professional.city,
        ...professional.specialties,
      ]
        .join(' ')
        .toLocaleLowerCase('fr')
        .includes(normalizedQuery)

    return (
      professional.verified &&
      matchesQuery &&
      (!city || professional.city === city) &&
      (!region || cityRegions[professional.city] === region) &&
      (!profession || professional.profession === profession)
    )
  })
}
