import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('provides a working path to the directory without presenting fictional professionals', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /vos droits méritent les bons alliés/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /trouver un professionnel/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /explorer l’annuaire/i })).toHaveAttribute('href', '/professionnels')
    expect(container.querySelector('.callout-panel__seal')?.textContent).toContain('Une présence')
    expect(container.querySelector('.callout-panel__seal')?.textContent).toContain('professionnelle')
    expect(screen.queryByText('Me Amina Exemple')).not.toBeInTheDocument()
  })
})
