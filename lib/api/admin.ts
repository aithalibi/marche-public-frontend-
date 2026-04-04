import api from '@/lib/axios'
import type { Compte, ScrapingJob } from '@/types'

export async function getComptes(): Promise<Compte[]> {
  const { data } = await api.get<Compte[]>('/api/admin/comptes')
  return data
}

export async function toggleCompteActif(id: string, actif: boolean): Promise<Compte> {
  const { data } = await api.patch<Compte>(`/api/admin/comptes/${id}`, { actif })
  return data
}

export async function deleteCompte(id: string): Promise<void> {
  await api.delete(`/api/admin/comptes/${id}`)
}

export async function triggerScraping(): Promise<ScrapingJob> {
  const { data } = await api.post<ScrapingJob>('/api/admin/scraping/trigger')
  return data
}

export async function getScrapingJobs(): Promise<ScrapingJob[]> {
  const { data } = await api.get<ScrapingJob[]>('/api/admin/scraping/jobs')
  return data
}
