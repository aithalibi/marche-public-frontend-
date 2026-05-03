import api from '@/lib/axios'
import type {
  BackendOffre,
  BackendPage,
  BackendSuiviEntry,
  Offre,
  OffresFilters,
  OffresPage,
  SuiviStatus,
} from '@/types'

const DETAIL_FETCH_SIZE = 1000

export async function getOffres(filters: OffresFilters = {}): Promise<OffresPage> {
  const [offresResponse, suivis] = await Promise.all([
    api.get<BackendPage<BackendOffre>>('/api/offres/search', {
      params: toBackendFilters(filters),
    }),
    getSuivisSafe(),
  ])

  const suiviByOffreId = new Map(suivis.map((suivi) => [suivi.offreId, suivi]))

  return {
    ...offresResponse.data,
    content: offresResponse.data.content.map((offre) =>
      mapBackendOffre(offre, suiviByOffreId.get(offre.id))
    ),
  }
}

export async function getOffre(id: string): Promise<Offre> {
  const [offres, suivis] = await Promise.all([
    api.get<BackendPage<BackendOffre>>('/api/offres/search', {
      params: { page: 0, size: DETAIL_FETCH_SIZE },
    }),
    getSuivisSafe(),
  ])

  const offre = offres.data.content.find((item) => item.id === id)
  if (!offre) {
    throw new Error(`Offre ${id} introuvable`)
  }

  const suivi = suivis.find((item) => item.offreId === id)
  return mapBackendOffre(offre, suivi)
}

export async function updateSuivi(offreId: string, status: SuiviStatus): Promise<void> {
  const suivis = await getSuivisSafe()
  const existing = suivis.find((item) => item.offreId === offreId)
  const payload = { statut: toBackendSuiviStatus(status) }

  if (existing) {
    await api.patch(`/api/suivi/${existing.id}`, payload)
    return
  }

  await api.post(`/api/suivi/${offreId}`, payload)
}

export async function removeSuivi(offreId: string): Promise<void> {
  const suivis = await getSuivisSafe()
  const existing = suivis.find((item) => item.offreId === offreId)

  if (!existing) {
    return
  }

  await api.delete(`/api/suivi/${existing.id}`)
}

export async function getSuivis(): Promise<BackendSuiviEntry[]> {
  const { data } = await api.get<BackendSuiviEntry[]>('/api/suivi')
  return data
}

async function getSuivisSafe(): Promise<BackendSuiviEntry[]> {
  try {
    return await getSuivis()
  } catch {
    return []
  }
}

function toBackendFilters(filters: OffresFilters) {
  return {
    q: filters.search,
    secteur: filters.secteur ?? filters.typeMarche,
    localisation: filters.region,
    statut: filters.statut,
    dateMin: filters.dateMin,
    dateLimiteMax: filters.dateLimiteMax,
    page: filters.page ?? 0,
    size: filters.size ?? 20,
    sort: 'date_desc',
  }
}

function mapBackendOffre(offre: BackendOffre, suivi?: BackendSuiviEntry): Offre {
  return {
    id: offre.id,
    reference: offre.reference,
    titre: offre.intitule,
    acheteur: offre.organisme,
    region: offre.localisation,
    secteur: offre.secteur,
    typeMarche: inferTypeMarche(offre.secteur, offre.intitule),
    datePublication: offre.datePublication,
    dateLimiteSoumission: offre.dateCloture,
    statut: computeStatut(offre.dateCloture),
    description: offre.description,
    sourceUrl: offre.urlOfficielle,
    suivi: suivi ? toFrontendSuiviStatus(suivi.statut) : undefined,
  }
}

function inferTypeMarche(secteur?: string, intitule?: string): Offre['typeMarche'] {
  const haystack = `${secteur ?? ''} ${intitule ?? ''}`.toUpperCase()

  if (haystack.includes('TRAVAUX') || haystack.includes('BTP')) {
    return 'TRAVAUX'
  }
  if (haystack.includes('FOURNITURE')) {
    return 'FOURNITURES'
  }
  return 'SERVICES'
}

function computeStatut(dateCloture?: string): Offre['statut'] {
  if (!dateCloture) {
    return 'OUVERT'
  }

  return new Date(dateCloture).getTime() < Date.now() ? 'CLOS' : 'OUVERT'
}

function toBackendSuiviStatus(status: SuiviStatus): BackendSuiviEntry['statut'] {
  switch (status) {
    case 'Intéressant':
      return 'INTERESSE'
    case 'En analyse':
      return 'POSTULE'
    case 'Archivé':
      return 'REJETE'
  }
}

function toFrontendSuiviStatus(status: BackendSuiviEntry['statut']): SuiviStatus {
  switch (status) {
    case 'INTERESSE':
      return 'Intéressant'
    case 'POSTULE':
    case 'RETENU':
      return 'En analyse'
    case 'REJETE':
      return 'Archivé'
  }
}
