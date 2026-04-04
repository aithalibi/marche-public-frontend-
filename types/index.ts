// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  nom: string
  prenom: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type Role = 'USER' | 'ADMIN'

export interface User {
  id: string
  nom: string
  prenom: string
  email: string
  role: Role
  secteurs?: string[]
  regions?: string[]
  typesMarcheInteresse?: string[]
  budgetMin?: number
  budgetMax?: number
  questionnaireFait: boolean
}

// ─── Offre / Marché ───────────────────────────────────────────────────────────

export type StatutOffre =
  | 'OUVERT'
  | 'CLOS'
  | 'ATTRIBUE'
  | 'ANNULE'

export type TypeMarche =
  | 'TRAVAUX'
  | 'FOURNITURES'
  | 'SERVICES'
  | 'CONCESSION'

export interface Offre {
  id: string
  reference: string
  titre: string
  acheteur: string
  region: string
  secteur: string
  typeMarche: TypeMarche
  montantEstime?: number
  datePublication: string
  dateLimiteSoumission: string
  statut: StatutOffre
  description?: string
  sourceUrl: string
  suivi?: SuiviStatus
}

export interface OffresPage {
  content: Offre[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface OffresFilters {
  search?: string
  region?: string
  secteur?: string
  typeMarche?: TypeMarche
  statut?: StatutOffre
  page?: number
  size?: number
}

// ─── Suivi ────────────────────────────────────────────────────────────────────

export type SuiviStatus = 'Intéressant' | 'En analyse' | 'Archivé'

export interface SuiviEntry {
  offreId: string
  offre: Offre
  status: SuiviStatus
  updatedAt: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'NOUVEAU_MARCHE' | 'CLOTURE' | 'MODIFICATION'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  offreId?: string
  offreTitre?: string
  lu: boolean
  createdAt: string
}

// ─── Questionnaire ────────────────────────────────────────────────────────────

export interface QuestionnairePayload {
  secteurs: string[]
  regions: string[]
  typesMarcheInteresse: TypeMarche[]
  budgetMin?: number
  budgetMax?: number
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface Compte {
  id: string
  nom: string
  prenom: string
  email: string
  role: Role
  actif: boolean
  createdAt: string
}

export interface ScrapingJob {
  id: string
  status: 'EN_COURS' | 'TERMINE' | 'ERREUR'
  offresCollectees: number
  offresNouvelles: number
  startedAt: string
  finishedAt?: string
  erreur?: string
}

// ─── NextAuth Session extension ───────────────────────────────────────────────

import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: User & { token: string }
  }
  interface JWT {
    token: string
    user: User
  }
}
