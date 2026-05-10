'use client'

import { useState } from 'react'
import { useComptes } from '@/hooks/useAdmin'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Role } from '@/types'

export default function ComptesPage() {
  const { comptes, isLoading, error, setRole } = useComptes()
  const [roleError, setRoleError] = useState('')
  const adminCount = comptes.filter((compte) => compte.role === 'ADMIN').length

  async function handleRoleChange(id: string, role: Role) {
    setRoleError('')
    try {
      await setRole(id, role)
    } catch {
      setRoleError("Cette action est refusée : la plateforme doit garder un seul administrateur.")
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error) return <p className="text-red-500 text-center py-8">Erreur lors du chargement.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Comptes utilisateurs</h1>
        <span className="text-sm text-gray-500">{comptes.length} compte{comptes.length > 1 ? 's' : ''}</span>
      </div>

      {roleError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {roleError}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Utilisateur</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Inscrit le</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comptes.map((compte) => {
              const isOnlyAdmin = compte.role === 'ADMIN' && adminCount <= 1
              const adminAlreadyExists = compte.role !== 'ADMIN' && adminCount > 0
              const isDisabled = isOnlyAdmin || adminAlreadyExists
              const nextRole = compte.role === 'ADMIN' ? 'USER' : 'ADMIN'

              return (
              <tr key={compte.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{compte.prenom} {compte.nom}</p>
                  <p className="text-xs text-gray-400">{compte.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={compte.role === 'ADMIN' ? 'indigo' : 'gray'}>
                    {compte.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant(compte.statut)}>
                    {statusLabel(compte.statut)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(compte.createdAt)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRoleChange(compte.id, nextRole)}
                    disabled={isDisabled}
                    title={isDisabled ? "Un seul administrateur est autorisé" : undefined}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {compte.role === 'ADMIN' ? 'Passer en USER' : 'Passer en ADMIN'}
                  </button>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>

        {comptes.length === 0 && (
          <p className="text-center py-8 text-gray-400">Aucun compte trouve.</p>
        )}
      </div>
    </div>
  )
}

function statusVariant(statut?: string) {
  switch (statut) {
    case 'ACTIF':
      return 'green' as const
    case 'DESACTIVE':
      return 'red' as const
    case 'PROFIL_INCOMPLET':
      return 'yellow' as const
    case 'EN_ATTENTE_ACTIVATION':
      return 'orange' as const
    default:
      return 'gray' as const
  }
}

function statusLabel(statut?: string) {
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
