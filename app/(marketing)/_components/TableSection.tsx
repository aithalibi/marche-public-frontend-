'use client'

import Link from 'next/link'
import { Clock, FileText } from 'lucide-react'
import { useOffres } from '@/hooks/useOffres'
import type { Offre } from '@/types'

export default function TableSection() {
  const { data, isLoading, error } = useOffres({ page: 0, size: 5 })
  const offres = data?.content ?? []
  const total = data?.totalElements ?? 0

  return (
    <section className="bg-arch-surface py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-xs font-bold text-arch-violet uppercase tracking-widest mb-2 flex items-center gap-2">
              <Clock size={14} /> Dernieres publications
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Marches publics disponibles</h2>
          </div>
          <Link href="/login?callbackUrl=/marches" className="bg-arch-green text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition">
            <FileText size={15} />
            Voir tous les marches
          </Link>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
          <div className="border-b border-[#E2E8F0] p-4 flex justify-between items-center bg-gray-50">
            <span className="text-sm font-bold flex items-center gap-2">
              <FileText size={16} className="text-arch-violet" />
              {isLoading ? 'Chargement...' : `${total.toLocaleString('fr-FR')} offres en base`}
            </span>
            <span className="text-xs text-[#64748B] font-normal flex items-center gap-1.5">
              <Clock size={13} />
              Donnees issues du scraping
            </span>
          </div>

          {error ? (
            <div className="p-8 text-center text-sm text-red-600">
              Impossible de charger les offres pour le moment.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">Titre</th>
                  <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">Secteur</th>
                  <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">Region</th>
                  <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">Statut</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#64748B]">Chargement des offres...</td>
                  </tr>
                )}
                {!isLoading && offres.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#64748B]">Aucune offre disponible pour le moment.</td>
                  </tr>
                )}
                {offres.map((offre) => (
                  <OfferRow key={offre.id} offre={offre} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  )
}

function OfferRow({ offre }: { offre: Offre }) {
  const urgent = daysUntil(offre.dateLimiteSoumission) <= 3
  const badgeColor = getBadgeColor(offre.typeMarche)

  return (
    <tr className="border-b border-[#E2E8F0] hover:bg-[#F8FBFF] transition">
      <td className="px-4 py-3">
        <div className="font-semibold text-gray-900">{offre.titre}</div>
        <div className="text-xs text-[#64748B] font-mono mt-1">{offre.reference}</div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={badgeColor}>
          {offre.typeMarche}
        </span>
      </td>
      <td className="px-4 py-3 text-[#64748B]">{offre.region || '-'}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${urgent ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-[#DCFCE7] text-[#166534]'}`}>
          {urgent ? 'Urgent' : offre.statut}
        </span>
      </td>
    </tr>
  )
}

function daysUntil(dateStr?: string) {
  if (!dateStr) return Number.POSITIVE_INFINITY
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function getBadgeColor(type: string): { background: string; color: string } {
  switch (type) {
    case 'TRAVAUX':
      return { background: '#FEF3C7', color: '#92400E' }
    case 'FOURNITURES':
      return { background: '#F3E5F5', color: '#6A1B9A' }
    case 'SERVICES':
      return { background: '#DCFCE7', color: '#166534' }
    default:
      return { background: '#DBEAFE', color: '#1D4ED8' }
  }
}
