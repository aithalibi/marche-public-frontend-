'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Search, Bell, Bookmark, User, LogOut, ShieldCheck } from 'lucide-react'
import NotificationBell from '@/components/notifications/NotificationBell'
import clsx from 'clsx'

const navLinks = [
  { href: '/recherche', label: 'Recherche', icon: Search },
  { href: '/suivi', label: 'Suivi', icon: Bookmark },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profil', label: 'Profil', icon: User },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-arch-violet/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/recherche" className="flex items-center gap-2 font-bold text-arch-violet-dark text-lg">
          <span className="text-xl">🏛️</span>
          <span className="hidden sm:block">MarchésPublics</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-arch-lavender text-arch-violet-dark'
                  : 'text-gray-600 hover:text-arch-violet-dark hover:bg-arch-lavender/50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:block">{label}</span>
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith('/admin')
                  ? 'bg-arch-lavender text-arch-violet-dark'
                  : 'text-gray-600 hover:text-arch-violet-dark hover:bg-arch-lavender/50'
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:block">Admin</span>
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
