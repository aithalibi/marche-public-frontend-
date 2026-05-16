'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, User, Shield, Settings } from 'lucide-react'

export default function PageNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const getActivePage = () => {
    if (pathname === '/' || pathname.startsWith('/offres') || pathname.startsWith('/recherche')) {
      return 'accueil'
    }
    if (pathname.startsWith('/app') || pathname.startsWith('/profil') || pathname.startsWith('/notifications') || pathname.startsWith('/suivi')) {
      return 'user'
    }
    if (pathname.startsWith('/admin')) {
      return 'admin'
    }
    if (pathname.startsWith('/auth') || pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return 'auth'
    }
    return 'accueil'
  }

  const activePage = getActivePage()

  const pages = [
    { id: 'accueil', label: 'Accueil', icon: Home, path: '/' },
    { id: 'user', label: 'Utilisateur', icon: User, path: '/app' },
    { id: 'admin', label: 'Admin', icon: Shield, path: '/admin' },
    { id: 'auth', label: 'Auth', icon: Settings, path: '/auth' },
  ]

  const handlePageChange = (path: string) => {
    router.push(path)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {pages.map((page) => {
        const Icon = page.icon
        return (
          <button
            key={page.id}
            onClick={() => handlePageChange(page.path)}
            className={`bg-[#1A4F8B] text-white border-none border-radius-8px px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-2 shadow-lg transition hover:bg-[#0f3360] ${
              activePage === page.id ? 'bg-[#0D7490]' : ''
            }`}
          >
            <Icon size={10} />
            {page.label}
          </button>
        )
      })}
    </div>
  )
}