import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import * as professionalProfiles from '../services/professionalProfiles'
import { ProfessionalProfilePage } from './ProfessionalProfilePage'

describe('ProfessionalProfilePage', () => {
  it('renders the validated profile sections for a profile opened from the directory', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionalById').mockResolvedValueOnce({
      id: 'profile-family-001',
      name: 'Me Test Vérifié',
      profession: 'Avocat',
      city: 'Douala',
      specialties: ['Droit de la famille'],
      verified: true,
      photoUrl: null,
      presentationSections: [
        { title: 'Droit de la famille', text: 'Conseil et accompagnement adaptés.' },
        { title: 'Notre approche', text: 'Écoute et clarté à chaque étape.' },
      ],
    })

    render(
      <MemoryRouter initialEntries={['/professionnels/profile-family-001']}>
        <Routes>
          <Route path="/professionnels/:id" element={<ProfessionalProfilePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Me Test Vérifié' })).toBeInTheDocument()
    expect(screen.getByText('Professionnel vérifié')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Notre approche' })).toBeInTheDocument()
    expect(screen.getByText('Écoute et clarté à chaque étape.')).toBeInTheDocument()
  })
})
