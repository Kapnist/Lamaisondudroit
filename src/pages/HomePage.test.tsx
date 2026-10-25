import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('provides a working path to the directory and clearly labels the local draft profile', async () => {
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
    const draftCard = (await screen.findByRole('heading', { name: 'Maître Noupa Rudi' })).closest('article')
    expect(draftCard).not.toBeNull()
    if (!draftCard) throw new Error('La carte de maquette doit être contenue dans un article.')
    expect(within(draftCard).getByText(/Maquette · non vérifié/i)).toBeInTheDocument()
    expect(within(draftCard).getByText('Droit de la famille')).toBeInTheDocument()
    expect(within(draftCard).getByRole('img', { name: /maquette du profil de maître noupa rudi/i })).toBeInTheDocument()
    expect(within(draftCard).getByRole('link', { name: /voir le profil/i })).toHaveAttribute(
      'href',
      '/professionnels/demo/maitre-noupa-rudi',
    )
    expect(screen.queryByText('Me Amina Exemple')).not.toBeInTheDocument()
  })
})
