import api from '@/lib/axios'
import type { User, QuestionnairePayload } from '@/types'

type BackendProfilResponse = {
  motsClesInteret: string[]
  secteursChoisis: string[]
  localisation?: string | null
  frequenceNotification: 'IMMEDIATE' | 'DAILY' | 'WEEKLY'
}

export async function getProfil(): Promise<User> {
  const { data } = await api.get<BackendProfilResponse>('/api/profil')
  return mapProfilResponse(data)
}

export async function updateProfil(payload: Partial<User>): Promise<User> {
  const { data } = await api.put<BackendProfilResponse>('/api/profil', toBackendProfilPayload({
    secteurs: payload.secteurs ?? [],
    regions: payload.regions ?? [],
    typesMarcheInteresse: [],
  }))
  return mapProfilResponse(data)
}

export async function submitQuestionnaire(payload: QuestionnairePayload): Promise<void> {
  await api.put('/api/profil', toBackendProfilPayload(payload))
}

function toBackendProfilPayload(payload: QuestionnairePayload) {
  const motsCles = [
    ...payload.secteurs,
    ...payload.typesMarcheInteresse,
  ].filter(Boolean)

  return {
    motsClesInteret: motsCles.length > 0 ? motsCles : payload.secteurs,
    secteursChoisis: payload.secteurs,
    localisation: payload.regions?.includes('Toutes') ? '' : payload.regions?.[0] ?? '',
    frequenceNotification: 'IMMEDIATE',
  }
}

function mapProfilResponse(data: BackendProfilResponse): User {
  return {
    id: '',
    nom: '',
    prenom: '',
    email: '',
    role: 'USER',
    secteurs: data.secteursChoisis,
    regions: data.localisation ? [data.localisation] : [],
    typesMarcheInteresse: [],
    questionnaireFait: true,
  }
}
