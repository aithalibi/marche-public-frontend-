'use client'

import { useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { useAdminMarkets } from '@/hooks/useAdmin'
import { formatDate } from '@/lib/utils'

export default function AdminMarchesPage() {
  const { data, markets, isLoading, error, removeMarket } = useAdminMarkets()
  const [actionError, setActionError] = useState('')

  async function handleDelete(id: string) {
    setActionError('')
    const confirmed = window.confirm('Supprimer ce marché de la base locale ?')
    if (!confirmed) return

    try {
      await removeMarket(id)
    } catch {
      setActionError('Impossible de supprimer ce marché pour le moment.')
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error) return <p className="text-red-500 text-center py-8">Erreur lors du chargement des marchés.</p>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestion des marchés</h1>
          <p className="text-sm text-gray-500">Suivi des offres collectées et des liens officiels.</p>
        </div>
        <span className="text-sm text-gray-500">{data?.total ?? 0} marchés</span>
      </div>

      <div className="a-stats">
        <StatCard value={String(data?.total ?? 0)} label="Total" sub="Marchés en base" icon="fa-file-contract" tone="c1" />
        <StatCard value={String(data?.ouverts ?? 0)} label="Ouverts" sub="Encore consultables" icon="fa-unlock" tone="c3" />
        <StatCard value={String(data?.clos ?? 0)} label="Clôturés" sub="Date limite passée" icon="fa-lock" tone="c4" />
        <StatCard value={String(data?.sansLienOfficiel ?? 0)} label="Sans lien officiel" sub="À compléter" icon="fa-link-slash" tone="c2" />
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Référence / intitulé</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Acheteur</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Dates</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {markets.map((market) => (
              <tr key={market.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-xs text-blue-900">{market.reference}</p>
                  <p className="font-medium text-gray-900 max-w-xl">{market.intitule}</p>
                  <p className="text-xs text-gray-400">{market.secteur} · {market.localisation || 'Localisation non précisée'}</p>
                </td>
                <td className="px-4 py-3 max-w-xs">{market.organisme || '-'}</td>
                <td className="px-4 py-3 text-gray-600">
                  <div>Pub. {market.datePublication ? formatDate(market.datePublication) : '-'}</div>
                  <div>Limite {market.dateCloture ? formatDate(market.dateCloture) : '-'}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={market.statut === 'OUVERT' ? 'green' : 'gray'}>{market.statut === 'OUVERT' ? 'Ouvert' : 'Clôturé'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {market.urlOfficielle && (
                      <a className="a-card-action" href={market.urlOfficielle} target="_blank" rel="noreferrer">
                        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden /> Ouvrir
                      </a>
                    )}
                    <button type="button" className="a-card-action" onClick={() => handleDelete(market.id)}>
                      <i className="fa-solid fa-trash" aria-hidden /> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {markets.length === 0 && (
          <p className="text-center py-8 text-gray-400">Aucun marché collecté pour le moment.</p>
        )}
      </div>
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
