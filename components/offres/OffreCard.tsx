'use client'

import Link from 'next/link'
import { MapPin, Calendar, Building2, ExternalLink } from 'lucide-react'
import { StatutBadge, SuiviBadge } from './OffreStatusBadge'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Offre, SuiviStatus } from '@/types'

interface OffreCardProps {
  offre: Offre
  onSuiviChange?: (id: string, status: SuiviStatus) => void
}

export default function OffreCard({ offre, onSuiviChange }: OffreCardProps) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-5 hover:shadow-card-arch transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatutBadge statut={offre.statut} />
            {offre.suivi && <SuiviBadge status={offre.suivi} />}
            <span className="text-xs text-gray-400">{offre.reference}</span>
          </div>
          <Link href={`/offres/${offre.id}`} className="hover:text-arch-violet transition-colors">
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{offre.titre}</h3>
          </Link>
        </div>
        {offre.montantEstime && (
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-gray-800">{formatCurrency(offre.montantEstime)}</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" />
          {offre.acheteur}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {offre.region}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Limite : {formatDate(offre.dateLimiteSoumission)}
        </span>
      </div>

      {onSuiviChange && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Suivi :</span>
          {(['Intéressant', 'En analyse', 'Archivé'] as SuiviStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => onSuiviChange(offre.id, s)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                offre.suivi === s
                  ? 'border-arch-violet bg-arch-lavender text-arch-violet-dark'
                  : 'border-gray-200 text-gray-500 hover:border-arch-violet/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <a
          href={offre.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-arch-violet hover:underline"
        >
          Source officielle <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
