'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthTabBar } from '@/components/auth/AuthTabBar'
import { confirmPasswordReset, requestPasswordReset, verifyPasswordResetCode } from '@/lib/api/auth'

type ResetStep = 'email' | 'code' | 'password'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetStep, setResetStep] = useState<ResetStep>('email')
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Email ou mot de passe incorrect.')
    } else {
      router.push('/recherche')
    }
  }

  function openReset() {
    setResetOpen(true)
    setResetStep('email')
    setResetEmail(email)
    setResetCode('')
    setNewPassword('')
    setConfirmPassword('')
    setResetError('')
    setResetMessage('')
  }

  async function handleRequestReset() {
    setResetError('')
    setResetMessage('')
    setResetLoading(true)
    try {
      await requestPasswordReset(resetEmail)
      setResetMessage('Si ce compte existe, un code de récupération vient d’être envoyé par email.')
      setResetStep('code')
    } catch {
      setResetError('Impossible d’envoyer le code. Vérifiez l’adresse email.')
    } finally {
      setResetLoading(false)
    }
  }

  async function handleVerifyCode() {
    setResetError('')
    setResetMessage('')
    setResetLoading(true)
    try {
      await verifyPasswordResetCode(resetEmail, resetCode)
      setResetMessage('Code validé. Choisissez maintenant un nouveau mot de passe.')
      setResetStep('password')
    } catch {
      setResetError('Code invalide ou expiré.')
    } finally {
      setResetLoading(false)
    }
  }

  async function handleConfirmReset() {
    setResetError('')
    setResetMessage('')

    if (newPassword !== confirmPassword) {
      setResetError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setResetLoading(true)
    try {
      await confirmPasswordReset(resetEmail, resetCode, newPassword)
      setResetMessage('Votre mot de passe a été mis à jour. Vous pouvez vous connecter.')
      setPassword('')
      setEmail(resetEmail)
      setResetOpen(false)
    } catch {
      setResetError('Impossible de modifier le mot de passe. Demandez un nouveau code.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <>
      <AuthTabBar active="login" />
      <div id="loginForm">
        <div className="form-card">
          <h3>
            <i className="fa-solid fa-right-to-bracket" aria-hidden /> Bon retour
          </h3>
          <div className="sub">Connectez-vous pour accéder à votre espace de veille.</div>
          <form onSubmit={handleSubmit}>
            <div className="fg">
              <label>
                <i className="fa-solid fa-envelope" aria-hidden /> Adresse email <span className="req">*</span>
              </label>
              <input
                className="fi"
                type="email"
                placeholder="vous@entreprise.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="fg">
              <label>
                <i className="fa-solid fa-lock" aria-hidden /> Mot de passe <span className="req">*</span>
              </label>
              <input
                className="fi"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div style={{ textAlign: 'right', marginBottom: 18 }}>
              <button
                type="button"
                onClick={openReset}
                style={{ border: 0, background: 'transparent', fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-circle-question" style={{ marginRight: 3 }} aria-hidden />
                Mot de passe oublié ?
              </button>
            </div>
            {error && (
              <p style={{ fontSize: 12, color: '#b91c1c', marginBottom: 12 }}>{error}</p>
            )}
            {resetMessage && !resetOpen && (
              <p style={{ fontSize: 12, color: '#166534', marginBottom: 12 }}>{resetMessage}</p>
            )}
            {resetOpen && (
              <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                  Récupération du mot de passe
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                  {resetStep === 'email' && 'Saisissez votre email pour recevoir un code de vérification.'}
                  {resetStep === 'code' && 'Entrez le code reçu par email.'}
                  {resetStep === 'password' && 'Définissez votre nouveau mot de passe.'}
                </p>

                {resetStep === 'email' && (
                  <div className="fg">
                    <label>Email du compte</label>
                    <input
                      className="fi"
                      type="email"
                      placeholder="vous@entreprise.ma"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                )}

                {resetStep !== 'email' && (
                  <div className="fg">
                    <label>Code de vérification</label>
                    <input
                      className="fi"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>
                )}

                {resetStep === 'password' && (
                  <>
                    <div className="fg">
                      <label>Nouveau mot de passe</label>
                      <input
                        className="fi"
                        type="password"
                        placeholder="Minimum 8 caractères"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="fg">
                      <label>Confirmer le mot de passe</label>
                      <input
                        className="fi"
                        type="password"
                        placeholder="Répétez le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {resetError && <p style={{ fontSize: 12, color: '#b91c1c', marginBottom: 12 }}>{resetError}</p>}
                {resetMessage && <p style={{ fontSize: 12, color: '#166534', marginBottom: 12 }}>{resetMessage}</p>}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="btn-google"
                    onClick={() => setResetOpen(false)}
                    style={{ flex: 1, margin: 0 }}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={resetLoading}
                    onClick={
                      resetStep === 'email'
                        ? handleRequestReset
                        : resetStep === 'code'
                          ? handleVerifyCode
                          : handleConfirmReset
                    }
                    style={{ flex: 1, margin: 0 }}
                  >
                    {resetLoading && 'Traitement...'}
                    {!resetLoading && resetStep === 'email' && 'Envoyer le code'}
                    {!resetLoading && resetStep === 'code' && 'Valider le code'}
                    {!resetLoading && resetStep === 'password' && 'Changer le mot de passe'}
                  </button>
                </div>
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              <i className="fa-solid fa-right-to-bracket" aria-hidden />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <div className="divider">
              <span>ou</span>
            </div>
            <button type="button" className="btn-google">
              <i className="fa-brands fa-google" aria-hidden />
              Continuer avec Google
            </button>
          </form>
        </div>
        <p className="helper">
          Pas encore de compte ?{' '}
          <Link href="/register">Créer un compte gratuit</Link>
        </p>
      </div>
    </>
  )
}
