import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DevelopmentRegistrations } from '../components/DevelopmentRegistrations'
import {
  clearDevelopmentRegistrations,
  developmentRegistrationsStorageKey,
  saveDevelopmentRegistration,
} from '../data/developmentRegistrations'
import { ProfessionalsPage } from './ProfessionalsPage'
import * as professionalProfiles from '../services/professionalProfiles'

describe('ProfessionalsPage', () => {
  beforeEach(() => {
    clearDevelopmentRegistrations()
  })

  it('shows the search state transparently when no verified profiles are available', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    render(
      <MemoryRouter initialEntries={['/professionnels?q=droit&ville=Douala']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /aucun profil publié pour le moment/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Nom ou spécialité')).toHaveValue('droit')
    expect(within(screen.getByRole('complementary')).getByLabelText('Ville')).toHaveValue('Douala')
    expect(screen.queryByRole('link', { name: /profil/i })).not.toBeInTheDocument()
  })

  it('shows the family-law draft preview for the matching search in development', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    render(
      <MemoryRouter initialEntries={['/professionnels?q=Droit%20de%20la%20famille']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /profil fictif de démonstration — non vérifié/i })).toBeInTheDocument()
    expect(screen.getByText('Maître Noupa Rudi')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voir le profil' })).toHaveAttribute(
      'href',
      '/professionnels/demo/maitre-noupa-rudi',
    )
    expect(screen.getByRole('img', { name: /maquette du profil de maître noupa rudi/i })).toBeInTheDocument()
  })

  it.each(['avocat', 'divorce'])('shows the draft profile for a related search: %s', async (query) => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    render(
      <MemoryRouter initialEntries={[`/professionnels?q=${encodeURIComponent(query)}`]}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /profil fictif de démonstration — non vérifié/i })).toBeInTheDocument()
    expect(screen.getByText('Maître Noupa Rudi')).toBeInTheDocument()
  })

  it('does not show the draft profile for an unrelated specialty search', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    render(
      <MemoryRouter initialEntries={['/professionnels?q=droit%20p%C3%A9nal']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /profil fictif de démonstration/i })).not.toBeInTheDocument()
    })
  })

  it('shows the clearly unverified Maître Rudi example on an unfiltered directory visit in development', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    render(
      <MemoryRouter initialEntries={['/professionnels']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /profil fictif de démonstration — non vérifié/i })).toBeInTheDocument()
    expect(screen.getByText('Maître Noupa Rudi')).toBeInTheDocument()
    expect(screen.getByText('Avocat · Droit de la famille')).toBeInTheDocument()
    expect(screen.getByText('Profil fictif · non vérifié')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voir le profil' })).toHaveAttribute(
      'href',
      '/professionnels/demo/maitre-noupa-rudi',
    )
  })

  it('does not show the draft preview for a city-filtered search', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    render(
      <MemoryRouter initialEntries={['/professionnels?q=famille&ville=Douala']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /profil fictif de démonstration/i })).not.toBeInTheDocument()
    })
  })

  it('lists all local registrations with a pending verification status', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    saveDevelopmentRegistration({
      name: 'Maître Essai',
      profession: 'Avocat',
      lawyerStatus: 'Stagiaire',
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

    expect(await screen.findByRole('heading', { name: /profils inscrits — prévisualisation locale/i })).toBeInTheDocument()
    expect(screen.getByText('Maître Essai')).toBeInTheDocument()
    expect(screen.getByText(/Avocat stagiaire · Bamena/)).toBeInTheDocument()
    expect(screen.getByText('Me Test')).toBeInTheDocument()
    expect(screen.getAllByText('Profil non vérifié')).toHaveLength(2)
    expect(screen.getByText(/Avocat stagiaire · Bamena/)).toBeInTheDocument()
    expect(screen.getByText(/Bamena, région Ouest/)).toBeInTheDocument()
    expect(screen.getByText(/Bangangté, région Ouest/)).toBeInTheDocument()
  })

  it('filters registered profiles by region', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([])
    saveDevelopmentRegistration({
      name: 'Avocate Ouest',
      profession: 'Avocat',
      city: 'Bafoussam',
      categories: ['Droit de la famille'],
    })
    saveDevelopmentRegistration({
      name: 'Avocat Littoral',
      profession: 'Avocat',
      city: 'Douala',
      categories: ['Droit du travail'],
    })

    render(
      <MemoryRouter initialEntries={['/professionnels?region=Ouest']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Avocate Ouest')).toBeInTheDocument()
    expect(screen.queryByText('Avocat Littoral')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Région')).toHaveValue('Ouest')
  })

  it('refreshes the directory when another tab registers a profile', async () => {
    render(
      <DevelopmentRegistrations query="" city="" profession="" region="" />,
    )

    localStorage.setItem(
      developmentRegistrationsStorageKey,
      JSON.stringify([{
        id: 'other-tab-profile',
        name: 'Profil ajouté ailleurs',
        profession: 'Avocat',
        city: 'Douala',
        categories: ['Droit de la famille'],
        reviewStatus: 'pending_verification',
      }]),
    )
    fireEvent(window, new StorageEvent('storage', { key: developmentRegistrationsStorageKey }))

    expect(await screen.findByText('Profil ajouté ailleurs')).toBeInTheDocument()
  })

  it('shows verified professionals for a matching specialty and links to their public profile', async () => {
    vi.spyOn(professionalProfiles, 'getPublishedProfessionals').mockResolvedValueOnce([
      {
        id: 'profile-family-001',
        name: 'Me Test Vérifié',
        profession: 'Avocat',
        city: 'Douala',
        specialties: ['Droit de la famille'],
        verified: true,
        photoUrl: null,
        presentationSections: [{ title: 'Notre approche', text: 'Accompagnement.' }],
      },
    ])
    render(
      <MemoryRouter initialEntries={['/professionnels?q=Droit%20de%20la%20famille']}>
        <ProfessionalsPage />
      </MemoryRouter>,
    )

    const publishedProfile = (await screen.findByText('Me Test Vérifié')).closest('article')
    expect(publishedProfile).not.toBeNull()
    if (!publishedProfile) throw new Error('Le profil publié doit être présenté dans une carte.')
    expect(within(publishedProfile).getByRole('link', { name: /voir le profil/i })).toHaveAttribute(
      'href',
      '/professionnels/profile-family-001',
    )
  })
})
