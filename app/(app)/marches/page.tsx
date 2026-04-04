'use client'

import { useState } from 'react'
import { useOffres } from '@/hooks/useOffres'
import { updateSuivi } from '@/lib/api/offres'
import type { OffresFilters, SuiviStatus } from '@/types'

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function statutBadgeClass(statut: string) {
  switch (statut) {
    case 'OUVERT': return 'badge-statut badge-nouveau'
    case 'CLOS': return 'badge-statut badge-cloture'
    case 'ANNULE': return 'badge-statut badge-cloture'
    case 'ATTRIBUE': return 'badge-statut badge-en-cours'
    default: return 'badge-statut badge-nouveau'
  }
}

function statutLabel(statut: string) {
  switch (statut) {
    case 'OUVERT': return 'Ouvert'
    case 'CLOS': return 'Clôturé'
    case 'ANNULE': return 'Annulé'
    case 'ATTRIBUE': return 'Attribué'
    default: return statut
  }
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

const CATEGORIES = [
  { value: 'SERVICES', label: 'Services', icon: 'fa-chalkboard-user', cls: 'badge badge-services' },
  { value: 'TRAVAUX', label: 'BTP / Travaux', icon: 'fa-hard-hat', cls: 'badge badge-btp' },
  { value: 'FOURNITURES', label: 'Fournitures', icon: 'fa-boxes-stacked', cls: 'badge badge-fournitures' },
]

export default function MarchesPage() {
  const [filters, setFilters] = useState<OffresFilters>({ size: 20, page: 0 })
  const [search, setSearch] = useState('')
  const { data, isLoading, error, mutate } = useOffres(filters)

  const total = data?.totalElements ?? 0
  const content = data?.content ?? []
  const totalPages = data?.totalPages ?? 1
  const currentPage = filters.page ?? 0

  async function handleSuiviChange(offreId: string, status: SuiviStatus) {
    await updateSuivi(offreId, status)
    mutate()
  }

  function handleSearch() {
    setFilters((f) => ({ ...f, search: search || undefined, page: 0 }))
  }

  function handleReset() {
    setSearch('')
    setFilters({ size: 20, page: 0 })
  }

  return (
    <>
      <div className="u-page-header">
        <div className="u-page-title">
          <h2><i className="fa-solid fa-list-check" aria-hidden /> Tous les marchés</h2>
          <p>
            {isLoading ? 'Chargement…' : `${total.toLocaleString('fr-FR')} marchés disponibles dans la base`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="u-btn-icon"><i className="fa-solid fa-file-excel" aria-hidden /> Exporter</button>
        </div>
      </div>

      {/* Category quick filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          className="u-btn-icon"
          style={!filters.typeMarche ? { borderColor: 'var(--primary)', color: 'var(--primary)', background: '#EFF6FF' } : {}}
          onClick={() => setFilters((f) => ({ ...f, typeMarche: undefined, page: 0 }))}
        >
          <i className="fa-solid fa-layer-group" aria-hidden /> Toutes catégories
          {!filters.typeMarche && <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 10, marginLeft: 4 }}>{total}</span>}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className="u-btn-icon"
            style={filters.typeMarche === cat.value ? { borderColor: 'var(--primary)', color: 'var(--primary)', background: '#EFF6FF' } : {}}
            onClick={() => setFilters((f) => ({ ...f, typeMarche: cat.value as any, page: 0 }))}
          >
            <i className={`fa-solid ${cat.icon}`} aria-hidden /> {cat.label}
          </button>
        ))}
      </div>

      {/* Search panel */}
      <div className="u-search-panel">
        <div className="u-search-header">
          <i className="fa-solid fa-magnifying-glass" aria-hidden /> Recherche avancée
        </div>
        <div className="u-search-body">
          <div className="u-search-main">
            <div className="u-search-input-wrap">
              <i className="fa-solid fa-magnifying-glass" aria-hidden />
              <input
                type="text"
                placeholder="Mot-clé, intitulé, acheteur, référence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="u-btn-search" onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden /> Rechercher
            </button>
            <button className="u-btn-reset" onClick={handleReset}>
              <i className="fa-solid fa-rotate-left" aria-hidden /> Réinitialiser
            </button>
          </div>
          <div className="u-filtres-grid">
            <div className="u-filtre-group">
              <label>Catégorie</label>
              <select
                value={filters.typeMarche ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, typeMarche: (e.target.value as any) || undefined, page: 0 }))}
              >
                <option value="">Toutes catégories</option>
                <option value="SERVICES">Services</option>
                <option value="TRAVAUX">BTP / Travaux</option>
                <option value="FOURNITURES">Fournitures</option>
              </select>
            </div>
            <div className="u-filtre-group">
              <label>Région</label>
              <select
                value={filters.region ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value || undefined, page: 0 }))}
              >
                <option value="">Toutes régions</option>
                <option value="Casablanca-Settat">Casablanca-Settat</option>
                <option value="Rabat-Salé-Kénitra">Rabat-Salé-Kénitra</option>
                <option value="Souss-Massa">Souss-Massa</option>
                <option value="Marrakech-Safi">Marrakech-Safi</option>
                <option value="Fès-Meknès">Fès-Meknès</option>
                <option value="Tanger-Tétouan-Al Hoceïma">Tanger-Tétouan-Al Hoceïma</option>
                <option value="Oriental">Oriental</option>
                <option value="Béni Mellal-Khénifra">Béni Mellal-Khénifra</option>
              </select>
            </div>
            <div className="u-filtre-group">
              <label>Statut</label>
              <select
                value={filters.statut ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, statut: (e.target.value as any) || undefined, page: 0 }))}
              >
                <option value="">Tous statuts</option>
                <option value="OUVERT">Ouvert</option>
                <option value="CLOS">Clôturé</option>
                <option value="ATTRIBUE">Attribué</option>
                <option value="ANNULE">Annulé</option>
              </select>
            </div>
            <div className="u-filtre-group">
              <label>Date de publication</label>
              <input type="date" onChange={() => setFilters((f) => ({ ...f, page: 0 }))} />
            </div>
            <div className="u-filtre-group">
              <label>Date limite</label>
              <input type="date" onChange={() => setFilters((f) => ({ ...f, page: 0 }))} />
            </div>
          </div>

          {(filters.region || filters.typeMarche || filters.statut || filters.search) && (
            <div className="u-tags-actifs">
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Filtres actifs :</span>
              {filters.typeMarche && (
                <span className="u-tag" onClick={() => setFilters((f) => ({ ...f, typeMarche: undefined }))}>
                  <i className="fa-solid fa-tag" aria-hidden /> {filters.typeMarche}
                  <i className="fa-solid fa-xmark" aria-hidden />
                </span>
              )}
              {filters.region && (
                <span className="u-tag" onClick={() => setFilters((f) => ({ ...f, region: undefined }))}>
                  <i className="fa-solid fa-location-dot" aria-hidden /> {filters.region}
                  <i className="fa-solid fa-xmark" aria-hidden />
                </span>
              )}
              {filters.statut && (
                <span className="u-tag" onClick={() => setFilters((f) => ({ ...f, statut: undefined }))}>
                  <i className="fa-solid fa-circle-dot" aria-hidden /> {filters.statut}
                  <i className="fa-solid fa-xmark" aria-hidden />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="u-table-section">
        <div className="u-table-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="u-table-title">
              <i className="fa-solid fa-table-list" aria-hidden /> Liste des marchés
            </div>
            <span className="u-result-count">{total.toLocaleString('fr-FR')} marchés</span>
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
            <div style={{ fontSize: 13 }}>Chargement des marchés…</div>
          </div>
        )}

        {error && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#b91c1c', fontSize: 13 }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 6 }} aria-hidden />
            Erreur lors du chargement. Veuillez réessayer.
          </div>
        )}

        {!isLoading && !error && (
          <table>
            <thead>
              <tr>
                <th style={{ width: 32 }}><input type="checkbox" /></th>
                <th>Référence / Intitulé <i className="fa-solid fa-sort" style={{ opacity: 0.5, marginLeft: 4 }} aria-hidden /></th>
                <th>Catégorie</th>
                <th>Acheteur</th>
                <th>Date pub. <i className="fa-solid fa-sort" style={{ opacity: 0.5, marginLeft: 4 }} aria-hidden /></th>
                <th>Date limite <i className="fa-solid fa-sort" style={{ opacity: 0.5, marginLeft: 4 }} aria-hidden /></th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                    Aucun marché ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                content.map((offre) => {
                  const badge = typeBadge(offre.typeMarche)
                  const days = daysUntil(offre.dateLimiteSoumission)
                  const isUrgent = days !== null && days >= 0 && days <= 2
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
                            {days < 0 ? 'Clôturé' : days === 0 ? "Aujourd'hui" : `dans ${days}j`}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={statutBadgeClass(offre.statut)}>
                          {isUrgent && <i className="fa-solid fa-clock" aria-hidden />}{' '}
                          {isUrgent ? 'Urgent' : statutLabel(offre.statut)}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <a href={offre.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-action btn-voir">
                          <i className="fa-solid fa-eye" aria-hidden /> Voir
                        </a>
                        <button
                          className={`btn-action btn-suivi`}
                          style={offre.suivi ? { color: 'var(--green)', borderColor: 'var(--green)' } : {}}
                          onClick={() => handleSuiviChange(offre.id, offre.suivi ? 'Archivé' : 'Intéressant')}
                        >
                          <i className={`fa-${offre.suivi ? 'solid' : 'regular'} fa-bookmark`} aria-hidden />
                          {offre.suivi ? 'Suivi' : 'Suivre'}
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
              ? `Affichage de ${currentPage * (filters.size ?? 20) + 1} à ${Math.min((currentPage + 1) * (filters.size ?? 20), total)} sur ${total.toLocaleString('fr-FR')} résultats`
              : 'Aucun résultat'}
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
            {totalPages > 5 && <button className="page-btn">…</button>}
            <button className="page-btn" disabled={currentPage + 1 >= totalPages} onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 0) + 1 }))}>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: 10 }} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
