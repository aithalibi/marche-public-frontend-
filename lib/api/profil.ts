import api from '@/lib/axios'
import type { User, QuestionnairePayload } from '@/types'

export async function getProfil(): Promise<User> {
  const { data } = await api.get<User>('/api/profil')
  return data
}

export async function updateProfil(payload: Partial<User>): Promise<User> {
  const { data } = await api.put<User>('/api/profil', payload)
  return data
}

export async function submitQuestionnaire(payload: QuestionnairePayload): Promise<User> {
  const { data } = await api.post<User>('/api/profil/questionnaire', payload)
  return data
}
