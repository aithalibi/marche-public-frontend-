import Spinner from '@/components/ui/Spinner'

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-6">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-5" />
        <p className="text-sm font-medium text-arch-violet-dark">Chargement de la page...</p>
      </div>
    </main>
  )
}
