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

  it('accepts multiple categories for another profession and saves only a local preview', () => {
    render(
      <MemoryRouter>
        <ProfessionalSignupPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/nom et prénom/i), { target: { value: 'Maître Test' } })
    fireEvent.change(screen.getByLabelText(/profession/i), { target: { value: 'Notaire' } })
    fireEvent.change(screen.getByLabelText(/ville d’exercice/i), { target: { value: 'Douala' } })
    fireEvent.change(screen.getByLabelText('Titre de la section 1 *'), { target: { value: 'Votre accompagnement' } })
    fireEvent.change(screen.getByLabelText('Texte *'), { target: { value: 'Présentation de votre pratique.' } })
    fireEvent.click(screen.getByLabelText('Droit de la famille'))
    fireEvent.click(screen.getByLabelText('Droit du travail'))
    fireEvent.click(screen.getByRole('button', { name: /enregistrer un aperçu local/i }))

    expect(screen.getByRole('heading', { name: 'Maître Test' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Votre accompagnement' })).toBeInTheDocument()
    const preview = within(screen.getByRole('region', { name: /aperçu local/i }))
    expect(preview.getByText('Droit de la famille')).toBeInTheDocument()
    expect(preview.getByText('Droit du travail')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voir dans l’annuaire de démonstration/i })).toHaveAttribute(
      'href',
      '/professionnels?q=Droit%20de%20la%20famille',
    )

    const saved = JSON.parse(localStorage.getItem(developmentRegistrationsStorageKey) ?? '[]')
    expect(saved).toHaveLength(1)
    expect(saved[0].categories).toEqual(['Droit de la famille', 'Droit du travail'])
    expect(saved[0].reviewStatus).toBe('pending_verification')
    expect(screen.getByText(/profil non vérifié/i)).toBeInTheDocument()
  })

  it('requires lawyer status and all five evidence documents before preparing a local preview', () => {
    render(
      <MemoryRouter>
        <ProfessionalSignupPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/profession/i), { target: { value: 'Avocat' } })
    expect(screen.getByLabelText(/statut de l’avocat/i)).toBeRequired()
    expect(screen.getByLabelText(/diplôme obtenu/i)).toBeRequired()
    expect(screen.getByLabelText(/matricule professionnel/i)).toBeRequired()
    expect(screen.getByLabelText(/ordre \/ barreau/i)).toBeRequired()
    expect(screen.getByLabelText(/ville de prestation de serment/i)).toBeRequired()
    expect(screen.getByLabelText(/cabinet où le stage/i)).toBeRequired()
    expect(screen.getByLabelText(/justificatif du diplôme/i)).toBeRequired()
    expect(screen.getByLabelText(/justificatif du matricule/i)).toBeRequired()
    expect(screen.getByLabelText(/justificatif d’inscription à l’ordre/i)).toBeRequired()
    expect(screen.getByLabelText(/attestation de prestation de serment/i)).toBeRequired()
    expect(screen.getByLabelText(/justificatif du stage en cabinet/i)).toBeRequired()

    fireEvent.change(screen.getByLabelText(/nom et prénom/i), { target: { value: 'Avocat Candidat' } })
    fireEvent.change(screen.getByLabelText(/statut de l’avocat/i), { target: { value: 'Stagiaire' } })
    fireEvent.change(screen.getByLabelText(/diplôme obtenu/i), { target: { value: 'Master en droit' } })
    fireEvent.change(screen.getByLabelText(/matricule professionnel/i), { target: { value: 'CM-123' } })
    fireEvent.change(screen.getByLabelText(/ordre \/ barreau/i), { target: { value: 'Ordre des avocats' } })
    fireEvent.change(screen.getByLabelText(/ville de prestation de serment/i), { target: { value: 'Douala' } })
    fireEvent.change(screen.getByLabelText(/cabinet où le stage/i), { target: { value: 'Cabinet Exemple' } })
    fireEvent.change(screen.getByLabelText(/ville d’exercice/i), { target: { value: 'Douala' } })
    fireEvent.click(screen.getByLabelText('Droit de la famille'))
    fireEvent.submit(screen.getByRole('button', { name: /enregistrer un aperçu local/i }).closest('form')!)

    expect(screen.getByRole('alert')).toHaveTextContent(/cinq justificatifs d’avocat sont obligatoires/i)
    expect(screen.queryByRole('heading', { name: 'Avocat Candidat' })).not.toBeInTheDocument()
    expect(localStorage.getItem(developmentRegistrationsStorageKey)).toBeNull()
  })
})
