'use client'

import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from '@/lib/utils'

const TYPE_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  NOUVEAU_MARCHE: { label: 'Nouveau marché', icon: 'fa-file-circle-plus', color: 'var(--primary)', bg: '#EFF6FF' },
  CLOTURE: { label: 'Clôture imminente', icon: 'fa-hourglass-end', color: 'var(--amber)', bg: '#FFFBEB' },
  MODIFICATION: { label: 'Modification', icon: 'fa-pen-to-square', color: 'var(--teal)', bg: '#F0FDFA' },
}

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()

  return (
    <>
      <div className="u-page-header">
        <div className="u-page-title">
          <h2>
            <i className="fa-solid fa-bell" aria-hidden /> Notifications
            {unreadCount > 0 && (
              <span style={{ background: '#EF4444', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 9px', borderRadius: 12, marginLeft: 10 }}>
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </h2>
          <p>Alertes et mises à jour relatives à vos marchés surveillés</p>
        </div>
        {unreadCount > 0 && (
          <button className="u-btn-icon" onClick={markAllAsRead}>
            <i className="fa-solid fa-check-double" aria-hidden /> Tout marquer comme lu
          </button>
        )}
      </div>

      {isLoading && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 22, marginBottom: 8 }} aria-hidden />
          <div style={{ fontSize: 13 }}>Chargement des notifications…</div>
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="u-table-section">
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)' }}>
            <i className="fa-regular fa-bell" style={{ fontSize: 36, marginBottom: 12, display: 'block', opacity: 0.3 }} aria-hidden />
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Aucune notification</div>
            <div style={{ fontSize: 13 }}>Vous serez notifié dès qu'un marché correspond à vos alertes.</div>
          </div>
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="u-table-section">
          <div className="u-table-header">
            <div className="u-table-title">
              <i className="fa-solid fa-inbox" aria-hidden /> Toutes les notifications
            </div>
            <span className="u-result-count">{notifications.length} au total</span>
          </div>

          {notifications.map((n, idx) => {
            const cfg = TYPE_CONFIG[n.type] ?? { label: n.type, icon: 'fa-bell', color: 'var(--muted)', bg: 'var(--bg)' }
            return (
              <div
                key={n.id}
                onClick={() => !n.lu && markAsRead(n.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 20px',
                  borderBottom: idx < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                  background: n.lu ? 'var(--white)' : '#F8FBFF',
                  cursor: n.lu ? 'default' : 'pointer',
                  transition: 'background .15s',
                }}
              >
                {/* Icon */}
                <div style={{ width: 38, height: 38, borderRadius: 9, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <i className={`fa-solid ${cfg.icon}`} style={{ color: cfg.color, fontSize: 15 }} aria-hidden />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                      {cfg.label}
                    </span>
                    {!n.lu && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: n.lu ? 400 : 600 }}>
                    {n.message}
                  </div>
                  {n.offreTitre && (
                    <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <i className="fa-solid fa-file-contract" style={{ fontSize: 10 }} aria-hidden />
                      {n.offreTitre}
                    </div>
                  )}
                </div>

                {/* Time */}
                <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 }}>
                  <i className="fa-regular fa-clock" style={{ marginRight: 4 }} aria-hidden />
                  {formatDistanceToNow(n.createdAt)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
