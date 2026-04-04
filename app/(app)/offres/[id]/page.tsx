'use client'

import { useParams } from 'next/navigation'
import { useOffre } from '@/hooks/useOffres'
import { StatutBadge } from '@/components/offres/OffreStatusBadge'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ExternalLink, ArrowLeft, Building2, MapPin, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { updateSuivi } from '@/lib/api/offres'
import type { SuiviStatus } from '@/types'

export default function OffrePage() {
  const { id } = useParams<{ id: string }>()
  const { offre, isLoading, error } = useOffre(id)

  if (isLoading) {
    return <div className="flex justify-center py-24"><Spinner size="lg" /></div>
  }

  if (error || !offre) {
    return (
      <div className="text-center py-24 text-gray-400">
        Marché introuvable.{' '}
        <Link href="/recherche" className="text-arch-violet hover:underline">Retour</Link>
      </div>
    )
  }

  async function handleSuivi(status: SuiviStatus) {
    await updateSuivi(offre!.id, status)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/recherche" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" /> Retour à la recherche
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatutBadge statut={offre.statut} />
              <span className="text-sm text-gray-400">{offre.reference}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{offre.titre}</h1>
          </div>
          {offre.montantEstime && (
            <div className="shrink-0 text-right bg-arch-lavender rounded-xl px-4 py-2">
              <p className="text-xs text-arch-violet font-medium">Montant estimé</p>
              <p className="text-lg font-bold text-arch-violet-dark">{formatCurrency(offre.montantEstime)}</p>
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="h-4 w-4 text-gray-400" />
            <dt className="font-medium">Acheteur</dt>
            <dd>{offre.acheteur}</dd>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <dt className="font-medium">Région</dt>
            <dd>{offre.region}</dd>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Tag className="h-4 w-4 text-gray-400" />
            <dt className="font-medium">Type</dt>
            <dd>{offre.typeMarche}</dd>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <dt className="font-medium">Date limite</dt>
            <dd>{formatDate(offre.dateLimiteSoumission)}</dd>
          </div>
        </dl>

        {offre.description && (
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{offre.description}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Ajouter au suivi :</span>
            {(['Intéressant', 'En analyse', 'Archivé'] as SuiviStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => handleSuivi(s)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  offre.suivi === s
                    ? 'border-arch-violet bg-arch-lavender text-arch-violet-dark font-medium'
                    : 'border-gray-200 text-gray-500 hover:border-arch-violet/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <a
            href={offre.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="sm">
              <ExternalLink className="h-4 w-4" />
              Source officielle
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
