import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import StatsSection from '@/components/StatsSection'
import StepsSection from '@/components/StepsSection'
import SectorsSection from '@/components/SectorsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div id="page-accueil" className="page active">
      <TopStrip />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <StepsSection />
      <SectorsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
