import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearDevelopmentRegistrations,
  saveDevelopmentRegistration,
} from '../data/developmentRegistrations'
import { ProfessionalsPage } from './ProfessionalsPage'

describe('ProfessionalsPage', () => {
  beforeEach(() => {
    clearDevelopmentRegistrations()
  })

  it('shows the search state transparently when no verified profiles are available', () => {
    render(
      <MemoryRouter initialEntries={['/professionnels?q=droit&ville=Douala']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /aucun profil publié pour le moment/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Nom ou spécialité')).toHaveValue('droit')
    expect(within(screen.getByRole('complementary')).getByLabelText('Ville')).toHaveValue('Douala')
    expect(screen.queryByRole('link', { name: /profil/i })).not.toBeInTheDocument()
  })

  it('shows the family-law draft preview for the matching search in development', async () => {
    render(
      <MemoryRouter initialEntries={['/professionnels?q=Droit%20de%20la%20famille']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /aperçu de développement — non publié/i })).toBeInTheDocument()
    expect(screen.getByText('Maître Noupa Rudi')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voir la maquette' })).toHaveAttribute(
      'href',
      '/__dev/professionnels/maitre-noupa-rudi',
    )
  })

  it('does not show the draft preview for a city-filtered search', async () => {
    render(
      <MemoryRouter initialEntries={['/professionnels?q=famille&ville=Douala']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /aperçu de développement/i })).not.toBeInTheDocument()
    })
  })

  it('lists all local registrations with a pending verification status', async () => {
    saveDevelopmentRegistration({
      name: 'Maître Essai',
      profession: 'Avocat',
      city: 'Bamena',
      categories: ['Droit de la famille', 'Droit du travail'],
    })
    saveDevelopmentRegistration({
      name: 'Me Test',
      profession: 'Notaire',
      city: 'Bangangté',
      categories: ['Successions et héritage'],
    })

    render(
      <MemoryRouter initialEntries={['/professionnels']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /candidatures de cette session/i })).toBeInTheDocument()
    expect(screen.getByText('Maître Essai')).toBeInTheDocument()
    expect(screen.getByText('Me Test')).toBeInTheDocument()
    expect(screen.getAllByText('En attente de vérification')).toHaveLength(2)
  })
})
