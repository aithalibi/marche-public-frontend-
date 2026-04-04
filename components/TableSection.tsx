import { FileText, Clock } from 'lucide-react'

export default function TableSection() {
  const markets = [
    {
      id: 1,
      title: 'Fourniture de matériel informatique pour le ministère',
      sector: 'IT',
      region: 'Casablanca',
      status: 'new',
      deadline: '2026-04-15',
    },
    {
      id: 2,
      title: 'Construction d\'un centre de formation professionnel',
      sector: 'BTP',
      region: 'Rabat',
      status: 'urg',
      deadline: '2026-04-10',
    },
    {
      id: 3,
      title: 'Services de maintenance informatique',
      sector: 'IT',
      region: 'Marrakech',
      status: 'new',
      deadline: '2026-04-20',
    },
  ]

  const getBadgeColor = (sector: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      IT: { bg: '#DBEAFE', text: '#1D4ED8' },
      BTP: { bg: '#FEF3C7', text: '#92400E' },
      Santé: { bg: '#DCFCE7', text: '#166534' },
      Éducation: { bg: '#EDE9FE', text: '#5B21B6' },
    }
    return colors[sector] || { bg: '#E5E7EB', text: '#6B7280' }
  }

  return (
    <section className="bg-arch-surface py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-xs font-bold text-arch-violet uppercase tracking-widest mb-2 flex items-center gap-2">
              🕐 Dernières publications
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Marchés publiés aujourd&apos;hui</h2>
          </div>
          <button className="bg-arch-green text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition">
            <FileText size={15} />
            Voir tous les marchés
          </button>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-[#E2E8F0] p-4 flex justify-between items-center bg-gray-50">
            <span className="text-sm font-bold flex items-center gap-2">
              <FileText size={16} className="text-arch-violet" />
              248 marchés disponibles
            </span>
            <span className="text-xs text-[#64748B] font-normal flex items-center gap-1.5">
              <Clock size={13} />
              Mis à jour il y a 8 min
            </span>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">
                  TITRE DE L&apos;APPEL
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">
                  SECTEUR
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">
                  RÉGION
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs text-[#64748B] uppercase tracking-wide">
                  STATUT
                </th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market) => {
                const badgeColor = getBadgeColor(market.sector)
                return (
                  <tr key={market.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FBFF] transition">
                    <td className="px-4 py-3 font-semibold text-gray-900">{market.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          background: badgeColor.bg,
                          color: badgeColor.text,
                        }}
                      >
                        {market.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">{market.region}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          market.status === 'new'
                            ? 'bg-[#DCFCE7] text-[#166534]'
                            : 'bg-[#FEE2E2] text-[#B91C1C]'
                        }`}
                      >
                        {market.status === 'new' ? 'Nouveau' : 'Urgent'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
