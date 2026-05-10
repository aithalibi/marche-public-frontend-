'use client'

import Link from 'next/link'
import { useDashboardStats } from '@/hooks/useDashboard'
import { useOffres } from '@/hooks/useOffres'

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function formatDelta(value: number, suffix: string) {
  if (value === 0) return `0 ${suffix}`
  return `${value > 0 ? '+' : ''}${value} ${suffix}`
}

export default function RecherchePage() {
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { data, isLoading } = useOffres({ size: 8, page: 0, statut: 'OUVERT' })

  const content = data?.content ?? []
  const total = stats?.totalOffres ?? data?.totalElements ?? 0
  const urgentOffers = content.filter((offre) => {
    const days = daysUntil(offre.dateLimiteSoumission)
    return days !== null && days >= 0 && days <= 2
  })
  const latestOffers = content.slice(0, 5)

  return (
    <>
      <div className="u-page-header">
        <div className="u-page-title">
          <h2><i className="fa-solid fa-gauge" aria-hidden /> Tableau de bord</h2>
          <p>
            {statsLoading || isLoading
              ? 'Chargement des indicateurs...'
              : `${total.toLocaleString('fr-FR')} marchés disponibles`}
          </p>
        </div>
      </div>

      {urgentOffers.length > 0 && (
        <div className="u-alert-banner">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden />
          <span>
            <strong>Échéances proches :</strong>{' '}
            {urgentOffers.length} marché{urgentOffers.length > 1 ? 's arrivent' : ' arrive'} à clôture dans les 48 prochaines heures.
          </span>
          <Link className="u-alert-link" href="/marches">
            Consulter les marchés <i className="fa-solid fa-arrow-right" aria-hidden />
          </Link>
        </div>
      )}

      <div className="u-stats-grid">
        <div className="u-stat-card">
          <div className="u-stat-icon blue"><i className="fa-solid fa-database" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Marchés collectés aujourd&apos;hui</div>
            <div className="u-stat-number">{stats?.offresCollecteesAujourdHui ?? 0}</div>
            <div className={`u-stat-sub ${(stats?.variationCollecteVsHier ?? 0) >= 0 ? 'green' : 'amber'}`}>
              <i className={`fa-solid ${(stats?.variationCollecteVsHier ?? 0) >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} aria-hidden />{' '}
              {formatDelta(stats?.variationCollecteVsHier ?? 0, 'depuis hier')}
            </div>
          </div>
        </div>

        <div className="u-stat-card">
          <div className="u-stat-icon green"><i className="fa-solid fa-envelopes-bulk" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Offres à vérifier</div>
            <div className="u-stat-number">{stats?.correspondancesActives ?? 0}</div>
            <div className="u-stat-sub green">
              <i className="fa-solid fa-plus" aria-hidden /> {stats?.nouvellesCorrespondancesAujourdHui ?? 0} nouvelles aujourd&apos;hui
            </div>
          </div>
        </div>

        <div className="u-stat-card">
          <div className="u-stat-icon amber"><i className="fa-solid fa-bookmark" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Marchés en suivi</div>
            <div className="u-stat-number">{stats?.marchesEnSuivi ?? 0}</div>
            <div className="u-stat-sub amber">
              <i className="fa-solid fa-magnifying-glass-chart" aria-hidden /> {stats?.marchesEnAnalyse ?? 0} en analyse
            </div>
          </div>
        </div>

        <div className="u-stat-card">
          <div className="u-stat-icon teal"><i className="fa-solid fa-hourglass-half" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Clôtures dans 48h</div>
            <div className="u-stat-number">{stats?.cloturesDans48h ?? urgentOffers.length}</div>
            <div className="u-stat-sub teal">
              <i className="fa-solid fa-clock" aria-hidden /> À traiter en priorité
            </div>
          </div>
        </div>
      </div>

      <div className="u-stats-grid">
        <Link className="u-stat-card" href="/marches">
          <div className="u-stat-icon blue"><i className="fa-solid fa-list-check" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Tous les marchés</div>
            <div className="u-stat-number">Rechercher</div>
            <div className="u-stat-sub blue">Catalogue complet avec filtres avancés</div>
          </div>
        </Link>

        <Link className="u-stat-card" href="/marches">
          <div className="u-stat-icon green"><i className="fa-solid fa-bullseye" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Marchés pertinents</div>
            <div className="u-stat-number">Filtrer</div>
            <div className="u-stat-sub green">Utilisez les filtres pour cibler les bonnes offres</div>
          </div>
        </Link>

        <Link className="u-stat-card" href="/suivi">
          <div className="u-stat-icon amber"><i className="fa-solid fa-bookmark" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Suivis</div>
            <div className="u-stat-number">Gérer</div>
            <div className="u-stat-sub amber">Opportunités enregistrées</div>
          </div>
        </Link>

        <Link className="u-stat-card" href="/alertes">
          <div className="u-stat-icon teal"><i className="fa-solid fa-sliders" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Mes alertes</div>
            <div className="u-stat-number">Configurer</div>
            <div className="u-stat-sub teal">Secteurs, régions et mots-clés</div>
          </div>
        </Link>
      </div>

      <div className="u-table-section">
        <div className="u-table-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="u-table-title">
              <i className="fa-solid fa-clock-rotate-left" aria-hidden /> Derniers marchés ouverts
            </div>
            <span className="u-result-count">{latestOffers.length} affichés</span>
          </div>
          <Link className="u-btn-icon" href="/marches">
            Voir tout <i className="fa-solid fa-arrow-right" aria-hidden />
          </Link>
        </div>

        {isLoading ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 22, marginBottom: 8 }} aria-hidden />
            <div style={{ fontSize: 13 }}>Chargement des derniers marchés...</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Référence / Intitulé</th>
                <th>Acheteur</th>
                <th>Date limite</th>
                <th>Accès</th>
              </tr>
            </thead>
            <tbody>
              {latestOffers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--muted)' }}>
                    Aucun marché ouvert pour le moment.
                  </td>
                </tr>
              ) : (
                latestOffers.map((offre) => (
                  <tr key={offre.id}>
                    <td>
                      <div className="marche-ref">{offre.reference}</div>
                      <div className="marche-titre">{offre.titre}</div>
                    </td>
                    <td className="acheteur-cell">
                      <div className="acheteur-name">{offre.acheteur}</div>
                      {offre.region && <div className="acheteur-ville">{offre.region}</div>}
                    </td>
                    <td className="date-cell">
                      <div className="date-main">{formatDate(offre.dateLimiteSoumission)}</div>
                    </td>
                    <td>
                      <Link className="btn-action btn-voir" href="/marches">
                        Analyser
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
