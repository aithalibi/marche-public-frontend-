import TopStrip from './_components/TopStrip'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-accueil" className="page active">
      <TopStrip />
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
