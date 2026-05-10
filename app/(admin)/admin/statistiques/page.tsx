'use client'

import Spinner from '@/components/ui/Spinner'
import { useAdminStatistics } from '@/hooks/useAdmin'
import type { AdminMetricItem } from '@/types'

export default function AdminStatistiquesPage() {
  const { stats, isLoading, error } = useAdminStatistics()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error || !stats) return <p className="text-red-500 text-center py-8">Erreur lors du chargement des statistiques.</p>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-sm text-gray-500">Vue globale de l’activité de la plateforme.</p>
      </div>

      <div className="a-stats">
        <StatCard value={String(stats.totalMarches)} label="Marchés" sub={`${stats.marchesOuverts} ouverts`} icon="fa-file-contract" tone="c1" />
        <StatCard value={String(stats.echeancesSeptJours)} label="Échéances proches" sub="Dans les 7 jours" icon="fa-clock" tone="c4" />
        <StatCard value={String(stats.totalUtilisateurs)} label="Utilisateurs" sub="Comptes inscrits" icon="fa-users" tone="c3" />
        <StatCard value={String(stats.totalNotifications)} label="Notifications" sub={`${stats.totalSuivis} suivis`} icon="fa-bell" tone="c2" />
      </div>

      <div className="a-grid2">
        <MetricCard title="Marchés par secteur" icon="fa-layer-group" rows={stats.parSecteur} />
        <MetricCard title="Marchés par région" icon="fa-location-dot" rows={stats.parRegion} />
      </div>

      <div className="a-card">
        <div className="a-card-title">
          <div className="a-ct-left">
            <i className="fa-solid fa-calendar-days" aria-hidden /> Collectes récentes
          </div>
        </div>
        <MetricList rows={stats.collectesParJour} empty="Aucune collecte datée." />
      </div>
    </div>
  )
}

function MetricCard({ title, icon, rows }: { title: string; icon: string; rows: AdminMetricItem[] }) {
  return (
    <div className="a-card">
      <div className="a-card-title">
        <div className="a-ct-left">
          <i className={`fa-solid ${icon}`} aria-hidden /> {title}
        </div>
      </div>
      <MetricList rows={rows} empty="Aucune donnée disponible." />
    </div>
  )
}

function MetricList({ rows, empty }: { rows: AdminMetricItem[]; empty: string }) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-400">{empty}</p>
  }

  const max = Math.max(...rows.map((row) => row.value), 1)

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-800">{row.label}</span>
            <span className="text-gray-500">{row.value}</span>
          </div>
          <div className="prog mt-2">
            <div className="prog-fill" style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
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
