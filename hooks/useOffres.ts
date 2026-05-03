import useSWR from 'swr'
import { getOffres, getOffre, updateSuivi, removeSuivi } from '@/lib/api/offres'
import type { OffresFilters, SuiviStatus } from '@/types'

export function useOffres(filters: OffresFilters = {}) {
  const key = ['/api/offres/search', JSON.stringify(filters)]
  const { data, error, isLoading, mutate } = useSWR(key, () => getOffres(filters))
  return { data, error, isLoading, mutate }
}

export function useOffre(id: string | null) {
  const { data, error, isLoading } = useSWR(id ? `/api/offres/${id}` : null, () =>
    id ? getOffre(id) : null
  )
  return { offre: data, error, isLoading }
}

export function useSuiviActions() {
  async function setStatus(offreId: string, status: SuiviStatus) {
    await updateSuivi(offreId, status)
  }

  async function remove(offreId: string) {
    await removeSuivi(offreId)
  }

  return { setStatus, remove }
}
