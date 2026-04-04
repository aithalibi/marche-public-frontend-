import Link from 'next/link'

export function AuthTabBar({ active }: { active: 'login' | 'register' }) {
  return (
    <div className="tabs">
      <Link href="/login" className={`tab${active === 'login' ? ' active' : ''}`}>
        <i className="fa-solid fa-right-to-bracket" aria-hidden />
        Se connecter
      </Link>
      <Link href="/register" className={`tab${active === 'register' ? ' active' : ''}`}>
        <i className="fa-solid fa-user-plus" aria-hidden />
        Créer un compte
      </Link>
    </div>
  )
}
