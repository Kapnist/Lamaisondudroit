import { describe, expect, it } from 'vitest'
import { cities, filterProfessionals, type Professional } from './catalogue'

const verifiedLawyer: Professional = {
  id: 'verified-1',
  name: 'Me Amina Exemple',
  profession: 'Avocat',
  city: 'Douala',
  specialties: ['Droit du travail'],
  verified: true,
}

const unverifiedLawyer: Professional = {
  ...verifiedLawyer,
  id: 'unverified-1',
  name: 'Profil non vérifié',
  verified: false,
}

describe('filterProfessionals', () => {
  it('includes Bangangté and Bamena as searchable cities', () => {
    expect(cities).toContain('Bangangté')
    expect(cities).toContain('Bamena')
  })

  it('filters by case-insensitive name, city, and profession', () => {
    expect(filterProfessionals([verifiedLawyer], 'amina', 'Douala', 'Avocat')).toEqual([verifiedLawyer])
  })

  it('matches a legal specialty', () => {
    expect(filterProfessionals([verifiedLawyer], 'travail', '', '')).toEqual([verifiedLawyer])
  })

  it('never returns a profile that has not been verified', () => {
    expect(filterProfessionals([verifiedLawyer, unverifiedLawyer], '', '', '')).toEqual([verifiedLawyer])
  })

  it('returns no profiles for the initial empty catalogue', () => {
    expect(filterProfessionals([], '', '', '')).toEqual([])
  })
})
