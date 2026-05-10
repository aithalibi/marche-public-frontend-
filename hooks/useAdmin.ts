import useSWR from 'swr'
import {
  deleteAdminMarket,
  getAdminEmails,
  getAdminLogs,
  getAdminMarkets,
  getAdminSettings,
  getAdminStatistics,
  getComptes,
  getScrapingJobs,
  sendAdminTestEmail,
  triggerScraping,
  updateCompteRole,
} from '@/lib/api/admin'

export function useComptes() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/users', getComptes)

  async function setRole(id: string, role: 'USER' | 'ADMIN') {
    await updateCompteRole(id, role)
    await mutate()
  }

  return { comptes: data ?? [], isLoading, error, setRole }
}

export function useScrapingJobs() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/scraper/logs', getScrapingJobs, {
    refreshInterval: 10_000,
  })

  async function runScraping() {
    await triggerScraping()
    await mutate()
  }

  return { jobs: data ?? [], isLoading, error, refresh: mutate, runScraping }
}

export function useAdminMarkets() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/platform/markets', getAdminMarkets)

  async function removeMarket(id: string) {
    await deleteAdminMarket(id)
    await mutate()
  }

  return { data, markets: data?.marches ?? [], isLoading, error, removeMarket, refresh: mutate }
}

export function useAdminStatistics() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/platform/statistics', getAdminStatistics)
  return { stats: data, isLoading, error, refresh: mutate }
}

export function useAdminEmails() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/platform/emails', getAdminEmails)

  async function sendTest(to?: string) {
    const message = await sendAdminTestEmail(to)
    await mutate()
    return message
  }

  return { emails: data, isLoading, error, sendTest, refresh: mutate }
}

export function useAdminLogs() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/platform/logs', getAdminLogs, {
    refreshInterval: 10_000,
  })
  return { logs: data ?? [], isLoading, error, refresh: mutate }
}

export function useAdminSettings() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/platform/settings', getAdminSettings)
  return { settings: data, isLoading, error, refresh: mutate }
}
