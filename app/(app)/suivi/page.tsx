'use client'

import { useSuivi } from '@/hooks/useSuivi'
import type { SuiviStatus } from '@/types'

type Column = { status: SuiviStatus; label: string; icon: string; color: string; textColor: string }

const COLUMNS: Column[] = [
  { status: 'Intéressant', label: 'Intéressant', icon: 'fa-star', color: '#EFF6FF', textColor: 'var(--primary)' },
  { status: 'En analyse', label: 'En analyse', icon: 'fa-magnifying-glass-chart', color: '#FFFBEB', textColor: 'var(--amber)' },
  { status: 'Archivé', label: 'Archivé', icon: 'fa-box-archive', color: '#F8FAFC', textColor: 'var(--muted)' },
]

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

export default function SuiviPage() {
  const { offresWithSuivi, isLoading, error, setStatus } = useSuivi()

  const totalSuivi = offresWithSuivi.length
  const enAnalyse = offresWithSuivi.filter((o) => o.suivi === 'En analyse').length

  return (
    <>
      <div className="u-page-header">
        <div className="u-page-title">
          <h2><i className="fa-solid fa-bookmark" aria-hidden /> Suivi des marchés</h2>
          <p>{totalSuivi} marché{totalSuivi !== 1 ? 's' : ''} en suivi — {enAnalyse} en analyse</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="u-btn-icon">
            <i className="fa-solid fa-arrow-right-arrow-left" aria-hidden /> Vue liste
          </button>
        </div>
      </div>

      {isLoading && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 24, marginBottom: 10 }} aria-hidden />
          <div style={{ fontSize: 13 }}>Chargement…</div>
        </div>
      )}

      {error && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#b91c1c', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, fontSize: 13 }}>
          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 6 }} aria-hidden />
          Erreur lors du chargement du suivi.
        </div>
      )}

      {!isLoading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {COLUMNS.map(({ status, label, icon, color, textColor }) => {
            const offres = offresWithSuivi.filter((o) => o.suivi === status)
            return (
              <div key={status} style={{ background: color, border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                {/* Column header */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={`fa-solid ${icon}`} style={{ color: textColor, fontSize: 13 }} aria-hidden />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{label}</span>
                  </div>
                  <span style={{ background: 'white', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
                    {offres.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                  {offres.length === 0 && (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                      <i className="fa-regular fa-folder-open" style={{ fontSize: 20, marginBottom: 6, display: 'block', opacity: 0.4 }} aria-hidden />
                      Aucun marché
                    </div>
                  )}
                  {offres.map((offre) => {
                    const days = daysUntil(offre.dateLimiteSoumission)
                    const isUrgent = days !== null && days >= 0 && days <= 3
                    return (
                      <div
                        key={offre.id}
                        style={{
                          background: 'white',
                          border: `1.5px solid ${isUrgent ? '#FDE68A' : 'var(--border)'}`,
                          borderRadius: 8,
                          padding: '12px 14px',
                          transition: 'box-shadow .15s',
                        }}
                      >
                        {isUrgent && (
                          <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <i className="fa-solid fa-triangle-exclamation" aria-hidden />
                            Clôture dans {days === 0 ? "aujourd'hui" : `${days}j`}
                          </div>
                        )}
                        <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text)', marginBottom: 6, lineHeight: 1.4 }}>
                          {offre.titre}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginBottom: 8 }}>
                          {offre.reference}
                        </div>
                        {offre.acheteur && (
                          <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                            <i className="fa-solid fa-building" aria-hidden /> {offre.acheteur}
                          </div>
                        )}
                        {offre.dateLimiteSoumission && (
                          <div style={{ fontSize: 11, color: isUrgent ? 'var(--amber)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, fontWeight: isUrgent ? 700 : 400 }}>
                            <i className="fa-regular fa-calendar" aria-hidden /> {formatDate(offre.dateLimiteSoumission)}
                          </div>
                        )}
                        {/* Status buttons */}
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {COLUMNS.filter((c) => c.status !== status).map((c) => (
                            <button
                              key={c.status}
                              onClick={() => setStatus(offre.id, c.status)}
                              style={{ padding: '3px 9px', border: '1.5px solid var(--border)', borderRadius: 5, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'white', color: 'var(--muted)', fontFamily: "'Manrope',sans-serif", transition: '.15s' }}
                            >
                              <i className={`fa-solid ${c.icon}`} style={{ marginRight: 3, fontSize: 9 }} aria-hidden />
                              {c.label}
                            </button>
                          ))}
                          {offre.sourceUrl && (
                            <a
                              href={offre.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-action btn-voir"
                              style={{ fontSize: 10, padding: '3px 9px' }}
                            >
                              <i className="fa-solid fa-eye" aria-hidden /> Voir
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
