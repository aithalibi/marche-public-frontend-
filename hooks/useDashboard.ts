import useSWR from 'swr'
import { getDashboardStats } from '@/lib/api/dashboard'

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/dashboard/stats', getDashboardStats, {
    refreshInterval: 30_000,
  })

  return {
    stats: data,
    error,
    isLoading,
    refresh: mutate,
  }
}
