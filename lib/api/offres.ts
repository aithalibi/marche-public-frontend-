import api from '@/lib/axios'
import type { Offre, OffresFilters, OffresPage, SuiviStatus } from '@/types'

export async function getOffres(filters: OffresFilters = {}): Promise<OffresPage> {
  const { data } = await api.get<OffresPage>('/api/offres', { params: filters })
  return data
}

export async function getOffre(id: string): Promise<Offre> {
  const { data } = await api.get<Offre>(`/api/offres/${id}`)
  return data
}

export async function updateSuivi(offreId: string, status: SuiviStatus): Promise<void> {
  await api.patch(`/api/offres/${offreId}/suivi`, { status })
}

export async function removeSuivi(offreId: string): Promise<void> {
  await api.delete(`/api/offres/${offreId}/suivi`)
}
