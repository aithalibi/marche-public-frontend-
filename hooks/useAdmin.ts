import useSWR from 'swr'
import { getComptes, getScrapingJobs, triggerScraping, toggleCompteActif, deleteCompte } from '@/lib/api/admin'

export function useComptes() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/comptes', getComptes)

  async function toggle(id: string, actif: boolean) {
    await toggleCompteActif(id, actif)
    mutate()
  }

  async function remove(id: string) {
    await deleteCompte(id)
    mutate()
  }

  return { comptes: data ?? [], isLoading, error, toggle, remove }
}

export function useScrapingJobs() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/scraping/jobs', getScrapingJobs, {
    refreshInterval: 10_000,
  })

  async function trigger() {
    const job = await triggerScraping()
    mutate()
    return job
  }

  return { jobs: data ?? [], isLoading, error, trigger }
}
