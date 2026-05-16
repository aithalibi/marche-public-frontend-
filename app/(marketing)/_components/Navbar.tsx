'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Accueil', icon: 'fa-house' },
  { href: '/login?callbackUrl=/recherche', label: "Appels d'offres", icon: 'fa-file-contract' },
  { href: '/login', label: 'Bons de commande', icon: 'fa-receipt' },
  { href: '/login', label: 'Secteurs', icon: 'fa-layer-group' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <i className="fa-solid fa-landmark" aria-hidden />
          </div>
          <div className="logo-text">
            VeilleMarché<span>.ma</span>
          </div>
        </Link>
        <div className="nav-links">
          {links.map(({ href, label, icon }) => (
            <Link
              key={label}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
            >
              <i className={`fa-solid ${icon}`} aria-hidden />
              {label}
            </Link>
          ))}
        </div>
        <Link href="/login" className="btn-login">
          <i className="fa-solid fa-right-to-bracket" aria-hidden />
          Connexion
        </Link>
        <Link href="/register" className="btn-register">
          <i className="fa-solid fa-user-plus" aria-hidden />
          Inscription
        </Link>
      </div>
    </nav>
  )
}
