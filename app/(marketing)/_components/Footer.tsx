import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="f-logo">
              <div className="f-logo-ico">
                <i className="fa-solid fa-landmark" aria-hidden />
              </div>
              <span>VeilleMarché.ma</span>
            </div>
            <p>
              Plateforme de veille automatisée des marchés publics du Maroc. Surveillance de marchespublics.gov.ma.
            </p>
            <p className="mt-3">Projet académique DEV-3.4 — EMSI Marrakech 2026/2027</p>
          </div>
          <div className="f-col">
            <h4>Plateforme</h4>
            <Link href="/login?callbackUrl=/recherche">Appels d&apos;offres</Link>
            <Link href="/login">Bons de commande</Link>
            <Link href="/login">Secteurs</Link>
            <Link href="/architecture">Architecture</Link>
          </div>
          <div className="f-col">
            <h4>Compte</h4>
            <Link href="/login">Se connecter</Link>
            <Link href="/register">S&apos;inscrire</Link>
            <Link href="/profil">Mon profil</Link>
          </div>
          <div className="f-col">
            <h4>Légal</h4>
            <a href="#privacy">Confidentialité</a>
            <a href="#terms">CGU</a>
            <a href="#legal">Mentions légales</a>
          </div>
        </div>
        <div className="f-bottom">
          <span>© 2026 VeilleMarché.ma — Tous droits réservés</span>
          <span>Maroc — Données : marchespublics.gov.ma (TGR)</span>
        </div>
      </div>
    </footer>
  )
}
