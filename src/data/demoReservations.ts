export type DemoPaymentMethod = 'mtn' | 'orange'

export type DemoReservation = {
  date: string
  time: string
  paymentMethod: DemoPaymentMethod
  reference: string
}

const storageKey = 'lamaisondudroit.demo-reservations.v1'

function isDemoReservation(value: unknown): value is DemoReservation {
  if (typeof value !== 'object' || value === null) return false

  const reservation = value as Record<string, unknown>
  return (
    typeof reservation.date === 'string' &&
    typeof reservation.time === 'string' &&
    (reservation.paymentMethod === 'mtn' || reservation.paymentMethod === 'orange') &&
    typeof reservation.reference === 'string'
  )
}

export function getDemoReservations(): DemoReservation[] {
  const stored = window.localStorage.getItem(storageKey)
  if (!stored) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(stored)
  } catch {
    throw new Error('Les réservations de démonstration enregistrées sont illisibles. Effacez les données locales du site pour continuer.')
  }

  if (!Array.isArray(parsed) || !parsed.every(isDemoReservation)) {
    throw new Error('Les réservations de démonstration enregistrées sont invalides. Effacez les données locales du site pour continuer.')
  }

  return parsed
}

export function saveDemoReservation(reservation: DemoReservation): boolean {
  const reservations = getDemoReservations()
  if (reservations.some(({ date, time }) => date === reservation.date && time === reservation.time)) {
    return false
  }

  window.localStorage.setItem(storageKey, JSON.stringify([...reservations, reservation]))
  return true
}
