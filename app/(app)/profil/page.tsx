'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { getProfil, updateProfil } from '@/lib/api/profil'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'
import { User, Settings } from 'lucide-react'

export default function ProfilPage() {
  const { data: user, isLoading, error, mutate } = useSWR('/api/profil', getProfil)
  const [form, setForm] = useState({ nom: '', prenom: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) setForm({ nom: user.nom, prenom: user.prenom })
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfil(form)
      await mutate()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>
  if (error) return <p className="text-center text-red-500">Erreur lors du chargement du profil.</p>

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-arch-lavender flex items-center justify-center">
            <User className="h-6 w-6 text-arch-violet" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.prenom} {user?.nom}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="prenom"
              label="Prénom"
              value={form.prenom}
              onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
              required
            />
            <Input
              id="nom"
              label="Nom"
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={saving} size="sm">
              {saved ? '✓ Enregistré' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Préférences de veille</h2>
          </div>
          <Link href="/profil/questionnaire">
            <Button variant="secondary" size="sm">Modifier</Button>
          </Link>
        </div>

        {user?.secteurs && user.secteurs.length > 0 ? (
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Secteurs :</span> {user.secteurs.join(', ')}</p>
            <p><span className="font-medium">Régions :</span> {user.regions?.join(', ') || '—'}</p>
            {user.budgetMin && (
              <p>
                <span className="font-medium">Budget :</span>{' '}
                {user.budgetMin.toLocaleString('fr-FR')} – {user.budgetMax?.toLocaleString('fr-FR')} MAD
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            <p className="text-sm">Aucune préférence configurée.</p>
            <Link href="/profil/questionnaire" className="text-arch-violet text-sm hover:underline">
              Compléter le questionnaire →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
