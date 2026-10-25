export type DevelopmentRegistration = {
  id: string
  name: string
  profession: string
  city: string
  categories: string[]
  reviewStatus: 'pending_verification'
}

const storageKey = 'lamaisondudroit:development-registrations'

export function saveDevelopmentRegistration(
  input: Omit<DevelopmentRegistration, 'id' | 'reviewStatus'>,
): DevelopmentRegistration {
  if (!import.meta.env.DEV) {
    throw new Error('Les inscriptions de démonstration sont réservées au développement.')
  }

  const registration: DevelopmentRegistration = {
    ...input,
    id: crypto.randomUUID(),
    reviewStatus: 'pending_verification',
  }
  const registrations = getDevelopmentRegistrations()
  localStorage.setItem(storageKey, JSON.stringify([...registrations, registration]))
  return registration
}

export function getDevelopmentRegistrations(): DevelopmentRegistration[] {
  if (!import.meta.env.DEV) return []

  let stored = localStorage.getItem(storageKey)
  if (!stored) {
    stored = sessionStorage.getItem(storageKey)
    if (stored) {
      localStorage.setItem(storageKey, stored)
      sessionStorage.removeItem(storageKey)
    }
  }
  if (!stored) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(stored)
  } catch {
    throw new Error('Les inscriptions de démonstration enregistrées ne sont pas un JSON valide.')
  }
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof item.id === 'string' &&
        'name' in item &&
        typeof item.name === 'string' &&
        'profession' in item &&
        typeof item.profession === 'string' &&
        'city' in item &&
        typeof item.city === 'string' &&
        'categories' in item &&
        Array.isArray(item.categories) &&
        item.categories.every((category: unknown) => typeof category === 'string') &&
        'reviewStatus' in item &&
        item.reviewStatus === 'pending_verification',
    )
  ) {
    throw new Error('Les inscriptions de démonstration enregistrées ont un format inattendu.')
  }

  return parsed
}

export function clearDevelopmentRegistrations(): void {
  if (import.meta.env.DEV) {
    localStorage.removeItem(storageKey)
    sessionStorage.removeItem(storageKey)
  }
}

export const developmentRegistrationsStorageKey = storageKey
