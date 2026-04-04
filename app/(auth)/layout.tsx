import AuthMarketingPanel from '@/components/auth/AuthMarketingPanel'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-auth" className="page active">
      <AuthMarketingPanel />
      <div className="auth-right">
        <div className="auth-box">{children}</div>
      </div>
    </div>
  )
}
