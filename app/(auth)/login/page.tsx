'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthTabBar } from '@/components/auth/AuthTabBar'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <>
      <AuthTabBar active="login" />
      <div id="loginForm">
        <div className="form-card">
          <h3>
            <i className="fa-solid fa-right-to-bracket" aria-hidden /> Bon retour
          </h3>
          <div className="sub">Connectez-vous pour accéder à votre espace de veille</div>
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
              <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
                <i className="fa-solid fa-circle-question" style={{ marginRight: 3 }} aria-hidden />
                Mot de passe oublié ?
              </span>
            </div>
            {error && (
              <p style={{ fontSize: 12, color: '#b91c1c', marginBottom: 12 }}>{error}</p>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              <i className="fa-solid fa-right-to-bracket" aria-hidden />
              {loading ? 'Connexion…' : 'Se connecter'}
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
