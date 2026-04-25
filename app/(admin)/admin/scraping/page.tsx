'use client'

import { useScrapingJobs } from '@/hooks/useAdmin'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { RefreshCw, Play, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'

const statusConfig = {
  TERMINE: { label: 'Terminé', variant: 'green' as const, icon: CheckCircle2 },
  EN_COURS: { label: 'En cours', variant: 'blue' as const, icon: RefreshCw },
  ERREUR: { label: 'Erreur', variant: 'red' as const, icon: AlertCircle },
}

export default function ScrapingPage() {
  const { jobs, isLoading, trigger } = useScrapingJobs()
  const currentJob = jobs.find((j) => j.status === 'EN_COURS')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Collecte / Scraping</h1>
        <Button
          onClick={trigger}
          disabled={!!currentJob}
          loading={!!currentJob}
        >
          <Play className="h-4 w-4" />
          {currentJob ? 'Collecte en cours…' : 'Lancer la collecte'}
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
        <p>
          La collecte scrape <span className="font-medium">marchespublics.gov.ma</span> et
          insère les nouvelles offres en base. Elle est aussi déclenchée automatiquement
          par le <span className="font-medium">Spring Scheduler</span> selon la planification Cron configurée côté backend.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-[#1e1e1e] p-4 text-sm text-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-white">Utilisation dans le frontend:</h2>
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7 text-gray-200">
{`import { apiClient } from '@/lib/api';

// Login
const res = await apiClient.login('email@example.com', 'your-password');
localStorage.setItem('token', res.accessToken);

// Notifications
const notifs = await apiClient.getNotifications();

// Offres
const offres = await apiClient.searchOffres('informatique');`}
        </pre>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Collectées</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nouvelles</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Démarré</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Terminé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => {
                const config = statusConfig[job.status]
                const Icon = config.icon
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`h-4 w-4 ${job.status === 'EN_COURS' ? 'animate-spin text-blue-500' : job.status === 'ERREUR' ? 'text-red-500' : 'text-green-500'}`} />
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      {job.erreur && (
                        <p className="text-xs text-red-500 mt-1 max-w-xs truncate">{job.erreur}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{job.offresCollectees}</td>
                    <td className="px-4 py-3 text-arch-violet font-medium">+{job.offresNouvelles}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDistanceToNow(job.startedAt)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {job.finishedAt ? formatDistanceToNow(job.finishedAt) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {jobs.length === 0 && (
            <p className="text-center py-8 text-gray-400">Aucun job de collecte pour le moment.</p>
          )}
        </div>
      )}
    </div>
  )
}
