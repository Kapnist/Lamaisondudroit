import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ShareProfileButton } from './ShareProfileButton'

describe('ShareProfileButton', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('opens explicit sharing options for WhatsApp, Facebook, and Instagram', () => {
    render(<ShareProfileButton name="Maître Test" description="Avocat" />)

    fireEvent.click(screen.getByRole('button', { name: /partager le profil/i }))

    expect(screen.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', expect.stringContaining('wa.me'))
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute('href', expect.stringContaining('facebook.com/sharer'))
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute('href', 'https://www.instagram.com/')
    expect(screen.getByRole('button', { name: /copier le lien/i })).toBeInTheDocument()
  })

  it('copies the profile URL when selected from the share menu', async () => {
    render(<ShareProfileButton name="Maître Test" description="Avocat" />)
    fireEvent.click(screen.getByRole('button', { name: /partager le profil/i }))
    fireEvent.click(screen.getByRole('button', { name: /copier le lien/i }))

    expect(await screen.findByRole('status')).toHaveTextContent('Lien du profil copié.')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href)
  })

  it('warns that a development draft link is local only', () => {
    render(<ShareProfileButton name="Maître Test" description="Avocat" isDraft />)

    expect(screen.getByText(/adresse de prévisualisation est locale/i)).toBeInTheDocument()
  })
})
