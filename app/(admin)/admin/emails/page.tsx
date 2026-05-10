'use client'

import { FormEvent, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { useAdminEmails } from '@/hooks/useAdmin'

export default function AdminEmailsPage() {
  const { emails, isLoading, error, sendTest } = useAdminEmails()
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setActionError('')
    setIsSending(true)

    try {
      const result = await sendTest(to || undefined)
      setMessage(result)
    } catch {
      setActionError("L'email de test n'a pas pu être envoyé. Vérifiez la configuration SMTP.")
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error || !emails) return <p className="text-red-500 text-center py-8">Erreur lors du chargement de la configuration email.</p>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Emails & Alertes</h1>
        <p className="text-sm text-gray-500">Contrôle de la configuration SMTP et des notifications envoyées.</p>
      </div>

      <div className="a-stats">
        <StatCard value={emails.configure ? 'OK' : 'Non'} label="SMTP configuré" sub={emails.host} icon="fa-envelope-circle-check" tone={emails.configure ? 'c3' : 'c4'} />
        <StatCard value={String(emails.port)} label="Port SMTP" sub="Connexion sortante" icon="fa-network-wired" tone="c1" />
        <StatCard value={String(emails.notificationsCreees)} label="Notifications" sub="Créées en base" icon="fa-bell" tone="c2" />
        <StatCard value={emails.username || '-'} label="Compte expéditeur" sub="Masqué par sécurité" icon="fa-user-shield" tone="c4" />
      </div>

      <div className="a-grid2">
        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-sliders" aria-hidden /> Configuration actuelle
            </div>
            <Badge variant={emails.configure ? 'green' : 'red'}>
              {emails.configure ? 'Active' : 'Incomplète'}
            </Badge>
          </div>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Serveur SMTP" value={emails.host} />
            <InfoRow label="Port" value={String(emails.port)} />
            <InfoRow label="Utilisateur" value={emails.username || 'Non configuré'} />
          </dl>
        </div>

        <div className="a-card">
          <div className="a-card-title">
            <div className="a-ct-left">
              <i className="fa-solid fa-paper-plane" aria-hidden /> Envoyer un email de test
            </div>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700" htmlFor="test-email">
              Adresse destinataire
            </label>
            <input
              id="test-email"
              type="email"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="exemple@gmail.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-700"
            />
            <button type="submit" className="a-card-action" disabled={isSending}>
              <i className={`fa-solid ${isSending ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} aria-hidden />
              {isSending ? 'Envoi...' : 'Envoyer le test'}
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
          {actionError && <p className="mt-3 text-sm text-red-600">{actionError}</p>}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  )
}

function StatCard({
  value,
  label,
  sub,
  icon,
  tone,
}: {
  value: string
  label: string
  sub: string
  icon: string
  tone: 'c1' | 'c2' | 'c3' | 'c4'
}) {
  return (
    <div className={`a-stat-card ${tone}`}>
      <div className="a-stat-ico-wrap">
        <div>
          <div className="a-stat-val">{value}</div>
          <div className="a-stat-lbl">{label}</div>
          <div className="a-stat-chg up">{sub}</div>
        </div>
        <div className={`a-stat-ico ${tone}`}>
          <i className={`fa-solid ${icon}`} aria-hidden />
        </div>
      </div>
    </div>
  )
}
