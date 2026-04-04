import useSWR from 'swr'
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/api/notifications'

export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR('/api/notifications', getNotifications, {
    refreshInterval: 30_000, // poll every 30 seconds
  })

  const unreadCount = data?.filter((n) => !n.lu).length ?? 0

  async function handleMarkAsRead(id: string) {
    await markAsRead(id)
    mutate()
  }

  async function handleMarkAllAsRead() {
    await markAllAsRead()
    mutate()
  }

  return {
    notifications: data ?? [],
    unreadCount,
    isLoading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  }
}
