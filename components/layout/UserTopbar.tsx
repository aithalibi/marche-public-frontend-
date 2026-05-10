'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useNotifications } from '@/hooks/useNotifications'

function initials(prenom?: string, nom?: string) {
  const a = (prenom?.[0] ?? '').toUpperCase()
  const b = (nom?.[0] ?? '').toUpperCase()
  return (a + b) || 'U'
}

export default function UserTopbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { unreadCount } = useNotifications()
  const user = session?.user
  const isAdmin = user?.role === 'ADMIN'

  const dateStr = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="u-topbar">
      <div className="u-topbar-left">
        <Link href="/recherche" className="u-logo">
          <div className="u-logo-ico">
            <i className="fa-solid fa-landmark" aria-hidden />
          </div>
          <div className="u-logo-txt">
            VeilleMarché<span>.ma</span>
          </div>
        </Link>
        <div className="u-nav">
          <Link
            href="/recherche"
            className={`u-nav-link${pathname === '/recherche' ? ' active' : ''}`}
          >
            <i className="fa-solid fa-gauge" aria-hidden />
            Vue d&apos;ensemble
          </Link>
          <Link
            href="/marches"
            className={`u-nav-link${pathname.startsWith('/marches') || pathname.startsWith('/correspondances') ? ' active' : ''}`}
          >
            <i className="fa-solid fa-list-check" aria-hidden />
            Tous les marchés
          </Link>
          <Link
            href="/suivi"
            className={`u-nav-link${pathname.startsWith('/suivi') ? ' active' : ''}`}
          >
            <i className="fa-solid fa-bookmark" aria-hidden />
            Suivis
          </Link>
          <Link
            href="/notifications"
            className={`u-nav-link${pathname.startsWith('/notifications') ? ' active' : ''}`}
          >
            <i className="fa-solid fa-bell" aria-hidden />
            Notifications
            {unreadCount > 0 && (
              <span className="u-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </Link>
          <Link
            href="/alertes"
            className={`u-nav-link${pathname.startsWith('/alertes') ? ' active' : ''}`}
          >
            <i className="fa-solid fa-sliders" aria-hidden />
            Mes alertes
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`u-nav-link${pathname.startsWith('/admin') ? ' active' : ''}`}
            >
              <i className="fa-solid fa-shield-halved" aria-hidden />
              Admin
            </Link>
          )}
        </div>
      </div>
      <div className="u-topbar-right">
        <div className="u-date">
          <i className="fa-regular fa-calendar" style={{ marginRight: 5 }} aria-hidden />
          {dateStr}
        </div>
        <button
          type="button"
          className="u-avatar-btn"
          onClick={() => signOut({ callbackUrl: '/login' })}
          title="Déconnexion"
        >
          <div className="u-avatar">{initials(user?.prenom, user?.nom)}</div>
          <div>
            <div className="u-username">
              {user?.prenom} {user?.nom}
            </div>
            <div className="u-role">{user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur actif'}</div>
          </div>
          <i
            className="fa-solid fa-chevron-down"
            style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}
