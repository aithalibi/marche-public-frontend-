'use client'

import { useState } from 'react'
import { useOffres } from '@/hooks/useOffres'
import type { OffresFilters, StatutOffre, TypeMarche } from '@/types'

function isTypeMarche(value: string): value is TypeMarche {
  return value === 'SERVICES' || value === 'TRAVAUX' || value === 'FOURNITURES' || value === 'CONCESSION'
}

function isStatutOffre(value: string): value is StatutOffre {
  return value === 'OUVERT' || value === 'CLOS' || value === 'ATTRIBUE' || value === 'ANNULE'
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'â€”'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function typeBadge(type: string) {
  switch (type) {
    case 'SERVICES':
    case 'INFORMATIQUE': return { cls: 'badge badge-services', icon: 'fa-chalkboard-user', label: 'Services' }
    case 'FOURNITURES': return { cls: 'badge badge-fournitures', icon: 'fa-boxes-stacked', label: 'Fournitures' }
    case 'TRAVAUX': return { cls: 'badge badge-btp', icon: 'fa-hard-hat', label: 'BTP' }
    default: return { cls: 'badge badge-it', icon: 'fa-laptop', label: 'IT' }
  }
}

export default function CorrespondancesPage() {
  const [filters, setFilters] = useState<OffresFilters>({ size: 20, page: 0, statut: 'OUVERT' })
  const [search, setSearch] = useState('')
  const { data, isLoading, error } = useOffres(filters)

  const total = data?.totalElements ?? 0
  const content = data?.content ?? []
  const totalPages = data?.totalPages ?? 1
  const currentPage = filters.page ?? 0

  const urgentCount = content.filter((o) => {
    const d = daysUntil(o.dateLimiteSoumission)
    return d !== null && d >= 0 && d <= 5
  }).length

  function handleSearch() {
    setFilters((f) => ({ ...f, search: search || undefined, page: 0 }))
  }

  function handleReset() {
    setSearch('')
    setFilters({ size: 20, page: 0, statut: 'OUVERT' })
  }

  return (
    <>
      <div className="u-page-header">
        <div className="u-page-title">
          <h2><i className="fa-solid fa-envelope" aria-hidden /> Correspondances</h2>
          <p>MarchÃ©s correspondant Ã  votre profil et vos prÃ©fÃ©rences de veille</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="u-btn-icon">
            <i className="fa-solid fa-sliders" aria-hidden /> Modifier mes prÃ©fÃ©rences
          </button>
        </div>
      </div>

      <div className="u-stats-grid">
        <div className="u-stat-card">
          <div className="u-stat-icon blue"><i className="fa-solid fa-envelopes-bulk" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Correspondances totales</div>
            <div className="u-stat-number">{isLoading ? 'â€¦' : total.toLocaleString('fr-FR')}</div>
            <div className="u-stat-sub green"><i className="fa-solid fa-arrow-trend-up" aria-hidden /> MarchÃ©s actifs</div>
          </div>
        </div>
        <div className="u-stat-card">
          <div className="u-stat-icon amber"><i className="fa-solid fa-hourglass-half" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Ã‰chÃ©ances proches</div>
            <div className="u-stat-number">{urgentCount}</div>
            <div className="u-stat-sub amber"><i className="fa-solid fa-clock" aria-hidden /> Dans les 5 prochains jours</div>
          </div>
        </div>
        <div className="u-stat-card">
          <div className="u-stat-icon green"><i className="fa-solid fa-star" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Nouveaux aujourd&apos;hui</div>
            <div className="u-stat-number">â€”</div>
            <div className="u-stat-sub green"><i className="fa-solid fa-plus" aria-hidden /> Mise Ã  jour en continu</div>
          </div>
        </div>
        <div className="u-stat-card">
          <div className="u-stat-icon teal"><i className="fa-solid fa-bullseye" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Taux de pertinence</div>
            <div className="u-stat-number">â€”</div>
            <div className="u-stat-sub teal"><i className="fa-solid fa-chart-line" aria-hidden /> BasÃ© sur vos secteurs</div>
          </div>
        </div>
      </div>

      {urgentCount > 0 && (
        <div className="u-alert-banner">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden />
          <span>
            <strong>Attention :</strong>{' '}
            {urgentCount} correspondance{urgentCount > 1 ? 's arrivent' : ' arrive'} Ã  clÃ´ture dans les 5 prochains jours.
          </span>
          <a className="u-alert-link">
            Voir les urgences <i className="fa-solid fa-arrow-right" aria-hidden />
          </a>
        </div>
      )}

      <div className="u-search-panel">
        <div className="u-search-header">
          <i className="fa-solid fa-magnifying-glass" aria-hidden /> Filtrer les correspondances
        </div>
        <div className="u-search-body">
          <div className="u-search-main">
            <div className="u-search-input-wrap">
              <i className="fa-solid fa-magnifying-glass" aria-hidden />
              <input
                type="text"
                placeholder="Mot-clÃ©, intitulÃ©, acheteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="u-btn-search" onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden /> Filtrer
            </button>
            <button className="u-btn-reset" onClick={handleReset}>
              <i className="fa-solid fa-rotate-left" aria-hidden /> RÃ©initialiser
            </button>
          </div>
          <div className="u-filtres-grid">
            <div className="u-filtre-group">
              <label>CatÃ©gorie</label>
              <select
                value={filters.typeMarche ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters((f) => ({ ...f, typeMarche: isTypeMarche(value) ? value : undefined, page: 0 }))
                }}
              >
                <option value="">Toutes catÃ©gories</option>
                <option value="SERVICES">Services</option>
                <option value="TRAVAUX">BTP / Travaux</option>
                <option value="FOURNITURES">Fournitures</option>
              </select>
            </div>
            <div className="u-filtre-group">
              <label>RÃ©gion</label>
              <select
                value={filters.region ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value || undefined, page: 0 }))}
              >
                <option value="">Toutes rÃ©gions</option>
                <option value="Casablanca-Settat">Casablanca-Settat</option>
                <option value="Rabat-SalÃ©-KÃ©nitra">Rabat-SalÃ©-KÃ©nitra</option>
                <option value="Souss-Massa">Souss-Massa</option>
                <option value="Marrakech-Safi">Marrakech-Safi</option>
              </select>
            </div>
            <div className="u-filtre-group">
              <label>Statut</label>
              <select
                value={filters.statut ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters((f) => ({ ...f, statut: isStatutOffre(value) ? value : undefined, page: 0 }))
                }}
              >
                <option value="OUVERT">Ouvert</option>
                <option value="">Tous statuts</option>
                <option value="CLOS">ClÃ´turÃ©</option>
                <option value="ATTRIBUE">AttribuÃ©</option>
              </select>
            </div>
            <div className="u-filtre-group">
              <label>Date limite</label>
              <input type="date" onChange={() => setFilters((f) => ({ ...f, page: 0 }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="u-table-section">
        <div className="u-table-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="u-table-title">
              <i className="fa-solid fa-envelope-open-text" aria-hidden /> Mes correspondances
            </div>
            <span className="u-result-count">{total.toLocaleString('fr-FR')} rÃ©sultats</span>
          </div>
          <div className="u-table-actions">
            <button className="u-btn-icon"><i className="fa-solid fa-file-excel" aria-hidden /> Excel</button>
            <button className="u-btn-icon"><i className="fa-solid fa-file-pdf" aria-hidden /> PDF</button>
            <select
              style={{ padding: '7px 10px', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 12, fontFamily: "'Manrope',sans-serif", background: 'white', outline: 'none' }}
              value={filters.size}
              onChange={(e) => setFilters((f) => ({ ...f, size: Number(e.target.value), page: 0 }))}
            >
              <option value={20}>20 par page</option>
              <option value={50}>50 par page</option>
              <option value={100}>100 par page</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 22, marginBottom: 8 }} aria-hidden />
            <div style={{ fontSize: 13 }}>Chargement des correspondancesâ€¦</div>
          </div>
        )}

        {error && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#b91c1c', fontSize: 13 }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 6 }} aria-hidden />
            Erreur lors du chargement. Veuillez rÃ©essayer.
          </div>
        )}

        {!isLoading && !error && (
          <table>
            <thead>
              <tr>
                <th style={{ width: 32 }}><input type="checkbox" /></th>
                <th>RÃ©fÃ©rence / IntitulÃ©</th>
                <th>CatÃ©gorie</th>
                <th>Acheteur</th>
                <th>Date pub.</th>
                <th>Date limite</th>
                <th>Pertinence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: 24, marginBottom: 8, display: 'block' }} aria-hidden />
                    Aucune correspondance pour vos critÃ¨res actuels.
                  </td>
                </tr>
              ) : (
                content.map((offre) => {
                  const badge = typeBadge(offre.typeMarche)
                  const days = daysUntil(offre.dateLimiteSoumission)
                  const isUrgent = days !== null && days >= 0 && days <= 5
                  return (
                    <tr key={offre.id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="marche-ref">{offre.reference}</div>
                        <div className="marche-titre">
                          <a href={offre.sourceUrl} target="_blank" rel="noopener noreferrer">{offre.titre}</a>
                        </div>
                      </td>
                      <td>
                        <span className={badge.cls}>
                          <i className={`fa-solid ${badge.icon}`} aria-hidden /> {badge.label}
                        </span>
                      </td>
                      <td className="acheteur-cell">
                        <div className="acheteur-name">{offre.acheteur}</div>
                        {offre.region && (
                          <div className="acheteur-ville">
                            <i className="fa-solid fa-location-dot" aria-hidden /> {offre.region}
                          </div>
                        )}
                      </td>
                      <td className="date-cell">
                        <div className="date-main">{formatDate(offre.datePublication)}</div>
                      </td>
                      <td className={`date-cell${isUrgent ? ' deadline-alerte' : ''}`}>
                        <div className="date-main">
                          {isUrgent && <i className="fa-solid fa-hourglass-end" style={{ marginRight: 4 }} aria-hidden />}
                          {formatDate(offre.dateLimiteSoumission)}
                        </div>
                        {days !== null && (
                          <div className="date-sub">
                            {days < 0 ? 'ClÃ´turÃ©' : days === 0 ? "Aujourd'hui" : `dans ${days}j`}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{
                          background: '#F0FDF4',
                          color: 'var(--green)',
                          border: '1px solid #BBF7D0',
                          padding: '3px 9px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <i className="fa-solid fa-check-double" aria-hidden /> Correspond
                        </span>
                      </td>
                      <td className="actions-cell">
                        <a href={offre.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-action btn-voir">
                          <i className="fa-solid fa-eye" aria-hidden /> Voir
                        </a>
                        <button className="btn-action btn-suivi">
                          <i className="fa-regular fa-bookmark" aria-hidden /> Suivre
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}

        <div className="pagination-wrap">
          <div className="pagination-info">
            {total > 0
              ? `Affichage de ${currentPage * (filters.size ?? 20) + 1} Ã  ${Math.min((currentPage + 1) * (filters.size ?? 20), total)} sur ${total.toLocaleString('fr-FR')} rÃ©sultats`
              : 'Aucun rÃ©sultat'}
          </div>
          <div className="pagination-btns">
            <button className="page-btn" disabled={currentPage === 0} onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 0) - 1 }))}>
              <i className="fa-solid fa-chevron-left" style={{ fontSize: 10 }} aria-hidden />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button key={i} className={`page-btn${currentPage === i ? ' actif' : ''}`} onClick={() => setFilters((f) => ({ ...f, page: i }))}>
                {i + 1}
              </button>
            ))}
            {totalPages > 5 && <button className="page-btn">â€¦</button>}
            <button className="page-btn" disabled={currentPage + 1 >= totalPages} onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 0) + 1 }))}>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: 10 }} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
