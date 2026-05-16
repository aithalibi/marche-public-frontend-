import Link from 'next/link'

export default function CTASection() {
  return (
    <div className="cta-sec">
      <div className="container">
        <h2>Commencez à surveiller les marchés dès aujourd&apos;hui</h2>
        <p>Inscription gratuite · Aucune carte bancaire requise · Activez votre veille en 3 minutes</p>
        <Link href="/register" className="btn-cta-g" style={{ textDecoration: 'none' }}>
          <i className="fa-solid fa-rocket" aria-hidden />
          Créer un compte gratuit
        </Link>
        <Link href="/login" className="btn-cta-o" style={{ textDecoration: 'none' }}>
          <i className="fa-solid fa-right-to-bracket" aria-hidden />
          Se connecter
        </Link>
      </div>
    </div>
  )
}
