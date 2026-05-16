import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Architecture technique - Marches publics',
  description:
    'Schema d architecture (Next.js, Spring Boot, collecte Python, MongoDB) identique au diagramme de reference.',
}

export default function ArchitecturePage() {
  return (
    <main className="bg-white border-b border-black/[0.06]">
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-4">
        <p className="text-xs italic text-[#3D3D3A] mb-1">Documentation</p>
        <h1 className="text-2xl font-semibold text-[#171717] tracking-tight">
          Architecture - marches publics
        </h1>
        <p className="text-sm text-[#64748B] mt-2 max-w-xl leading-relaxed">
          Representation identique au fichier{' '}
          <code className="text-xs bg-[#F1F1EF] px-1.5 py-0.5 rounded">architecture_marches_publics_finale.svg</code>{' '}
          (calques Frontend, Backend, Collecte, Infrastructure).
        </p>
      </div>

      <div className="max-w-[720px] mx-auto px-4 pb-16">
        <div className="rounded-[14px] border border-dashed border-black/[0.15] bg-[#FAFAF9] p-4 sm:p-6">
          <Image
            src="/architecture_marches_publics_finale.svg"
            alt="Schema d architecture : Next.js 14, Spring Boot 3, module Python, MongoDB, Docker"
            width={680}
            height={873}
            className="w-full h-auto block mx-auto"
            priority
          />
        </div>
      </div>
    </main>
  )
}
