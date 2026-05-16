import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-6">
      <section className="w-full max-w-md rounded-lg border border-arch-violet/10 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-arch-lavender text-arch-violet-dark">
          <SearchX className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-arch-violet">404</p>
        <h1 className="mt-1 text-xl font-semibold text-gray-950">Page introuvable</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Cette page n&apos;existe pas ou a ete deplacee.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-arch-violet px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-arch-violet-dark focus:outline-none focus:ring-2 focus:ring-arch-violet focus:ring-offset-2"
        >
          Retour a l&apos;accueil
        </Link>
      </section>
    </main>
  )
}
