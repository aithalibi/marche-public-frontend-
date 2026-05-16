'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-6">
      <section className="w-full max-w-md rounded-lg border border-arch-violet/10 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-gray-950">Une erreur est survenue</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          La page n&apos;a pas pu etre chargee correctement. Vous pouvez reessayer.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-arch-violet px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-arch-violet-dark focus:outline-none focus:ring-2 focus:ring-arch-violet focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reessayer
        </button>
      </section>
    </main>
  )
}
