import Badge from '@/components/ui/Badge'
import type { StatutOffre, SuiviStatus } from '@/types'

const statutConfig: Record<StatutOffre, { label: string; variant: 'green' | 'red' | 'gray' | 'yellow' }> = {
  OUVERT: { label: 'Ouvert', variant: 'green' },
  CLOS: { label: 'Clos', variant: 'red' },
  ATTRIBUE: { label: 'Attribué', variant: 'gray' },
  ANNULE: { label: 'Annulé', variant: 'yellow' },
}

const suiviConfig: Record<SuiviStatus, { variant: 'indigo' | 'blue' | 'gray' }> = {
  'Intéressant': { variant: 'indigo' },
  'En analyse': { variant: 'blue' },
  'Archivé': { variant: 'gray' },
}

export function StatutBadge({ statut }: { statut: StatutOffre }) {
  const config = statutConfig[statut] ?? { label: statut, variant: 'gray' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function SuiviBadge({ status }: { status: SuiviStatus }) {
  const config = suiviConfig[status]
  return <Badge variant={config.variant}>{status}</Badge>
}
