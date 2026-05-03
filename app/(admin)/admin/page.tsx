'use client'

import Link from 'next/link'
import { useComptes, useScrapingJobs } from '@/hooks/useAdmin'
import Spinner from '@/components/ui/Spinner'
import { formatDate, formatDistanceToNow } from '@/lib/utils'

export default function AdminDashboard() {
  const { comptes, isLoading: isLoadingUsers } = useComptes()
  const { jobs, isLoading: isLoadingJobs, refresh } = useScrapingJobs()

  if (isLoadingUsers || isLoadingJobs) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  const activeUsers = comptes.filter((compte) => compte.statut === 'ACTIF').length
  const admins = comptes.filter((compte) => compte.role === 'ADMIN').length
  const pendingUsers = comptes.filter((compte) => compte.statut === 'EN_ATTENTE_ACTIVATION').length
  const runningJobs = jobs.filter((job) => job.status === 'EN_COURS').length
  const recentUsers = [...comptes].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)
  const recentLogs = [...jobs].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt)).slice(0, 6)

  return (
    <>
      <div className="a-stats">
        <StatCard value={String(comptes.length)} label="Utilisateurs inscrits" sub={`${activeUsers} actifs`} icon="fa-users" tone="c3" />
        <StatCard value={String(admins)} label="Admins" sub="Gestion des roles" icon="fa-shield-halved" tone="c4" />
        <StatCard value={String(jobs.length)} label="Cycles de scraping" sub={`${runningJobs} en cours`} icon="fa-robot" tone="c2" />
        <StatCard value={String(pendingUsers)} label="Comptes en attente" sub="A surveiller" icon="fa-user-clock" tone="c1" />
      </div>

      <div className="a-grid2">
        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-robot" aria-hidden /> Activite scraping
            </div>
            <button type="button" className="a-card-action" onClick={() => refresh()}>
              <i className="fa-solid fa-rotate" aria-hidden /> Actualiser
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun log de scraping disponible.</p>
          ) : (
            recentLogs.map((job) => (
              <div key={job.id} className="scraper-row">
                <div className="scraper-ico">
                  <i className={`fa-solid ${job.status === 'ERREUR' ? 'fa-triangle-exclamation' : job.status === 'EN_COURS' ? 'fa-rotate' : 'fa-circle-check'}`} aria-hidden />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="scraper-name">{statusLabel(job.status)}</div>
                  <div className="scraper-url">{job.message ?? 'Execution de scraping'}</div>
                  <div className="scraper-meta">
                    <span>{job.offresCollectees} offres</span>
                    <span><i className="fa-solid fa-clock" aria-hidden /> {formatDistanceToNow(job.startedAt)}</span>
                    {job.finishedAt && <span><i className="fa-solid fa-flag-checkered" aria-hidden /> {formatDistanceToNow(job.finishedAt)}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-terminal" aria-hidden /> Derniers logs
            </div>
            <Link className="a-card-action" href="/admin/scraping">
              <i className="fa-solid fa-arrow-right" aria-hidden /> Voir tout
            </Link>
          </div>
          <div className="logbox">
            {recentLogs.length === 0 ? (
              <div><span className="log-info">[--:--:--]</span> <span className="log-info">Aucune execution enregistree</span></div>
            ) : (
              recentLogs.map((job) => (
                <div key={job.id}>
                  <span className="log-info">[{new Date(job.startedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>{' '}
                  <span className={job.status === 'ERREUR' ? 'log-warn' : job.status === 'EN_COURS' ? 'log-info' : 'log-ok'}>
                    {job.message ?? `${statusLabel(job.status)} - ${job.offresCollectees} offres`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-title">
          <div className="a-ct-left">
            <i className="fa-solid fa-users" aria-hidden /> Utilisateurs recents
          </div>
          <Link className="a-card-action" href="/admin/comptes">
            <i className="fa-solid fa-arrow-right" aria-hidden /> Voir tous
          </Link>
        </div>
        <table className="a-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Role</th>
              <th>Inscription</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((compte) => (
              <tr key={compte.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{compte.prenom} {compte.nom}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{compte.email}</div>
                </td>
                <td>{compte.role}</td>
                <td>{formatDate(compte.createdAt)}</td>
                <td>{statusLabelFromCompte(compte.statut)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function StatCard({
  value,
  label,
  sub,
  icon,
  tone,
}: {
  value: string
  label: string
  sub: string
  icon: string
  tone: 'c1' | 'c2' | 'c3' | 'c4'
}) {
  return (
    <div className={`a-stat-card ${tone}`}>
      <div className="a-stat-ico-wrap">
        <div>
          <div className="a-stat-val">{value}</div>
          <div className="a-stat-lbl">{label}</div>
          <div className="a-stat-chg up">{sub}</div>
        </div>
        <div className={`a-stat-ico ${tone}`}>
          <i className={`fa-solid ${icon}`} aria-hidden />
        </div>
      </div>
    </div>
  )
}

function statusLabel(status: 'EN_COURS' | 'TERMINE' | 'ERREUR') {
  switch (status) {
    case 'EN_COURS':
      return 'Collecte en cours'
    case 'TERMINE':
      return 'Collecte terminee'
    case 'ERREUR':
      return 'Collecte en erreur'
  }
}

function statusLabelFromCompte(statut?: string) {
  switch (statut) {
    case 'ACTIF':
      return 'Actif'
    case 'DESACTIVE':
      return 'Desactive'
    case 'PROFIL_INCOMPLET':
      return 'Profil incomplet'
    case 'EN_ATTENTE_ACTIVATION':
      return 'En attente'
    default:
      return statut ?? 'Inconnu'
  }
}
