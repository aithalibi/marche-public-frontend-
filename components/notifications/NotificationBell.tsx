'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from '@/lib/utils'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-sm text-gray-800">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-arch-violet hover:underline"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-400">
                Aucune notification
              </li>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.lu && markAsRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !n.lu ? 'bg-arch-lavender/70' : ''
                  }`}
                >
                  <p className="text-sm text-gray-800 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(n.createdAt)}
                  </p>
                </li>
              ))
            )}
          </ul>

          <div className="px-4 py-2 border-t border-gray-100 text-center">
            <a href="/notifications" className="text-xs text-arch-violet hover:underline">
              Voir toutes les notifications
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
