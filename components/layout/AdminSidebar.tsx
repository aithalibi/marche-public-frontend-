'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const nav = [
  {
    sec: 'Tableau de bord',
    items: [
      { href: '/admin', label: "Vue d'ensemble", icon: 'fa-gauge' },
      { href: '/admin/statistiques', label: 'Statistiques', icon: 'fa-chart-line' },
    ],
  },
  {
    sec: 'Gestion',
    items: [
      { href: '/admin/scraping', label: 'Robots & Scraping', icon: 'fa-robot' },
      { href: '/admin/comptes', label: 'Utilisateurs', icon: 'fa-users' },
      { href: '/admin/marches', label: 'Marchés', icon: 'fa-file-contract' },
      { href: '/admin/emails', label: 'Emails & Alertes', icon: 'fa-envelope' },
    ],
  },
  {
    sec: 'Système',
    items: [
      { href: '/admin/logs', label: 'Logs système', icon: 'fa-terminal' },
      { href: '/admin/parametres', label: 'Paramètres', icon: 'fa-gear' },
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
          <div className="sb-urole">Administrateur</div>
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
                className={`sb-item${navActive(pathname, item.href) ? ' active' : ''}`}
              >
                <i className={`fa-solid ${item.icon}`} aria-hidden />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="sb-foot">
        <Link href="/recherche">
          <i className="fa-solid fa-arrow-left" aria-hidden />
          Retour à l&apos;application
        </Link>
        <button type="button" onClick={() => void signOut({ callbackUrl: '/login' })}>
          <i className="fa-solid fa-right-from-bracket" aria-hidden />
          Déconnexion
        </button>
      </div>
    </div>
  )
}
