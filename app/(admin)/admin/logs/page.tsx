'use client'

import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { useAdminLogs } from '@/hooks/useAdmin'

export default function AdminLogsPage() {
  const { logs, isLoading, error, refresh } = useAdminLogs()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error) return <p className="text-red-500 text-center py-8">Erreur lors du chargement des logs.</p>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Logs système</h1>
          <p className="text-sm text-gray-500">Historique technique des collectes et erreurs.</p>
        </div>
        <button type="button" className="a-card-action" onClick={() => refresh()}>
          <i className="fa-solid fa-rotate" aria-hidden /> Actualiser
        </button>
      </div>

      <div className="a-card">
        <div className="a-card-title">
          <div className="a-ct-left">
            <i className="fa-solid fa-terminal" aria-hidden /> Derniers événements
          </div>
          <span className="a-card-action">{logs.length} lignes</span>
        </div>

        <div className="logbox">
          {logs.length === 0 ? (
            <div><span className="log-info">[--:--:--]</span> Aucun log disponible.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id}>
                <span className="log-info">[{formatDateTime(log.dateDebut)}]</span>{' '}
                <span className={log.statut === 'ERREUR' ? 'log-warn' : log.statut === 'EN_COURS' ? 'log-info' : 'log-ok'}>
                  {log.source} · {log.statut} · {log.message || 'Événement enregistré'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Message</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Début</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Fin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3">{log.source}</td>
                <td className="px-4 py-3">
                  <Badge variant={log.statut === 'ERREUR' ? 'red' : log.statut === 'EN_COURS' ? 'orange' : 'green'}>
                    {log.statut}
                  </Badge>
                </td>
                <td className="px-4 py-3 max-w-xl">
                  <p>{log.message || '-'}</p>
                  {log.erreur && <p className="mt-1 text-xs text-red-600">{log.erreur}</p>}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDateTime(log.dateDebut)}</td>
                <td className="px-4 py-3 text-gray-500">{log.dateFin ? formatDateTime(log.dateFin) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <p className="text-center py-8 text-gray-400">Aucun log disponible.</p>
        )}
      </div>
    </div>
  )
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
