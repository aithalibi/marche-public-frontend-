import useSWR from 'swr'
import { getOffreFilterOptions } from '@/lib/api/offreFilters'

export function useOffreFilters() {
  const { data, error, isLoading, mutate } = useSWR('/api/offres/filters', getOffreFilterOptions, {
    refreshInterval: 60_000,
  })

  return {
    filterOptions: data ?? { categories: [], localisations: [] },
    error,
    isLoading,
    refresh: mutate,
  }
}
