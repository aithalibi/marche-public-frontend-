import api from '@/lib/axios'
import type {
  BackendAdminUser,
  AdminEmailResponse,
  AdminLogItem,
  AdminMarketsResponse,
  AdminSettingsResponse,
  AdminStatisticsResponse,
  BackendPage,
  BackendScraperLog,
  Compte,
  ScrapingJob,
} from '@/types'

export async function getComptes(): Promise<Compte[]> {
  const { data } = await api.get<BackendAdminUser[]>('/api/admin/users')
  return data.map(mapAdminUser)
}

export async function updateCompteRole(id: string, role: Compte['role']): Promise<Compte> {
  const { data } = await api.patch<BackendAdminUser>(`/api/admin/users/${id}/role`, { role })
  return mapAdminUser(data)
}

export async function getScrapingJobs(): Promise<ScrapingJob[]> {
  const { data } = await api.get<BackendPage<BackendScraperLog>>('/api/admin/scraper/logs')
  return data.content.map(mapScraperLog)
}

export async function triggerScraping(): Promise<void> {
  await api.post('/api/offres/scrape')
}

export async function getAdminMarkets(): Promise<AdminMarketsResponse> {
  const { data } = await api.get<AdminMarketsResponse>('/api/admin/platform/markets')
  return data
}

export async function deleteAdminMarket(id: string): Promise<void> {
  await api.delete(`/api/admin/platform/markets/${id}`)
}

export async function getAdminStatistics(): Promise<AdminStatisticsResponse> {
  const { data } = await api.get<AdminStatisticsResponse>('/api/admin/platform/statistics')
  return data
}

export async function getAdminEmails(): Promise<AdminEmailResponse> {
  const { data } = await api.get<AdminEmailResponse>('/api/admin/platform/emails')
  return data
}

export async function sendAdminTestEmail(to?: string): Promise<string> {
  const { data } = await api.post<{ message: string }>('/api/admin/platform/emails/test', { to })
  return data.message
}

export async function getAdminLogs(): Promise<AdminLogItem[]> {
  const { data } = await api.get<AdminLogItem[]>('/api/admin/platform/logs')
  return data
}

export async function getAdminSettings(): Promise<AdminSettingsResponse> {
  const { data } = await api.get<AdminSettingsResponse>('/api/admin/platform/settings')
  return data
}

function mapAdminUser(user: BackendAdminUser): Compte {
  return {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    actif: user.statut === 'ACTIF',
    createdAt: user.dateInscription,
    statut: user.statut,
  }
}

function mapScraperLog(log: BackendScraperLog): ScrapingJob {
  return {
    id: log.id,
    status: toFrontendScrapingStatus(log.statut),
    offresCollectees: log.nbOffres ?? 0,
    offresNouvelles: log.nbOffres ?? 0,
    startedAt: log.dateDebut,
    finishedAt: log.dateFin,
    erreur: log.erreur,
    message: log.message,
  }
}

function toFrontendScrapingStatus(status: BackendScraperLog['statut']): ScrapingJob['status'] {
  switch (status) {
    case 'EN_COURS':
      return 'EN_COURS'
    case 'ERREUR':
      return 'ERREUR'
    case 'SUCCES':
      return 'TERMINE'
  }
}
