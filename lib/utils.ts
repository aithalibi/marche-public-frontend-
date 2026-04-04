/** Format an ISO date string as "il y a X" */
export function formatDistanceToNow(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.floor(hours / 24)
  return `il y a ${days} j`
}

/** Format an ISO date to dd/MM/yyyy */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('fr-FR')
}

/** Format a number as currency (MAD) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(amount)
}
