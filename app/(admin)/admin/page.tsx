'use client'

export default function AdminDashboard() {
  return (
    <>
      {/* Stats */}
      <div className="a-stats">
        <div className="a-stat-card c1">
          <div className="a-stat-ico-wrap">
            <div>
              <div className="a-stat-val">12 847</div>
              <div className="a-stat-lbl">Marchés en base</div>
              <div className="a-stat-chg up">
                <i className="fa-solid fa-arrow-trend-up" aria-hidden /> +248 aujourd&apos;hui
              </div>
            </div>
            <div className="a-stat-ico c1">
              <i className="fa-solid fa-database" aria-hidden />
            </div>
          </div>
        </div>

        <div className="a-stat-card c2">
          <div className="a-stat-ico-wrap">
            <div>
              <div className="a-stat-val">4</div>
              <div className="a-stat-lbl">Robots actifs</div>
              <div className="a-stat-chg up">
                <i className="fa-solid fa-circle-check" aria-hidden /> Tous opérationnels
              </div>
            </div>
            <div className="a-stat-ico c2">
              <i className="fa-solid fa-robot" aria-hidden />
            </div>
          </div>
        </div>

        <div className="a-stat-card c3">
          <div className="a-stat-ico-wrap">
            <div>
              <div className="a-stat-val">862</div>
              <div className="a-stat-lbl">Utilisateurs inscrits</div>
              <div className="a-stat-chg up">
                <i className="fa-solid fa-arrow-trend-up" aria-hidden /> +12 cette semaine
              </div>
            </div>
            <div className="a-stat-ico c3">
              <i className="fa-solid fa-users" aria-hidden />
            </div>
          </div>
        </div>

        <div className="a-stat-card c4">
          <div className="a-stat-ico-wrap">
            <div>
              <div className="a-stat-val">98.4%</div>
              <div className="a-stat-lbl">Taux de détection</div>
              <div className="a-stat-chg up">
                <i className="fa-solid fa-arrow-trend-up" aria-hidden /> +0.3% ce mois
              </div>
            </div>
            <div className="a-stat-ico c4">
              <i className="fa-solid fa-bullseye" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      {/* Robots + Logs */}
      <div className="a-grid2">
        {/* Robots */}
        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-robot" aria-hidden /> État des robots
            </div>
            <a className="a-card-action">
              <i className="fa-solid fa-rotate" aria-hidden /> Actualiser
            </a>
          </div>

          <div className="scraper-row">
            <div className="scraper-ico">
              <i className="fa-solid fa-spider" aria-hidden />
            </div>
            <div style={{ flex: 1 }}>
              <div className="scraper-name">Robot Principal — marchespublics.gov.ma</div>
              <div className="scraper-url">AO + Bons de commande</div>
              <div className="scraper-meta">
                <span><span className="pulse" /> Actif</span>
                <span><i className="fa-solid fa-clock" aria-hidden /> 13:22</span>
                <span><i className="fa-solid fa-file-lines" aria-hidden /> 248 collectés</span>
              </div>
              <div className="prog" style={{ marginTop: 8 }}>
                <div className="prog-fill" style={{ width: '78%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="a-btn-ghost"><i className="fa-solid fa-pause" aria-hidden /></button>
              <button className="a-btn-ghost"><i className="fa-solid fa-rotate-right" aria-hidden /></button>
            </div>
          </div>

          <div className="scraper-row">
            <div className="scraper-ico">
              <i className="fa-solid fa-spider" aria-hidden />
            </div>
            <div style={{ flex: 1 }}>
              <div className="scraper-name">Robot TGR — Trésorerie Générale</div>
              <div className="scraper-url">tgr.gov.ma · Marchés réservés</div>
              <div className="scraper-meta">
                <span><span className="pulse" /> Actif</span>
                <span><i className="fa-solid fa-clock" aria-hidden /> 12:48</span>
                <span><i className="fa-solid fa-file-lines" aria-hidden /> 34 collectés</span>
              </div>
              <div className="prog" style={{ marginTop: 8 }}>
                <div className="prog-fill" style={{ width: '45%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="a-btn-ghost"><i className="fa-solid fa-pause" aria-hidden /></button>
              <button className="a-btn-ghost"><i className="fa-solid fa-rotate-right" aria-hidden /></button>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-terminal" aria-hidden /> Logs en temps réel
            </div>
            <a className="a-card-action">
              <i className="fa-solid fa-expand" aria-hidden /> Plein écran
            </a>
          </div>
          <div className="logbox">
            <div><span className="log-info">[13:42:01]</span> <span className="log-ok">✓ Robot principal — collecte en cours (78%)</span></div>
            <div><span className="log-info">[13:41:55]</span> <span className="log-ok">✓ 248 marchés indexés en base</span></div>
            <div><span className="log-info">[13:41:22]</span> <span className="log-warn">⚠ 3 doublons détectés et ignorés</span></div>
            <div><span className="log-info">[13:40:11]</span> <span className="log-ok">✓ 47 alertes emails envoyées</span></div>
            <div><span className="log-info">[13:38:07]</span> <span className="log-ok">✓ Matching profils — 12 correspondances</span></div>
            <div><span className="log-info">[13:37:44]</span> <span className="log-ok">✓ Robot TGR — 34 marchés collectés</span></div>
            <div><span className="log-info">[13:36:10]</span> <span className="log-info">ℹ Maintenance base données planifiée 02:00</span></div>
            <div><span className="log-info">[13:30:00]</span> <span className="log-ok">✓ Démarrage cycle collecte #7 du jour</span></div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="a-card">
        <div className="a-card-title">
          <div className="a-ct-left">
            <i className="fa-solid fa-users" aria-hidden /> Utilisateurs récents
          </div>
          <a className="a-card-action" href="/admin/comptes">
            <i className="fa-solid fa-arrow-right" aria-hidden /> Voir tous
          </a>
        </div>
        <table className="a-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Secteurs</th>
              <th>Région</th>
              <th>Inscription</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{ fontWeight: 600 }}>Ochline Chaimaa</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>o.chaimaa@techma.ma</div>
              </td>
              <td><span className="a-badge user"><i className="fa-solid fa-user" aria-hidden /> Utilisateur</span></td>
              <td><span className="a-badge it">IT</span></td>
              <td>Souss-Massa</td>
              <td>01/03/2026</td>
              <td><span className="a-badge actif"><i className="fa-solid fa-circle-check" aria-hidden /> Actif</span></td>
              <td style={{ display: 'flex', gap: 5 }}>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-eye" aria-hidden /></button>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-pen" aria-hidden /></button>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ fontWeight: 600 }}>Karim Benali</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>k.benali@btpcasa.ma</div>
              </td>
              <td><span className="a-badge user"><i className="fa-solid fa-user" aria-hidden /> Utilisateur</span></td>
              <td><span className="a-badge btp">BTP</span></td>
              <td>Casablanca-Settat</td>
              <td>25/02/2026</td>
              <td><span className="a-badge actif"><i className="fa-solid fa-circle-check" aria-hidden /> Actif</span></td>
              <td style={{ display: 'flex', gap: 5 }}>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-eye" aria-hidden /></button>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-pen" aria-hidden /></button>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ fontWeight: 600 }}>Sara El Mansouri</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>s.elmansouri@consult.ma</div>
              </td>
              <td><span className="a-badge admin"><i className="fa-solid fa-shield-halved" aria-hidden /> Admin</span></td>
              <td><span className="a-badge it">IT</span></td>
              <td>Rabat-Salé</td>
              <td>10/01/2026</td>
              <td><span className="a-badge actif"><i className="fa-solid fa-circle-check" aria-hidden /> Actif</span></td>
              <td style={{ display: 'flex', gap: 5 }}>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-eye" aria-hidden /></button>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-pen" aria-hidden /></button>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ fontWeight: 600 }}>Youssef Tazi</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>y.tazi@marktrade.ma</div>
              </td>
              <td><span className="a-badge user"><i className="fa-solid fa-user" aria-hidden /> Utilisateur</span></td>
              <td><span className="a-badge btp">BTP</span></td>
              <td>Marrakech-Safi</td>
              <td>18/02/2026</td>
              <td><span className="a-badge attente"><i className="fa-solid fa-clock" aria-hidden /> En attente</span></td>
              <td style={{ display: 'flex', gap: 5 }}>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-eye" aria-hidden /></button>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }}><i className="fa-solid fa-pen" aria-hidden /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
