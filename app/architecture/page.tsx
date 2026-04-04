import type { Metadata } from 'next'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Architecture technique — Marchés publics',
  description:
    'Schéma d’architecture (Next.js, Spring Boot, collecte Python, MongoDB) — identique au diagramme de référence.',
}

/** Rendu pixel-fidèle : fichier SVG source inchangé (viewBox 680×872). */
export default function ArchitecturePage() {
  return (
    <div id="page-accueil" className="page active">
      <TopStrip />
      <Navbar />
      <main className="bg-white border-b border-black/[0.06]">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-4">
          <p className="text-xs italic text-[#3D3D3A] mb-1">Documentation</p>
          <h1 className="text-2xl font-semibold text-[#171717] tracking-tight">
            Architecture — marchés publics
          </h1>
          <p className="text-sm text-[#64748B] mt-2 max-w-xl leading-relaxed">
            Représentation identique au fichier{' '}
            <code className="text-xs bg-[#F1F1EF] px-1.5 py-0.5 rounded">architecture_marches_publics_finale.svg</code>{' '}
            (calques Frontend, Backend, Collecte, Infrastructure).
          </p>
        </div>

        <div className="max-w-[720px] mx-auto px-4 pb-16">
          <div className="rounded-[14px] border border-dashed border-black/[0.15] bg-[#FAFAF9] p-4 sm:p-6">
            {/* <img> pour rendu 1:1 du SVG (évite toute optimisation qui déformerait le fichier source). */}
            <img
              src="/architecture_marches_publics_finale.svg"
              alt="Schéma d’architecture : Next.js 14, Spring Boot 3, module Python, MongoDB, Docker"
              width={680}
              height={873}
              className="w-full h-auto block mx-auto"
              decoding="async"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
