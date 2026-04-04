'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const nav = [
  {
    sec: 'Tableau de bord',
    items: [
      { href: '/admin', label: "Vue d'ensemble", icon: 'fa-gauge' },
    ],
  },
  {
    sec: 'Gestion',
    items: [
      { href: '/admin/scraping', label: 'Robots & Scraping', icon: 'fa-robot' },
      { href: '/admin', label: 'Base de données', icon: 'fa-database' },
      { href: '/admin/comptes', label: 'Utilisateurs', icon: 'fa-users', badge: '4' },
      { href: '/admin', label: 'Marchés', icon: 'fa-file-contract' },
      { href: '/admin', label: 'Secteurs', icon: 'fa-layer-group' },
    ],
  },
  {
    sec: 'Système',
    items: [
      { href: '/admin', label: 'Emails & Alertes', icon: 'fa-envelope-open-text' },
      { href: '/admin', label: 'Statistiques', icon: 'fa-chart-bar' },
      { href: '/admin', label: 'Paramètres', icon: 'fa-gear' },
      { href: '/admin', label: 'Logs système', icon: 'fa-terminal' },
    ],
  },
]

function navActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const prenom = session?.user?.prenom ?? 'Admin'
  const nom = session?.user?.nom ?? 'Système'

  return (
    <div className="sidebar">
      <div className="sb-top">
        <div className="sb-logo">
          <div className="sb-logo-ico">
            <i className="fa-solid fa-landmark" aria-hidden />
          </div>
          <div className="sb-logo-txt">
            VeilleMarché<span>.ma</span>
          </div>
        </div>
        <span className="sb-admin-tag">
          <i className="fa-solid fa-shield-halved" aria-hidden /> Administration
        </span>
      </div>

      <div className="sb-user">
        <div className="sb-av">
          <i className="fa-solid fa-user" aria-hidden />
        </div>
        <div>
          <div className="sb-uname">{prenom} {nom}</div>
          <div className="sb-urole">Super Admin</div>
        </div>
      </div>

      <div className="sb-nav">
        {nav.map((group) => (
          <div key={group.sec}>
            <div className="sb-sec">{group.sec}</div>
            {group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`sb-item${navActive(pathname, item.href) && item.href !== '/admin' ? ' active' : item.href === '/admin' && pathname === '/admin' ? ' active' : ''}`}
              >
                <i className={`fa-solid ${item.icon}`} aria-hidden />
                {item.label}
                {'badge' in item && item.badge && (
                  <span className="sb-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="sb-foot">
        <a>
          <i className="fa-solid fa-circle-question" aria-hidden />
          Documentation
        </a>
        <button type="button" onClick={() => void signOut({ callbackUrl: '/login' })}>
          <i className="fa-solid fa-right-from-bracket" aria-hidden />
          Déconnexion
        </button>
      </div>
    </div>
  )
}
