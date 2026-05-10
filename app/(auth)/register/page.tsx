'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { AuthTabBar } from '@/components/auth/AuthTabBar'
import { register } from '@/lib/api/auth'
import { submitQuestionnaire } from '@/lib/api/profil'

type Step = 1 | 2 | 3

const sectors = [
  { icon: 'fa-laptop-code', name: 'Informatique et IT' },
  { icon: 'fa-hard-hat', name: 'BTP et travaux publics' },
  { icon: 'fa-stethoscope', name: 'Santé' },
  { icon: 'fa-graduation-cap', name: 'Éducation' },
  { icon: 'fa-bolt', name: 'Énergie' },
  { icon: 'fa-truck', name: 'Transport' },
  { icon: 'fa-shield-halved', name: 'Sécurité' },
  { icon: 'fa-tower-broadcast', name: 'Télécoms' },
  { icon: 'fa-utensils', name: 'Restauration' },
]

const notifOpts = [
  {
    icon: 'fa-bolt',
    title: 'Notification immédiate',
    desc: "Recevez un email dès qu'un marché correspond à vos critères.",
  },
  {
    icon: 'fa-sun',
    title: 'Résumé quotidien',
    desc: 'Recevez chaque matin un récapitulatif des nouvelles correspondances.',
  },
  {
    icon: 'fa-calendar-week',
    title: 'Résumé hebdomadaire',
    desc: 'Recevez chaque lundi les marchés importants de la semaine.',
  },
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
      await submitQuestionnaire({
        secteurs: selectedSectors,
        regions: region ? [region] : [],
        typesMarcheInteresse: [],
      })
      setShowSuccess(true)
    } catch {
      setError('Une erreur est survenue. Vérifiez vos informations.')
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
          <h3>Compte créé avec succès</h3>
          <p>Un email de confirmation vous a été envoyé. Votre profil de veille est maintenant actif.</p>
          <button className="btn-primary" style={{ maxWidth: 300, margin: '0 auto' }} onClick={() => router.push('/recherche')}>
            <i className="fa-solid fa-gauge" aria-hidden />
            Accéder à mon tableau de bord
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
              <h3><i className="fa-solid fa-user-pen" aria-hidden /> Créez votre compte</h3>
              <div className="sub">Renseignez vos informations pour commencer.</div>

              <div className="form-row">
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-user" aria-hidden /> Prénom <span className="req">*</span></label>
                  <input className="fi" placeholder="Prénom" value={form.prenom} onChange={setField('prenom')} />
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
                <label><i className="fa-solid fa-phone" aria-hidden /> Téléphone</label>
                <input className="fi" type="tel" placeholder="+212 6XX XXX XXX" value={form.telephone} onChange={setField('telephone')} />
              </div>

              <div className="fg">
                <label><i className="fa-solid fa-building" aria-hidden /> Entreprise <span className="req">*</span></label>
                <input className="fi" placeholder="Nom de votre société" value={form.entreprise} onChange={setField('entreprise')} />
              </div>

              <div className="fg">
                <label><i className="fa-solid fa-id-badge" aria-hidden /> Votre profil <span className="req">*</span></label>
                <select className="fi" value={form.profil} onChange={setField('profil')}>
                  <option value="">Sélectionnez votre profil</option>
                  <option>PME / TPE</option>
                  <option>Grande entreprise</option>
                  <option>Bureau d&apos;études</option>
                  <option>Consultant indépendant</option>
                </select>
              </div>

              <div className="form-row">
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-lock" aria-hidden /> Mot de passe <span className="req">*</span></label>
                  <input className="fi" type="password" placeholder="Minimum 8 caractères" value={form.password} onChange={setField('password')} />
                </div>
                <div className="fg" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-lock" aria-hidden /> Confirmation <span className="req">*</span></label>
                  <input className="fi" type="password" placeholder="Répétez le mot de passe" value={form.confirm} onChange={setField('confirm')} />
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={() => goStep(2)}>
              <i className="fa-solid fa-arrow-right" aria-hidden />
              Continuer vers mon domaine
            </button>
            <p className="helper">Déjà un compte ? <Link href="/login">Se connecter</Link></p>
          </div>
        )}

        {step === 2 && (
          <div className="form-step" id="step2">
            <div className="form-card">
              <h3><i className="fa-solid fa-sliders" aria-hidden /> Votre domaine d&apos;activité</h3>
              <div className="sub">Ces informations permettent de personnaliser les marchés que vous recevrez.</div>

              <div className="fg">
                <label><i className="fa-solid fa-layer-group" aria-hidden /> Secteurs d&apos;activité <span className="req">*</span></label>
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
                <label><i className="fa-solid fa-map-pin" aria-hidden /> Région cible <span className="req">*</span></label>
                <select className="fi" value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">Toutes les régions</option>
                  <option>Casablanca-Settat</option>
                  <option>Rabat-Salé-Kénitra</option>
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
                Continuer vers mes alertes
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step" id="step3">
            <div className="form-card">
              <h3><i className="fa-solid fa-bell" aria-hidden /> Préférences d&apos;alertes</h3>
              <div className="sub">Choisissez comment recevoir les nouveaux marchés qui correspondent à votre profil.</div>

              <div className="fg">
                <label><i className="fa-solid fa-clock" aria-hidden /> Fréquence de notification <span className="req">*</span></label>
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
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>Votre profil est prêt</div>
                  <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>La surveillance des marchés commencera dès votre inscription.</div>
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
                {loading ? 'Création...' : 'Créer mon compte et commencer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
