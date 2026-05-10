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

export interface BackendAuthResponse {
  token: string
  refreshToken: string
  type: string
  userId: string
  email: string
  nom: string
  prenom: string
  role: Role
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

export interface BackendOffre {
  id: string
  reference: string
  intitule: string
  description?: string
  organisme: string
  secteur: string
  localisation: string
  emailContact?: string
  urlOfficielle: string
  datePublication: string
  dateCloture: string
  dateCollecte?: string
}

export interface OffresPage {
  content: Offre[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface BackendPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface OffresFilters {
  search?: string
  region?: string
  secteur?: string
  typeMarche?: TypeMarche | string
  statut?: StatutOffre
  dateMin?: string
  dateLimiteMax?: string
  page?: number
  size?: number
}

export interface OffreFilterOptions {
  categories: string[]
  localisations: string[]
}

export interface DashboardStats {
  totalOffres: number
  offresCollecteesAujourdHui: number
  variationCollecteVsHier: number
  correspondancesActives: number
  nouvellesCorrespondancesAujourdHui: number
  marchesEnSuivi: number
  marchesEnAnalyse: number
  cloturesDans48h: number
}

// ─── Suivi ────────────────────────────────────────────────────────────────────

export type SuiviStatus = 'Intéressant' | 'En analyse' | 'Archivé'

export interface SuiviEntry {
  offreId: string
  offre: Offre
  status: SuiviStatus
  updatedAt: string
}

export interface BackendSuiviEntry {
  id: string
  userId: string
  offreId: string
  statut: 'INTERESSE' | 'POSTULE' | 'RETENU' | 'REJETE'
  note?: string | null
  createdAt: string
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

export interface BackendNotification {
  id: string
  userId: string
  offreId?: string
  referenceOffre?: string
  canal?: string
  titre?: string
  message: string
  lue: boolean
  dateCreation: string
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
  statut?: string
}

export interface ScrapingJob {
  id: string
  status: 'EN_COURS' | 'TERMINE' | 'ERREUR'
  offresCollectees: number
  offresNouvelles: number
  startedAt: string
  finishedAt?: string
  erreur?: string
  message?: string
}

export interface BackendAdminUser {
  id: string
  email: string
  nom: string
  prenom: string
  role: Role
  statut: 'EN_ATTENTE_ACTIVATION' | 'PROFIL_INCOMPLET' | 'ACTIF' | 'DESACTIVE'
  dateInscription: string
}

export interface BackendScraperLog {
  id: string
  dateDebut: string
  dateFin?: string
  statut: 'SUCCES' | 'ERREUR' | 'EN_COURS'
  nbOffres?: number
  message?: string
  erreur?: string
  duree?: number
}

export interface AdminMarketItem {
  id: string
  reference: string
  intitule: string
  organisme: string
  secteur: string
  localisation: string
  datePublication?: string
  dateCloture?: string
  statut: 'OUVERT' | 'CLOS'
  urlOfficielle?: string
}

export interface AdminMarketsResponse {
  total: number
  ouverts: number
  clos: number
  sansLienOfficiel: number
  marches: AdminMarketItem[]
}

export interface AdminMetricItem {
  label: string
  value: number
}

export interface AdminStatisticsResponse {
  totalMarches: number
  marchesOuverts: number
  echeancesSeptJours: number
  totalUtilisateurs: number
  totalSuivis: number
  totalNotifications: number
  parSecteur: AdminMetricItem[]
  parRegion: AdminMetricItem[]
  collectesParJour: AdminMetricItem[]
}

export interface AdminEmailResponse {
  configure: boolean
  host: string
  port: number
  username: string
  notificationsCreees: number
}

export interface AdminLogItem {
  id: string
  source: string
  statut: string
  message?: string
  erreur?: string
  dateDebut: string
  dateFin?: string
}

export interface AdminSettingsResponse {
  application: string
  serverPort: string
  mongoDatabase: string
  mailHost: string
  mailPort: number
  totalUtilisateurs: number
  totalMarches: number
  totalLogs: number
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
