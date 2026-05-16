import Link from 'next/link'

export default function TopStrip() {
  return (
    <div className="topstrip">
      <div className="ts-inner">
        <span>
          <i className="fa-solid fa-database" style={{ marginRight: 6 }} aria-hidden />
          Source officielle : marchespublics.gov.ma — Trésorerie Générale du Royaume
        </span>
        <div>
          <Link href="/login">
            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: 4 }} aria-hidden />
            Connexion
          </Link>
          <Link href="/register">
            <i className="fa-solid fa-user-plus" style={{ marginRight: 4 }} aria-hidden />
            Inscription gratuite
          </Link>
        </div>
      </div>
    </div>
  )
}
