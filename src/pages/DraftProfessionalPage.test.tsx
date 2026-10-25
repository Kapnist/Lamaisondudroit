import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { noupaRudiDraft } from '../data/draftProfiles'
import { DraftProfessionalPage } from './DraftProfessionalPage'

describe('DraftProfessionalPage', () => {
  it('shows the supplied profile details with an explicit demo warning and no live booking', () => {
    render(
      <MemoryRouter>
        <DraftProfessionalPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Maître Noupa Rudi' })).toBeInTheDocument()
    expect(screen.getByText('Avocat · Droit de la famille')).toBeInTheDocument()
    expect(screen.getByText('45 minutes')).toBeInTheDocument()
    expect(screen.getAllByText(/10.000\s*FCFA/)).toHaveLength(2)
    expect(screen.getByText(/profil fictif de démonstration — ne représente pas un professionnel réel/i)).toBeInTheDocument()
    expect(screen.getByText(/vérification à confirmer/i)).toBeInTheDocument()
    expect(screen.getByText(/cette fiche de démonstration est publique/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /essayer la réservation démo/i })).toHaveAttribute('href', '#reservation-demo')
    expect(screen.getByText(/simulation sans transaction réelle/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /réserver une consultation — démonstration/i })).toBeInTheDocument()
    expect(screen.getByText(/aucun paiement MTN ou Orange n’est envoyé/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /protéger vos droits, préparer votre avenir/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Violences conjugales' })).toBeInTheDocument()
    expect(screen.getByText(/démarches et mesures de protection envisageables/i)).toBeInTheDocument()
    expect(screen.getByText(/texte et les informations de cette maquette restent à valider/i)).toBeInTheDocument()
  })

  it('keeps the draft out of the public directory dataset', () => {
    expect(noupaRudiDraft.verified).toBe(false)
    expect(noupaRudiDraft.published).toBe(false)
  })
})
