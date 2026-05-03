import api from '@/lib/axios'
import type {
  BackendAdminUser,
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
