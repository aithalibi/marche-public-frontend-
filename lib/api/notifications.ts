import api from '@/lib/axios'
import type { BackendNotification, Notification, NotificationType } from '@/types'

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get<BackendNotification[]>('/api/notifications')
  return data.map(mapBackendNotification)
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/api/notifications/${id}/lire`)
}

export async function markAllAsRead(): Promise<void> {
  const notifications = await getNotifications()
  const unread = notifications.filter((notification) => !notification.lu)

  await Promise.all(unread.map((notification) => markAsRead(notification.id)))
}

function mapBackendNotification(notification: BackendNotification): Notification {
  return {
    id: notification.id,
    type: inferNotificationType(notification),
    message: notification.message,
    offreId: notification.offreId,
    offreTitre: notification.titre ?? notification.referenceOffre,
    lu: notification.lue,
    createdAt: notification.dateCreation,
  }
}

function inferNotificationType(notification: BackendNotification): NotificationType {
  const haystack = `${notification.titre ?? ''} ${notification.message}`.toUpperCase()

  if (haystack.includes('MODIFICATION')) {
    return 'MODIFICATION'
  }
  if (
    haystack.includes('CLOTURE') ||
    haystack.includes('CLÔTURE') ||
    haystack.includes('DATE LIMITE') ||
    haystack.includes('ECHEANCE') ||
    haystack.includes('ÉCHÉANCE')
  ) {
    return 'CLOTURE'
  }

  return 'NOUVEAU_MARCHE'
}
