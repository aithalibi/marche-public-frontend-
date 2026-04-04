import UserTopbar from '@/components/layout/UserTopbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-user" className="page active">
      <UserTopbar />
      <div className="u-main">{children}</div>
      <div className="u-footer">
        <strong>VeilleMarché.ma</strong> — Système de veille des marchés publics &nbsp;|&nbsp; © 2026 Tous droits
        réservés &nbsp;|&nbsp;{' '}
        <a href="/login" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Support
        </a>
      </div>
    </div>
  )
}
