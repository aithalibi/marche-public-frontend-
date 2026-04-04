import api from '@/lib/axios'
import type { Notification } from '@/types'

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>('/api/notifications')
  return data
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/api/notifications/${id}/lu`)
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/api/notifications/lu-tout')
}
