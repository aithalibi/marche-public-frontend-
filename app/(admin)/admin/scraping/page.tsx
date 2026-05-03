'use client'

import { useState } from 'react'
import { useScrapingJobs } from '@/hooks/useAdmin'
import Spinner from '@/components/ui/Spinner'
import { formatDistanceToNow } from '@/lib/utils'
import type { ScrapingJob } from '@/types'

const statusConfig = {
  TERMINE: {
    label: 'Termine',
    icon: 'fa-circle-check',
    badgeClass: 'a-badge actif',
    logClass: 'log-ok',
  },
  EN_COURS: {
    label: 'En cours',
    icon: 'fa-rotate',
    badgeClass: 'a-badge user',
    logClass: 'log-info',
  },
  ERREUR: {
    label: 'Erreur',
    icon: 'fa-triangle-exclamation',
    badgeClass: 'a-badge attente',
    logClass: 'log-warn',
  },
}

export default function ScrapingPage() {
  const { jobs, isLoading, refresh, runScraping } = useScrapingJobs()
  const [isRunning, setIsRunning] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const sortedJobs = [...jobs].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt))
  const runningJobs = sortedJobs.filter((job) => job.status === 'EN_COURS')
  const latestJobs = sortedJobs.slice(0, 4)

  async function handleRunScraping() {
    setIsRunning(true)
    setActionError(null)

    try {
      await runScraping()
    } catch {
      setActionError('Impossible de lancer le scraping pour le moment.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <>
      <div className="a-stats">
        <StatCard value={String(jobs.length)} label="Cycles de scraping" sub={`${runningJobs.length} en cours`} icon="fa-robot" tone="c2" />
        <StatCard value={String(totalCollected(jobs))} label="Offres collectees" sub="Total des logs" icon="fa-file-lines" tone="c1" />
        <StatCard value={String(successCount(jobs))} label="Cycles termines" sub="Collectes reussies" icon="fa-circle-check" tone="c3" />
        <StatCard value={String(errorCount(jobs))} label="Erreurs" sub="A verifier" icon="fa-triangle-exclamation" tone="c4" />
      </div>

      <div className="a-grid2">
        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-robot" aria-hidden /> Etat des robots
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="a-card-action" onClick={handleRunScraping} disabled={isRunning}>
                <i className={`fa-solid ${isRunning ? 'fa-spinner fa-spin' : 'fa-play'}`} aria-hidden /> {isRunning ? 'Scraping...' : 'Lancer le scraping'}
              </button>
              <button type="button" className="a-card-action" onClick={() => refresh()}>
                <i className="fa-solid fa-rotate" aria-hidden /> Actualiser
              </button>
            </div>
          </div>

          {actionError && (
            <p className="text-sm text-red-500 mb-3">{actionError}</p>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : latestJobs.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun log de scraping disponible.</p>
          ) : (
            latestJobs.map((job) => {
              const config = statusConfig[job.status]
              return (
                <div key={job.id} className="scraper-row">
                  <div className="scraper-ico">
                    <i className={`fa-solid ${config.icon}`} aria-hidden />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="scraper-name">Robot principal - marchespublics.gov.ma</div>
                    <div className="scraper-url">{job.message ?? statusMessage(job)}</div>
                    <div className="scraper-meta">
                      <span>{job.status === 'EN_COURS' && <span className="pulse" />} {config.label}</span>
                      <span><i className="fa-solid fa-clock" aria-hidden /> {formatDistanceToNow(job.startedAt)}</span>
                      <span><i className="fa-solid fa-file-lines" aria-hidden /> {job.offresCollectees} collectees</span>
                    </div>
                    <div className="prog">
                      <div className="prog-fill" style={{ width: job.status === 'TERMINE' ? '100%' : job.status === 'EN_COURS' ? '72%' : '38%' }} />
                    </div>
                  </div>
                  <span className={config.badgeClass}>{config.label}</span>
                </div>
              )
            })
          )}
        </div>

        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-terminal" aria-hidden /> Logs en temps reel
            </div>
            <button type="button" className="a-card-action" onClick={() => refresh()}>
              <i className="fa-solid fa-rotate" aria-hidden /> Recharger
            </button>
          </div>
          <div className="logbox">
            {isLoading ? (
              <div><span className="log-info">[--:--:--]</span> <span className="log-info">Chargement des logs...</span></div>
            ) : sortedJobs.length === 0 ? (
              <div><span className="log-info">[--:--:--]</span> <span className="log-info">Aucune execution enregistree</span></div>
            ) : (
              sortedJobs.slice(0, 10).map((job) => (
                <div key={job.id}>
                  <span className="log-info">[{formatTime(job.startedAt)}]</span>{' '}
                  <span className={statusConfig[job.status].logClass}>
                    {statusMessage(job)}
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
            <i className="fa-solid fa-table-list" aria-hidden /> Historique des collectes
          </div>
          <span className="a-card-action">{sortedJobs.length} logs</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th>Statut</th>
                <th>Offres</th>
                <th>Message</th>
                <th>Demarre</th>
                <th>Termine</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs.map((job) => {
                const config = statusConfig[job.status]
                return (
                  <tr key={job.id}>
                    <td>
                      <span className={config.badgeClass}>
                        <i className={`fa-solid ${config.icon}`} aria-hidden /> {config.label}
                      </span>
                      {job.erreur && (
                        <p className="text-xs text-red-500 mt-1 max-w-xs truncate">{job.erreur}</p>
                      )}
                    </td>
                    <td>{job.offresCollectees}</td>
                    <td>{job.message ?? '-'}</td>
                    <td>{formatDistanceToNow(job.startedAt)}</td>
                    <td>{job.finishedAt ? formatDistanceToNow(job.finishedAt) : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {!isLoading && sortedJobs.length === 0 && (
          <p className="text-center py-8 text-gray-400">Aucun log de scraping pour le moment.</p>
        )}
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

function totalCollected(jobs: ScrapingJob[]) {
  return jobs.reduce((total, job) => total + job.offresCollectees, 0)
}

function successCount(jobs: ScrapingJob[]) {
  return jobs.filter((job) => job.status === 'TERMINE').length
}

function errorCount(jobs: ScrapingJob[]) {
  return jobs.filter((job) => job.status === 'ERREUR').length
}

function statusMessage(job: ScrapingJob) {
  if (job.message) return job.message

  switch (job.status) {
    case 'EN_COURS':
      return `Collecte en cours - ${job.offresCollectees} offres collectees`
    case 'TERMINE':
      return `Collecte terminee - ${job.offresCollectees} offres collectees`
    case 'ERREUR':
      return job.erreur ?? 'Erreur pendant la collecte'
  }
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
