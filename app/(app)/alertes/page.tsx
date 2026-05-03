'use client'

import { useState } from 'react'

type AlertRule = {
  id: number
  type: 'keyword' | 'sector' | 'region'
  value: string
  active: boolean
  frequency: 'INSTANT' | 'DAILY' | 'WEEKLY'
}

type AlertRuleFrequency = AlertRule['frequency']

const SECTORS = [
  'Informatique & TÃ©lÃ©coms', 'BTP & Travaux publics', 'SantÃ© & MÃ©dical',
  'Ã‰ducation & Formation', 'Ã‰nergie & Environnement', 'Transport & Logistique',
  'Services aux entreprises', 'Agriculture & Agroalimentaire',
]

const REGIONS = [
  'Casablanca-Settat', 'Rabat-SalÃ©-KÃ©nitra', 'Marrakech-Safi',
  'Souss-Massa', 'FÃ¨s-MeknÃ¨s', 'Tanger-TÃ©touan-Al HoceÃ¯ma',
  'Oriental', 'BÃ©ni Mellal-KhÃ©nifra',
]

const FREQ_LABELS: Record<AlertRuleFrequency, string> = {
  INSTANT: 'InstantanÃ©',
  DAILY: 'Quotidien',
  WEEKLY: 'Hebdomadaire',
}

function isAlertRuleFrequency(value: string): value is AlertRuleFrequency {
  return value === 'INSTANT' || value === 'DAILY' || value === 'WEEKLY'
}

export default function AlertesPage() {
  const [rules, setRules] = useState<AlertRule[]>([
    { id: 1, type: 'keyword', value: 'informatique', active: true, frequency: 'INSTANT' },
    { id: 2, type: 'sector', value: 'BTP & Travaux publics', active: true, frequency: 'DAILY' },
    { id: 3, type: 'region', value: 'Casablanca-Settat', active: false, frequency: 'WEEKLY' },
  ])
  const [newKeyword, setNewKeyword] = useState('')
  const [newSector, setNewSector] = useState('')
  const [newRegion, setNewRegion] = useState('')
  const [emailNotif, setEmailNotif] = useState(true)
  const [browserNotif, setBrowserNotif] = useState(false)

  function toggleRule(id: number) {
    setRules((rs) => rs.map((r) => r.id === id ? { ...r, active: !r.active } : r))
  }

  function deleteRule(id: number) {
    setRules((rs) => rs.filter((r) => r.id !== id))
  }

  function addKeyword() {
    const v = newKeyword.trim()
    if (!v) return
    setRules((rs) => [...rs, { id: Date.now(), type: 'keyword', value: v, active: true, frequency: 'INSTANT' }])
    setNewKeyword('')
  }

  function addSector() {
    if (!newSector) return
    setRules((rs) => [...rs, { id: Date.now(), type: 'sector', value: newSector, active: true, frequency: 'DAILY' }])
    setNewSector('')
  }

  function addRegion() {
    if (!newRegion) return
    setRules((rs) => [...rs, { id: Date.now(), type: 'region', value: newRegion, active: true, frequency: 'DAILY' }])
    setNewRegion('')
  }

  const keywords = rules.filter((r) => r.type === 'keyword')
  const sectors = rules.filter((r) => r.type === 'sector')
  const regions = rules.filter((r) => r.type === 'region')
  const activeCount = rules.filter((r) => r.active).length

  return (
    <>
      <div className="u-page-header">
        <div className="u-page-title">
          <h2><i className="fa-solid fa-sliders" aria-hidden /> Mes alertes</h2>
          <p>{activeCount} alerte{activeCount !== 1 ? 's' : ''} active{activeCount !== 1 ? 's' : ''} â€” Vous recevez des notifications dÃ¨s qu&apos;un marchÃ© correspond</p>
        </div>
      </div>

      <div className="u-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="u-stat-card">
          <div className="u-stat-icon blue"><i className="fa-solid fa-bell" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Alertes actives</div>
            <div className="u-stat-number">{activeCount}</div>
            <div className="u-stat-sub blue"><i className="fa-solid fa-circle-check" aria-hidden /> Sur {rules.length} configurÃ©es</div>
          </div>
        </div>
        <div className="u-stat-card">
          <div className="u-stat-icon green"><i className="fa-solid fa-key" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Mots-clÃ©s surveillÃ©s</div>
            <div className="u-stat-number">{keywords.length}</div>
            <div className="u-stat-sub green"><i className="fa-solid fa-magnifying-glass" aria-hidden /> Recherche dans les titres</div>
          </div>
        </div>
        <div className="u-stat-card">
          <div className="u-stat-icon amber"><i className="fa-solid fa-layer-group" aria-hidden /></div>
          <div className="u-stat-body">
            <div className="u-stat-label">Secteurs & RÃ©gions</div>
            <div className="u-stat-number">{sectors.length + regions.length}</div>
            <div className="u-stat-sub amber"><i className="fa-solid fa-map-location-dot" aria-hidden /> Filtres gÃ©ographiques actifs</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="u-table-section">
          <div className="u-table-header">
            <div className="u-table-title">
              <i className="fa-solid fa-key" aria-hidden /> Alertes par mots-clÃ©s
            </div>
            <span className="u-result-count">{keywords.length}</span>
          </div>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="u-search-input-wrap" style={{ flex: 1 }}>
                <i className="fa-solid fa-magnifying-glass" aria-hidden />
                <input
                  type="text"
                  placeholder="Ex: informatique, travaux, rÃ©seau..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                />
              </div>
              <button className="u-btn-search" onClick={addKeyword}>
                <i className="fa-solid fa-plus" aria-hidden /> Ajouter
              </button>
            </div>
          </div>
          {keywords.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              <i className="fa-solid fa-key" style={{ fontSize: 24, marginBottom: 8, display: 'block', opacity: 0.3 }} aria-hidden />
              Aucun mot-clÃ© configurÃ©
            </div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {keywords.map((r) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid var(--border)', gap: 12 }}>
                  <div
                    style={{
                      width: 36, height: 20, borderRadius: 10,
                      background: r.active ? 'var(--green)' : 'var(--border)',
                      cursor: 'pointer', position: 'relative', flexShrink: 0, transition: '.2s',
                    }}
                    onClick={() => toggleRule(r.id)}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 3, left: r.active ? 19 : 3, transition: '.2s',
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: r.active ? 'var(--text)' : 'var(--muted)' }}>
                      {r.value}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      <i className="fa-solid fa-clock" aria-hidden /> {FREQ_LABELS[r.frequency]}
                    </div>
                  </div>
                  <select
                    value={r.frequency}
                    onChange={(e) => {
                      const value = e.target.value
                      if (!isAlertRuleFrequency(value)) return
                      setRules((rs) => rs.map((x) => x.id === r.id ? { ...x, frequency: value } : x))
                    }}
                    style={{ padding: '4px 8px', border: '1.5px solid var(--border)', borderRadius: 6, fontSize: 11, background: 'white', outline: 'none', fontFamily: "'Manrope',sans-serif" }}
                  >
                    <option value="INSTANT">InstantanÃ©</option>
                    <option value="DAILY">Quotidien</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                  </select>
                  <button
                    onClick={() => deleteRule(r.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, padding: 4 }}
                  >
                    <i className="fa-solid fa-trash" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="u-table-section">
            <div className="u-table-header">
              <div className="u-table-title">
                <i className="fa-solid fa-layer-group" aria-hidden /> Alertes par secteur
              </div>
              <span className="u-result-count">{sectors.length}</span>
            </div>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', gap: 8 }}>
              <select
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                style={{ flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 13, background: 'white', outline: 'none', fontFamily: "'Manrope',sans-serif", color: 'var(--text)' }}
              >
                <option value="">Choisir un secteurâ€¦</option>
                {SECTORS.filter((s) => !sectors.find((r) => r.value === s)).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="u-btn-search" onClick={addSector}>
                <i className="fa-solid fa-plus" aria-hidden /> Ajouter
              </button>
            </div>
            {sectors.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>Aucun secteur configurÃ©</div>
            ) : (
              <div style={{ padding: '6px 0' }}>
                {sectors.map((r) => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid var(--border)', gap: 10 }}>
                    <div
                      style={{ width: 32, height: 18, borderRadius: 9, background: r.active ? 'var(--green)' : 'var(--border)', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: '.2s' }}
                      onClick={() => toggleRule(r.id)}
                    >
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: r.active ? 17 : 3, transition: '.2s' }} />
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: r.active ? 'var(--text)' : 'var(--muted)' }}>{r.value}</span>
                    <button onClick={() => deleteRule(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12, padding: 4 }}>
                      <i className="fa-solid fa-xmark" aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="u-table-section">
            <div className="u-table-header">
              <div className="u-table-title">
                <i className="fa-solid fa-map-location-dot" aria-hidden /> Alertes par rÃ©gion
              </div>
              <span className="u-result-count">{regions.length}</span>
            </div>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', gap: 8 }}>
              <select
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                style={{ flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 13, background: 'white', outline: 'none', fontFamily: "'Manrope',sans-serif", color: 'var(--text)' }}
              >
                <option value="">Choisir une rÃ©gionâ€¦</option>
                {REGIONS.filter((r) => !regions.find((x) => x.value === r)).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button className="u-btn-search" onClick={addRegion}>
                <i className="fa-solid fa-plus" aria-hidden /> Ajouter
              </button>
            </div>
            {regions.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>Aucune rÃ©gion configurÃ©e</div>
            ) : (
              <div style={{ padding: '6px 0' }}>
                {regions.map((r) => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid var(--border)', gap: 10 }}>
                    <div
                      style={{ width: 32, height: 18, borderRadius: 9, background: r.active ? 'var(--green)' : 'var(--border)', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: '.2s' }}
                      onClick={() => toggleRule(r.id)}
                    >
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: r.active ? 17 : 3, transition: '.2s' }} />
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: r.active ? 'var(--text)' : 'var(--muted)' }}>
                      <i className="fa-solid fa-location-dot" style={{ marginRight: 5, color: 'var(--muted)' }} aria-hidden />{r.value}
                    </span>
                    <button onClick={() => deleteRule(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12, padding: 4 }}>
                      <i className="fa-solid fa-xmark" aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="u-search-panel" style={{ marginTop: 20 }}>
        <div className="u-search-header">
          <i className="fa-solid fa-bell" aria-hidden /> Canaux de notification
        </div>
        <div className="u-search-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', border: '1.5px solid var(--border)', borderRadius: 8, background: emailNotif ? '#F0FDF4' : 'var(--white)', borderColor: emailNotif ? '#BBF7D0' : 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: emailNotif ? '#DCFCE7' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-envelope" style={{ color: emailNotif ? 'var(--green)' : 'var(--muted)', fontSize: 16 }} aria-hidden />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Notifications par e-mail</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>RÃ©capitulatif selon la frÃ©quence configurÃ©e</div>
                </div>
              </div>
              <div
                style={{ width: 40, height: 22, borderRadius: 11, background: emailNotif ? 'var(--green)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: '.2s', flexShrink: 0 }}
                onClick={() => setEmailNotif((v) => !v)}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: emailNotif ? 21 : 3, transition: '.2s' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', border: '1.5px solid var(--border)', borderRadius: 8, background: browserNotif ? '#F0FDF4' : 'var(--white)', borderColor: browserNotif ? '#BBF7D0' : 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: browserNotif ? '#DCFCE7' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-bell" style={{ color: browserNotif ? 'var(--green)' : 'var(--muted)', fontSize: 16 }} aria-hidden />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Notifications navigateur</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Alertes push en temps rÃ©el</div>
                </div>
              </div>
              <div
                style={{ width: 40, height: 22, borderRadius: 11, background: browserNotif ? 'var(--green)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: '.2s', flexShrink: 0 }}
                onClick={() => setBrowserNotif((v) => !v)}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: browserNotif ? 21 : 3, transition: '.2s' }} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="u-btn-search">
              <i className="fa-solid fa-floppy-disk" aria-hidden /> Enregistrer les prÃ©fÃ©rences
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
