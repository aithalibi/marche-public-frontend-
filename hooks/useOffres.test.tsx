import { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOffre, useOffres, useSuiviActions } from './useOffres'
import { getOffre, getOffres, removeSuivi, updateSuivi } from '@/lib/api/offres'

vi.mock('@/lib/api/offres', () => ({
  getOffres: vi.fn(),
  getOffre: vi.fn(),
  updateSuivi: vi.fn(),
  removeSuivi: vi.fn(),
}))

function wrapper({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  )
}

describe('useOffres hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads offers with the provided filters', async () => {
    vi.mocked(getOffres).mockResolvedValue({
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
    })

    const { result } = renderHook(() => useOffres({ search: 'ecole' }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(getOffres).toHaveBeenCalledWith({ search: 'ecole' })
    expect(result.current.data?.content).toEqual([])
  })

  it('does not load an offer when id is null', () => {
    const { result } = renderHook(() => useOffre(null), { wrapper })

    expect(getOffre).not.toHaveBeenCalled()
    expect(result.current.offre).toBeUndefined()
  })

  it('loads an offer by id', async () => {
    vi.mocked(getOffre).mockResolvedValue({
      id: 'offre-1',
      reference: 'AO-1',
      titre: 'Offre test',
      acheteur: 'Acheteur',
      region: 'Rabat',
      secteur: 'Services',
      typeMarche: 'SERVICES',
      datePublication: '2026-05-01',
      dateLimiteSoumission: '2026-06-01',
      statut: 'OUVERT',
      sourceUrl: 'https://example.com',
    })

    const { result } = renderHook(() => useOffre('offre-1'), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(getOffre).toHaveBeenCalledWith('offre-1')
    expect(result.current.offre?.titre).toBe('Offre test')
  })

  it('exposes suivi actions', async () => {
    vi.mocked(updateSuivi).mockResolvedValue()
    vi.mocked(removeSuivi).mockResolvedValue()

    const { result } = renderHook(() => useSuiviActions())

    await result.current.setStatus('offre-1', 'En analyse')
    await result.current.remove('offre-1')

    expect(updateSuivi).toHaveBeenCalledWith('offre-1', 'En analyse')
    expect(removeSuivi).toHaveBeenCalledWith('offre-1')
  })
})
