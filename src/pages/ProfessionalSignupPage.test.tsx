import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearDevelopmentRegistrations,
  developmentRegistrationsStorageKey,
} from '../data/developmentRegistrations'
import { ProfessionalSignupPage } from './ProfessionalSignupPage'

describe('ProfessionalSignupPage', () => {
  beforeEach(() => {
    clearDevelopmentRegistrations()
  })

  it('accepts multiple practice categories and saves only a local development preview', () => {
    render(
      <MemoryRouter>
        <ProfessionalSignupPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/nom et prénom/i), { target: { value: 'Maître Test' } })
    fireEvent.change(screen.getByLabelText(/profession/i), { target: { value: 'Avocat' } })
    fireEvent.change(screen.getByLabelText(/ville d’exercice/i), { target: { value: 'Douala' } })
    fireEvent.click(screen.getByLabelText('Droit de la famille'))
    fireEvent.click(screen.getByLabelText('Droit du travail'))
    fireEvent.click(screen.getByRole('button', { name: /enregistrer un aperçu local/i }))

    expect(screen.getByRole('heading', { name: 'Maître Test' })).toBeInTheDocument()
    const preview = within(screen.getByRole('region', { name: /aperçu local/i }))
    expect(preview.getByText('Droit de la famille')).toBeInTheDocument()
    expect(preview.getByText('Droit du travail')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voir dans l’annuaire de démonstration/i })).toHaveAttribute(
      'href',
      '/professionnels?q=Droit%20de%20la%20famille',
    )

    const saved = JSON.parse(sessionStorage.getItem(developmentRegistrationsStorageKey) ?? '[]')
    expect(saved).toHaveLength(1)
    expect(saved[0].categories).toEqual(['Droit de la famille', 'Droit du travail'])
    expect(saved[0].reviewStatus).toBe('pending_verification')
  })
})
