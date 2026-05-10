'use client'

import Spinner from '@/components/ui/Spinner'
import { useAdminSettings } from '@/hooks/useAdmin'

export default function AdminParametresPage() {
  const { settings, isLoading, error, refresh } = useAdminSettings()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error || !settings) return <p className="text-red-500 text-center py-8">Erreur lors du chargement des paramètres.</p>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-500">Résumé de la configuration active côté serveur.</p>
        </div>
        <button type="button" className="a-card-action" onClick={() => refresh()}>
          <i className="fa-solid fa-rotate" aria-hidden /> Actualiser
        </button>
      </div>

      <div className="a-stats">
        <StatCard value={settings.application} label="Application" sub="Nom du service" icon="fa-landmark" tone="c1" />
        <StatCard value={settings.serverPort} label="Port backend" sub="API Spring Boot" icon="fa-server" tone="c2" />
        <StatCard value={settings.mongoDatabase} label="Base MongoDB" sub="Base active" icon="fa-database" tone="c3" />
        <StatCard value={String(settings.totalLogs)} label="Logs" sub="Historique scraping" icon="fa-terminal" tone="c4" />
      </div>

      <div className="a-grid2">
        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-plug" aria-hidden /> Services connectés
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            <InfoRow label="MongoDB" value={settings.mongoDatabase} />
            <InfoRow label="Serveur SMTP" value={`${settings.mailHost}:${settings.mailPort}`} />
            <InfoRow label="API backend" value={`Port ${settings.serverPort}`} />
          </dl>
        </div>

        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-chart-simple" aria-hidden /> Volumétrie
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Utilisateurs" value={String(settings.totalUtilisateurs)} />
            <InfoRow label="Marchés" value={String(settings.totalMarches)} />
            <InfoRow label="Logs de collecte" value={String(settings.totalLogs)} />
          </dl>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
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
