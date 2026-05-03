import useSWR from 'swr'
import { getComptes, getScrapingJobs, triggerScraping, updateCompteRole } from '@/lib/api/admin'

export function useComptes() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/users', getComptes)

  async function setRole(id: string, role: 'USER' | 'ADMIN') {
    await updateCompteRole(id, role)
    mutate()
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
