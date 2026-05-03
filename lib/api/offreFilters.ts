import api from '@/lib/axios'
import type { OffreFilterOptions } from '@/types'

export async function getOffreFilterOptions(): Promise<OffreFilterOptions> {
  const { data } = await api.get<OffreFilterOptions>('/api/offres/filters')
  return data
}
