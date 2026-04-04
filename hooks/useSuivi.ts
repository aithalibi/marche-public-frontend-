import useSWR from 'swr'
import { getOffres, updateSuivi, removeSuivi } from '@/lib/api/offres'
import type { SuiviStatus } from '@/types'

export function useSuivi() {
  const { data, error, isLoading, mutate } = useSWR('/api/offres/suivi', () =>
    getOffres({ size: 100 }) // fetch offres that have suivi
  )

  const offresWithSuivi = data?.content.filter((o) => o.suivi) ?? []

  async function setStatus(offreId: string, status: SuiviStatus) {
    await updateSuivi(offreId, status)
    mutate()
  }

  async function remove(offreId: string) {
    await removeSuivi(offreId)
    mutate()
  }

  return { offresWithSuivi, isLoading, error, setStatus, remove }
}
