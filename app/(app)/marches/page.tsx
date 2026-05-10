'use client'

import { useState } from 'react'
import { useOffreFilters } from '@/hooks/useOffreFilters'
import { useOffres } from '@/hooks/useOffres'
import { updateSuivi } from '@/lib/api/offres'
import type { Offre, OffresFilters, StatutOffre, SuiviStatus } from '@/types'

function isStatutOffre(value: string): value is StatutOffre {
  return value === 'OUVERT' || value === 'CLOS' || value === 'ATTRIBUE' || value === 'ANNULE'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function openOfficialOffer(url: string) {
  if (!url) return
  window.location.assign(url)
}

function statutBadgeClass(statut: string) {
  switch (statut) {
    case 'OUVERT':
      return 'badge-statut badge-nouveau'
    case 'CLOS':
      return 'badge-statut badge-cloture'
    case 'ANNULE':
      return 'badge-statut badge-cloture'
    case 'ATTRIBUE':
      return 'badge-statut badge-en-cours'
    default:
      return 'badge-statut badge-nouveau'
  }
}

function statutLabel(statut: string) {
  switch (statut) {
    case 'OUVERT':
      return 'Ouvert'
    case 'CLOS':
      return 'Clôturé'
    case 'ANNULE':
      return 'Annulé'
    case 'ATTRIBUE':
      return 'Attribué'
    default:
      return statut
  }
}

function typeBadge(type: string) {
  const normalized = type.toUpperCase()

  if (normalized.includes('FOURNITURE')) {
    return { cls: 'badge badge-fournitures', icon: 'fa-boxes-stacked', label: 'Fournitures' }
  }
  if (normalized.includes('TRAVAUX') || normalized.includes('BTP')) {
    return { cls: 'badge badge-btp', icon: 'fa-hard-hat', label: 'Travaux' }
  }
  if (normalized.includes('SERVICE')) {
    return { cls: 'badge badge-services', icon: 'fa-chalkboard-user', label: 'Services' }
  }

  return { cls: 'badge badge-it', icon: 'fa-tag', label: type || 'Catégorie' }
}

function exportFileName(extension: 'csv' | 'pdf') {
  const date = new Date().toISOString().slice(0, 10)
  return `marches-publics-${date}.${extension}`
}

function exportRows(offres: Offre[]) {
  return offres.map((offre) => ({
    Référence: offre.reference,
    Intitulé: offre.titre,
    Catégorie: offre.secteur || offre.typeMarche,
    Acheteur: offre.acheteur,
    Région: offre.region,
    'Date de publication': formatDate(offre.datePublication),
    'Date limite': formatDate(offre.dateLimiteSoumission),
    Statut: statutLabel(offre.statut),
    'Lien officiel': offre.sourceUrl,
  }))
}

function csvCell(value: string) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

function downloadCsv(offres: Offre[]) {
  if (offres.length === 0) return

  const rows = exportRows(offres)
  const headers = Object.keys(rows[0])
  const csv = [
    headers.map(csvCell).join(';'),
    ...rows.map((row) => headers.map((header) => csvCell(row[header as keyof typeof row])).join(';')),
  ].join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = exportFileName('csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function escapeHtml(value: string) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, ' ')
}

function pdfText(value: string) {
  return escapeHtml(value).replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function wrapPdfText(value: string, maxLength: number) {
  const words = escapeHtml(value).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLength) {
      if (current) lines.push(current)
      current = word
    } else {
      current = next
    }
  })

  if (current) lines.push(current)
  return lines.slice(0, 4)
}

function buildPdf(offres: Offre[]) {
  const pageWidth = 842
  const pageHeight = 595
  const margin = 32
  const rowHeight = 58
  const rowsPerPage = 8
  const columns = [
    { label: 'Reference', x: 32, width: 88 },
    { label: 'Intitule', x: 126, width: 210 },
    { label: 'Categorie', x: 342, width: 80 },
    { label: 'Acheteur', x: 430, width: 132 },
    { label: 'Region', x: 570, width: 70 },
    { label: 'Date pub.', x: 646, width: 58 },
    { label: 'Date limite', x: 710, width: 62 },
    { label: 'Statut', x: 778, width: 44 },
  ]
  const pages: string[] = []

  for (let start = 0; start < offres.length; start += rowsPerPage) {
    const pageRows = offres.slice(start, start + rowsPerPage)
    const commands: string[] = [
      'BT',
      '/F1 16 Tf',
      `1 0 0 1 ${margin} ${pageHeight - 36} Tm`,
      `(Liste des marches publics) Tj`,
      '/F1 9 Tf',
      `1 0 0 1 ${margin} ${pageHeight - 54} Tm`,
      `(${pdfText(`${offres.length} marches exportes le ${new Date().toLocaleDateString('fr-FR')}`)}) Tj`,
      '/F1 8 Tf',
    ]

    columns.forEach((column) => {
      commands.push(`1 0 0 1 ${column.x} ${pageHeight - 82} Tm`)
      commands.push(`(${pdfText(column.label)}) Tj`)
    })

    pageRows.forEach((offre, rowIndex) => {
      const y = pageHeight - 104 - rowIndex * rowHeight
      const row = exportRows([offre])[0]
      const values = [
        row.Référence,
        row.Intitulé,
        row.Catégorie,
        row.Acheteur,
        row.Région,
        row['Date de publication'],
        row['Date limite'],
        row.Statut,
      ]

      values.forEach((value, index) => {
        const column = columns[index]
        const maxChars = Math.max(8, Math.floor(column.width / 4.4))
        wrapPdfText(value, maxChars).forEach((line, lineIndex) => {
          commands.push(`1 0 0 1 ${column.x} ${y - lineIndex * 9} Tm`)
          commands.push(`(${pdfText(line)}) Tj`)
        })
      })
    })

    commands.push('ET')
    pages.push(commands.join('\n'))
  }

  const objects: string[] = []
  const pageObjectNumbers: number[] = []

  objects.push('<< /Type /Catalog /Pages 2 0 R >>')
  objects.push('')
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

  pages.forEach((content) => {
    const contentNumber = objects.length + 1
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    const pageNumber = objects.length + 1
    pageObjectNumbers.push(pageNumber)
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentNumber} 0 R >>`)
  })

  objects[1] = `<< /Type /Pages /Kids [${pageObjectNumbers.map((number) => `${number} 0 R`).join(' ')}] /Count ${pageObjectNumbers.length} >>`

  const parts = ['%PDF-1.4\n']
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(parts.join('').length)
    parts.push(`${index + 1} 0 obj\n${object}\nendobj\n`)
  })

  const xrefOffset = parts.join('').length
  parts.push(`xref\n0 ${objects.length + 1}\n`)
  parts.push('0000000000 65535 f \n')
  offsets.slice(1).forEach((offset) => {
    parts.push(`${String(offset).padStart(10, '0')} 00000 n \n`)
  })
  parts.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`)

  return parts.join('')
}

function downloadPdf(offres: Offre[]) {
  if (offres.length === 0) return

  const blob = new Blob([buildPdf(offres)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = exportFileName('pdf')
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function MarchesPage() {
  const [filters, setFilters] = useState<OffresFilters>({ size: 20, page: 0 })
  const [search, setSearch] = useState('')
  const { data, isLoading, error, mutate } = useOffres(filters)
  const { filterOptions } = useOffreFilters()

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
          <button className="u-btn-icon" type="button" disabled={content.length === 0} onClick={() => downloadCsv(content)}>
            <i className="fa-solid fa-file-excel" aria-hidden /> Exporter
          </button>
        </div>
      </div>

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
                value={filters.secteur ?? filters.typeMarche ?? ''}
                onChange={(e) => {
                  const value = e.target.value || undefined
                  setFilters((f) => ({ ...f, secteur: value, typeMarche: undefined, page: 0 }))
                }}
              >
                <option value="">Toutes catégories</option>
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="u-filtre-group">
              <label>Région / ville</label>
              <select
                value={filters.region ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value || undefined, page: 0 }))}
              >
                <option value="">Toutes localisations</option>
                {filterOptions.localisations.map((localisation) => (
                  <option key={localisation} value={localisation}>{localisation}</option>
                ))}
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
                <option value="">Tous statuts</option>
                <option value="OUVERT">Ouvert</option>
                <option value="CLOS">Clôturé</option>
              </select>
            </div>
            <div className="u-filtre-group">
              <label>Date de publication</label>
              <input
                type="date"
                value={filters.dateMin ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, dateMin: e.target.value || undefined, page: 0 }))}
              />
            </div>
            <div className="u-filtre-group">
              <label>Date limite maximum</label>
              <input
                type="date"
                value={filters.dateLimiteMax ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, dateLimiteMax: e.target.value || undefined, page: 0 }))}
              />
            </div>
          </div>

          {(filters.region || filters.secteur || filters.statut || filters.search || filters.dateMin || filters.dateLimiteMax) && (
            <div className="u-tags-actifs">
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Filtres actifs :</span>
              {filters.secteur && (
                <span className="u-tag" onClick={() => setFilters((f) => ({ ...f, secteur: undefined, page: 0 }))}>
                  <i className="fa-solid fa-tag" aria-hidden /> {filters.secteur}
                  <i className="fa-solid fa-xmark" aria-hidden />
                </span>
              )}
              {filters.region && (
                <span className="u-tag" onClick={() => setFilters((f) => ({ ...f, region: undefined, page: 0 }))}>
                  <i className="fa-solid fa-location-dot" aria-hidden /> {filters.region}
                  <i className="fa-solid fa-xmark" aria-hidden />
                </span>
              )}
              {filters.statut && (
                <span className="u-tag" onClick={() => setFilters((f) => ({ ...f, statut: undefined, page: 0 }))}>
                  <i className="fa-solid fa-circle-dot" aria-hidden /> {filters.statut}
                  <i className="fa-solid fa-xmark" aria-hidden />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="u-table-section">
        <div className="u-table-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="u-table-title">
              <i className="fa-solid fa-table-list" aria-hidden /> Liste des marchés
            </div>
            <span className="u-result-count">{total.toLocaleString('fr-FR')} marchés</span>
          </div>
          <div className="u-table-actions">
            <button className="u-btn-icon" type="button" disabled={content.length === 0} onClick={() => downloadCsv(content)}>
              <i className="fa-solid fa-file-excel" aria-hidden /> Excel
            </button>
            <button className="u-btn-icon" type="button" disabled={content.length === 0} onClick={() => downloadPdf(content)}>
              <i className="fa-solid fa-file-pdf" aria-hidden /> PDF
            </button>
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
                  const badge = typeBadge(offre.secteur || offre.typeMarche)
                  const days = daysUntil(offre.dateLimiteSoumission)
                  const isUrgent = days !== null && days >= 0 && days <= 2
                  return (
                    <tr
                      key={offre.id}
                      className="clickable-offre-row"
                      title="Ouvrir l'offre sur le site officiel"
                      onClick={() => openOfficialOffer(offre.sourceUrl)}
                    >
                      <td onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
                      <td>
                        <div className="marche-ref">{offre.reference}</div>
                        <div className="marche-titre">
                          <a href={offre.sourceUrl} onClick={(e) => e.stopPropagation()}>{offre.titre}</a>
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
                            {days < 0 ? 'Clôturé' : days === 0 ? "Clôture aujourd'hui" : `dans ${days} jour${days > 1 ? 's' : ''}`}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={statutBadgeClass(offre.statut)}>
                          {isUrgent && <i className="fa-solid fa-clock" aria-hidden />}{' '}
                          {isUrgent ? 'Urgent' : statutLabel(offre.statut)}
                        </span>
                      </td>
                      <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                        <a href={offre.sourceUrl} className="btn-action btn-voir">
                          <i className="fa-solid fa-eye" aria-hidden /> Voir
                        </a>
                        <button
                          className={`btn-action btn-suivi${offre.suivi ? ' ' : ''}`}
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
