'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitQuestionnaire } from '@/lib/api/profil'
import Button from '@/components/ui/Button'
import type { TypeMarche, QuestionnairePayload } from '@/types'

const SECTEURS = [
  'BTP', 'Informatique & SI', 'Santé', 'Éducation', 'Transport & Logistique',
  'Énergie', 'Agriculture', 'Eau & Assainissement', 'Télécommunications', 'Sécurité',
]

const REGIONS = [
  'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès',
  'Tanger-Tétouan-Al Hoceima', 'Souss-Massa', 'Béni Mellal-Khénifra', 'Toutes',
]

const TYPES: { value: TypeMarche; label: string }[] = [
  { value: 'TRAVAUX', label: 'Travaux' },
  { value: 'FOURNITURES', label: 'Fournitures' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'CONCESSION', label: 'Concession' },
]

function MultiSelect({
  label, options, selected, onToggle,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              selected.includes(opt)
                ? 'border-arch-violet bg-arch-lavender text-arch-violet-dark font-medium'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function QuestionnairePage() {
  const router = useRouter()
  const [secteurs, setSecteurs] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [types, setTypes] = useState<TypeMarche[]>([])
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function toggle<T extends string>(arr: T[], setArr: (v: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (secteurs.length === 0) return setError('Sélectionnez au moins un secteur.')
    setError('')
    setSaving(true)
    try {
      const payload: QuestionnairePayload = {
        secteurs,
        regions,
        typesMarcheInteresse: types,
        ...(budgetMin && { budgetMin: Number(budgetMin) }),
        ...(budgetMax && { budgetMax: Number(budgetMax) }),
      }
      await submitQuestionnaire(payload)
      router.push('/recherche')
    } catch {
      setError('Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Configurez votre veille</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ces informations permettent de vous alerter sur les marchés pertinents.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiSelect
            label="Secteurs d'activité *"
            options={SECTEURS}
            selected={secteurs}
            onToggle={(v) => toggle(secteurs, setSecteurs, v)}
          />

          <MultiSelect
            label="Régions cibles"
            options={REGIONS}
            selected={regions}
            onToggle={(v) => toggle(regions, setRegions, v)}
          />

          <MultiSelect
            label="Types de marchés"
            options={TYPES.map((t) => t.value)}
            selected={types}
            onToggle={(v) => toggle(types, setTypes, v as TypeMarche)}
          />

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Budget estimé (MAD)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Minimum"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-arch-violet"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Maximum"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-arch-violet"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" loading={saving} size="lg" className="w-full">
            Enregistrer mes préférences
          </Button>
        </form>
      </div>
    </div>
  )
}
