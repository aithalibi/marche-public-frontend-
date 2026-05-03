'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { AuthTabBar } from '@/components/auth/AuthTabBar'
import { register } from '@/lib/api/auth'

type Step = 1 | 2 | 3

const sectors = [
  { icon: 'fa-laptop-code', name: 'Informatique & IT' },
  { icon: 'fa-hard-hat', name: 'BTP & Travaux' },
  { icon: 'fa-stethoscope', name: 'SantÃ©' },
  { icon: 'fa-graduation-cap', name: 'Ã‰ducation' },
  { icon: 'fa-bolt', name: 'Ã‰nergie' },
  { icon: 'fa-truck', name: 'Transport' },
  { icon: 'fa-shield-halved', name: 'SÃ©curitÃ©' },
  { icon: 'fa-tower-broadcast', name: 'TÃ©lÃ©coms' },
  { icon: 'fa-utensils', name: 'Restauration' },
]

const notifOpts = [
  { icon: 'fa-bolt', title: 'Notification immÃ©diate', desc: 'Email envoyÃ© dÃ¨s la dÃ©tection d\'un marchÃ© correspondant' },
  { icon: 'fa-sun', title: 'RÃ©sumÃ© quotidien', desc: 'Un email chaque matin Ã  8h00 avec toutes les correspondances' },
  { icon: 'fa-calendar-week', title: 'RÃ©sumÃ© hebdomadaire', desc: 'Un email chaque lundi avec les marchÃ©s de la semaine' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    entreprise: '', profil: '', password: '', confirm: '',
  })
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [region, setRegion] = useState('')
  const [notif, setNotif] = useState(0)

  function setField(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  function toggleSector(name: string) {
    setSelectedSectors((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    )
  }

  function goStep(n: Step) {
    setStep(n)
    window.scrollTo(0, 0)
  }

  async function handleFinish() {
    setError('')
    setLoading(true)
    try {
      await register({ nom: form.nom, prenom: form.prenom, email: form.email, password: form.password })
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (result?.error) throw new Error()
      setShowSuccess(true)
    } catch {
      setError('Une erreur est survenue. VÃ©rifiez vos informations.')
    } finally {
      setLoading(false)
    }
  }

  function StepDot({ n }: { n: number }) {
    const done = step > n
    const active = step === n
    return (
      <div className={`sdot${done ? ' done' : active ? ' active' : ''}`}>
        {done ? <i className="fa-solid fa-check" style={{ fontSize: 10 }} aria-hidden /> : n}
      </div>
    )
  }

  if (showSuccess) {
    return (
      <>
        <AuthTabBar active="register" />
        <div className="success-card" style={{ display: 'block' }}>
          <div className="success-ico">
            <i className="fa-solid fa-circle-check" aria-hidden />
          </div>
          <h3>Compte crÃ©Ã© avec succÃ¨s !</h3>
          <p>Un email de confirmation vous a Ã©tÃ© envoyÃ©. Votre profil de veille est actif.</p>
          <button className="btn-primary" style={{ maxWidth: 300, margin: '0 auto' }} onClick={() => router.push('/recherche')}>
            <i className="fa-solid fa-gauge" aria-hidden />
            AccÃ©der Ã  mon tableau de bord
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <AuthTabBar active="register" />
      <div id="registerForm">
        <div className="step-indicator">
          <StepDot n={1} />
          <div className={`sline${step > 1 ? ' done' : ''}`} />
          <StepDot n={2} />
          <div className={`sline${step > 2 ? ' done' : ''}`} />
          <StepDot n={3} />
        </div>
        <div className="step-labels">
          <span className={`slabel${step === 1 ? ' active' : ''}`}>Compte</span>
          <span className={`slabel${step === 2 ? ' active' : ''}`}>Domaine</span>
          <span className={`slabel${step === 3 ? ' active' : ''}`}>Alertes</span>
        </div>

        {step === 1 && (
          <div className="form-step" id="step1">
            <div className="form-card">
              <h3><i className="fa-solid fa-user-pen" aria-hidden /> CrÃ©ez votre compte</h3>
              <div className="sub">Quelques informations pour commencer</div>

              <div className="form-row">
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-user" aria-hidden /> PrÃ©nom <span className="req">*</span></label>
                  <input className="fi" placeholder="PrÃ©nom" value={form.prenom} onChange={setField('prenom')} />
                </div>
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-user" aria-hidden /> Nom <span className="req">*</span></label>
                  <input className="fi" placeholder="Nom" value={form.nom} onChange={setField('nom')} />
                </div>
              </div>

              <div className="fg" style={{ marginTop: 12 }}>
                <label><i className="fa-solid fa-envelope" aria-hidden /> Email professionnel <span className="req">*</span></label>
                <input className="fi" type="email" placeholder="vous@entreprise.ma" value={form.email} onChange={setField('email')} />
              </div>

              <div className="fg">
                <label><i className="fa-solid fa-phone" aria-hidden /> TÃ©lÃ©phone</label>
                <input className="fi" type="tel" placeholder="+212 6XX XXX XXX" value={form.telephone} onChange={setField('telephone')} />
              </div>

              <div className="fg">
                <label><i className="fa-solid fa-building" aria-hidden /> Entreprise <span className="req">*</span></label>
                <input className="fi" placeholder="Nom de votre sociÃ©tÃ©" value={form.entreprise} onChange={setField('entreprise')} />
              </div>

              <div className="fg">
                <label><i className="fa-solid fa-id-badge" aria-hidden /> Vous Ãªtes... <span className="req">*</span></label>
                <select className="fi" value={form.profil} onChange={setField('profil')}>
                  <option value="">SÃ©lectionner votre profil</option>
                  <option>PME / TPE</option>
                  <option>Grande entreprise</option>
                  <option>Bureau d&apos;Ã©tudes</option>
                  <option>Consultant indÃ©pendant</option>
                </select>
              </div>

              <div className="form-row">
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-lock" aria-hidden /> Mot de passe <span className="req">*</span></label>
                  <input className="fi" type="password" placeholder="Min. 8 caractÃ¨res" value={form.password} onChange={setField('password')} />
                </div>
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-lock" aria-hidden /> Confirmer <span className="req">*</span></label>
                  <input className="fi" type="password" placeholder="RÃ©pÃ©ter" value={form.confirm} onChange={setField('confirm')} />
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={() => goStep(2)}>
              <i className="fa-solid fa-arrow-right" aria-hidden />
              Continuer : Mon domaine
            </button>
            <p className="helper">DÃ©jÃ  un compte ? <Link href="/login">Se connecter</Link></p>
          </div>
        )}

        {step === 2 && (
          <div className="form-step" id="step2">
            <div className="form-card">
              <h3><i className="fa-solid fa-sliders" aria-hidden /> Votre domaine d&apos;activitÃ©</h3>
              <div className="sub">Ces informations personnalisent les marchÃ©s que vous recevrez</div>

              <div className="fg">
                <label><i className="fa-solid fa-layer-group" aria-hidden /> Secteurs d&apos;activitÃ© <span className="req">*</span></label>
                <div className="sectors-grid">
                  {sectors.map((s) => (
                    <div
                      key={s.name}
                      className={`sopt${selectedSectors.includes(s.name) ? ' selected' : ''}`}
                      onClick={() => toggleSector(s.name)}
                    >
                      <div className="sopt-ico"><i className={`fa-solid ${s.icon}`} aria-hidden /></div>
                      <div className="sopt-name">{s.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fg" style={{ marginTop: 14 }}>
                <label><i className="fa-solid fa-map-pin" aria-hidden /> Localisation cible <span className="req">*</span></label>
                <select className="fi" value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">Toutes les rÃ©gions</option>
                  <option>Casablanca-Settat</option>
                  <option>Rabat-SalÃ©-KÃ©nitra</option>
                  <option>Souss-Massa</option>
                  <option>Marrakech-Safi</option>
                </select>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn-back" onClick={() => goStep(1)}>
                <i className="fa-solid fa-arrow-left" aria-hidden />
              </button>
              <button className="btn-primary" onClick={() => goStep(3)}>
                <i className="fa-solid fa-arrow-right" aria-hidden />
                Continuer : Mes alertes
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step" id="step3">
            <div className="form-card">
              <h3><i className="fa-solid fa-bell" aria-hidden /> PrÃ©fÃ©rences d&apos;alertes</h3>
              <div className="sub">Comment souhaitez-vous Ãªtre notifiÃ© des nouveaux marchÃ©s ?</div>

              <div className="fg">
                <label><i className="fa-solid fa-clock" aria-hidden /> FrÃ©quence de notification <span className="req">*</span></label>
                <div className="notif-opts">
                  {notifOpts.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`nopt${notif === idx ? ' selected' : ''}`}
                      onClick={() => setNotif(idx)}
                    >
                      <div className="nopt-ico"><i className={`fa-solid ${opt.icon}`} aria-hidden /></div>
                      <div style={{ flex: 1 }}>
                        <h4>{opt.title}</h4>
                        <p>{opt.desc}</p>
                      </div>
                      <div className="check">
                        {notif === idx && <i className="fa-solid fa-check" style={{ fontSize: 9 }} aria-hidden />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 9, padding: 13, marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--green)', marginTop: 1 }} aria-hidden />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>Votre profil est prÃªt</div>
                  <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>Le robot commencera Ã  surveiller les marchÃ©s dÃ¨s votre inscription.</div>
                </div>
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: '#b91c1c', marginBottom: 12 }}>{error}</p>}

            <div className="btn-row">
              <button className="btn-back" onClick={() => goStep(2)}>
                <i className="fa-solid fa-arrow-left" aria-hidden />
              </button>
              <button className="btn-primary" onClick={handleFinish} disabled={loading}>
                <i className="fa-solid fa-rocket" aria-hidden />
                {loading ? 'CrÃ©ationâ€¦' : 'CrÃ©er mon compte et commencer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
