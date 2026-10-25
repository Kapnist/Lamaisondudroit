import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { DemoBooking } from './DemoBooking'
import { getDemoReservations, saveDemoReservation } from '../data/demoReservations'

function nextWeekday() {
  const date = new Date()
  do {
    date.setDate(date.getDate() + 1)
  } while (date.getDay() === 0 || date.getDay() === 6)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

describe('DemoBooking', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('simulates an Orange Money payment and confirms a demo appointment', async () => {
    render(<DemoBooking />)

    const date = nextWeekday()
    fireEvent.change(screen.getByLabelText(/1\. choisissez une date/i), { target: { value: date } })
    fireEvent.click(screen.getByRole('radio', { name: /10:30/ }))
    fireEvent.click(screen.getByRole('radio', { name: /orange money/i }))
    expect(screen.getByText(/aucun numéro de téléphone n’est demandé/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /simuler le paiement et confirmer/i }))

    expect(await screen.findByRole('heading', { name: 'Réservation simulée' })).toBeInTheDocument()
    expect(screen.getByText(/Orange Money · simulation/i)).toBeInTheDocument()
    expect(screen.getByText(/10 000 FCFA · aucun débit/i)).toBeInTheDocument()
    expect(getDemoReservations()).toEqual([
      expect.objectContaining({ date, time: '10:30', paymentMethod: 'orange' }),
    ])
  })

  it('does not make an already-booked demo time available again', async () => {
    const date = nextWeekday()
    saveDemoReservation({
      date,
      time: '09:00',
      paymentMethod: 'mtn',
      reference: 'DEMO-EXISTING',
    })
    render(<DemoBooking />)

    fireEvent.change(screen.getByLabelText(/1\. choisissez une date/i), { target: { value: date } })

    await waitFor(() => {
      expect(screen.queryByRole('radio', { name: /09:00/ })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('radio', { name: /10:30/ })).toBeInTheDocument()
  })
})
