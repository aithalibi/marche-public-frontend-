'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { OffresFilters, TypeMarche, StatutOffre } from '@/types'

const REGIONS = [
  'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès',
  'Tanger-Tétouan-Al Hoceima', 'Souss-Massa', 'Béni Mellal-Khénifra',
  'Drâa-Tafilalet', 'Oriental', 'Guelmim-Oued Noun', 'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab',
]

const TYPES_MARCHE: { value: TypeMarche; label: string }[] = [
  { value: 'TRAVAUX', label: 'Travaux' },
  { value: 'FOURNITURES', label: 'Fournitures' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'CONCESSION', label: 'Concession' },
]

const STATUTS: { value: StatutOffre; label: string }[] = [
  { value: 'OUVERT', label: 'Ouvert' },
  { value: 'CLOS', label: 'Clos' },
  { value: 'ATTRIBUE', label: 'Attribué' },
  { value: 'ANNULE', label: 'Annulé' },
]

interface OffreFiltersProps {
  filters: OffresFilters
  onChange: (filters: OffresFilters) => void
}

export default function OffreFilters({ filters, onChange }: OffreFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  function set(key: keyof OffresFilters, value: string | undefined) {
    onChange({ ...filters, [key]: value || undefined, page: 0 })
  }

  function reset() {
    onChange({})
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, acheteur, référence…"
            value={filters.search ?? ''}
            onChange={(e) => set('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arch-violet"
          />
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowAdvanced((v) => !v)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Région</label>
            <select
              value={filters.region ?? ''}
              onChange={(e) => set('region', e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-arch-violet"
            >
              <option value="">Toutes les régions</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Type de marché</label>
            <select
              value={filters.typeMarche ?? ''}
              onChange={(e) => set('typeMarche', e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-arch-violet"
            >
              <option value="">Tous les types</option>
              {TYPES_MARCHE.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Statut</label>
            <select
              value={filters.statut ?? ''}
              onChange={(e) => set('statut', e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-arch-violet"
            >
              <option value="">Tous les statuts</option>
              {STATUTS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
