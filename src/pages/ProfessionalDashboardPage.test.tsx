import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProfessionalDashboardPage } from './ProfessionalDashboardPage'

describe('ProfessionalDashboardPage', () => {
  it('does not present a local preview as an authenticated professional dashboard', async () => {
    render(
      <MemoryRouter>
        <ProfessionalDashboardPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /tableau de bord/i })).toBeInTheDocument()
    expect(screen.getByText(/nécessite une configuration supabase/i)).toBeInTheDocument()
  })
})
