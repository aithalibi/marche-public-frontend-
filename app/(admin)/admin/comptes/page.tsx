'use client'

import { useComptes } from '@/hooks/useAdmin'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

export default function ComptesPage() {
  const { comptes, isLoading, error, toggle, remove } = useComptes()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error) return <p className="text-red-500 text-center py-8">Erreur lors du chargement.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Comptes utilisateurs</h1>
        <span className="text-sm text-gray-500">{comptes.length} compte{comptes.length > 1 ? 's' : ''}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Utilisateur</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Rôle</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Inscrit le</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comptes.map((compte) => (
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
                  <button
                    onClick={() => toggle(compte.id, !compte.actif)}
                    className="focus:outline-none"
                  >
                    <Badge variant={compte.actif ? 'green' : 'red'}>
                      {compte.actif ? 'Actif' : 'Désactivé'}
                    </Badge>
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(compte.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Supprimer le compte de ${compte.prenom} ${compte.nom} ?`)) {
                        remove(compte.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {comptes.length === 0 && (
          <p className="text-center py-8 text-gray-400">Aucun compte trouvé.</p>
        )}
      </div>
    </div>
  )
}
