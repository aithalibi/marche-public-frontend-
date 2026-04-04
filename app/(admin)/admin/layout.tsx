import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-admin" className="page active">
      <AdminSidebar />
      <div className="a-main">
        <div className="a-topbar">
          <div className="a-topbar-title">
            <i className="fa-solid fa-gauge" aria-hidden />
            Vue d&apos;ensemble — Administration
          </div>
          <span className="admin-badge">
            <i className="fa-solid fa-shield-halved" aria-hidden />
            Admin
          </span>
          <div className="tb-icon" aria-hidden>
            <i className="fa-solid fa-bell" />
          </div>
          <div className="tb-icon" aria-hidden>
            <i className="fa-solid fa-gear" />
          </div>
        </div>
        <div className="a-content">{children}</div>
      </div>
    </div>
  )
}
