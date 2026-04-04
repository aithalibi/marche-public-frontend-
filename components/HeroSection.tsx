'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [keyword, setKeyword] = useState('')
  const [region, setRegion] = useState('all')
  const [sector, setSector] = useState('all')

  return (
    <div className="hero">
      <div className="hero-grid">
        <div>
          <div className="hero-badge">
            <span className="live-dot" />
            248 nouveaux marchés collectés aujourd&apos;hui
          </div>
          <h1>
            Trouvez les appels d&apos;offres
            <br />
            <em>qui vous concernent</em>,<br />
            automatiquement
          </h1>
          <p className="hero-sub">
            VeilleMarché.ma surveille marchespublics.gov.ma pour vous. Définissez vos critères une seule fois et
            recevez les marchés publics pertinents directement par email.
          </p>
          <div className="hero-stats">
            <div>
              <div className="hstat-val">12 400+</div>
              <div className="hstat-lbl">Marchés indexés</div>
            </div>
            <div>
              <div className="hstat-val">350+</div>
              <div className="hstat-lbl">Nouveaux / semaine</div>
            </div>
            <div>
              <div className="hstat-val">850+</div>
              <div className="hstat-lbl">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="hstat-val">98%</div>
              <div className="hstat-lbl">Taux de détection</div>
            </div>
          </div>
        </div>

        <div className="search-card">
          <div className="search-card-title">
            <i className="fa-solid fa-magnifying-glass" aria-hidden />
            Rechercher un marché
          </div>
          <div className="sfield">
            <label>
              <i className="fa-solid fa-keyboard" aria-hidden /> Mot-clé
            </label>
            <div className="si-wrap">
              <i className="fa-solid fa-search ic" aria-hidden />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ex: informatique, réseau, BTP..."
              />
            </div>
          </div>
          <div className="sfield">
            <label>
              <i className="fa-solid fa-map-pin" aria-hidden /> Région
            </label>
            <div className="si-wrap">
              <i className="fa-solid fa-location-dot ic" aria-hidden />
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="all">Toutes les régions</option>
                <option value="casablanca">Casablanca-Settat</option>
                <option value="rabat">Rabat-Salé-Kénitra</option>
                <option value="souss">Souss-Massa</option>
              </select>
            </div>
          </div>
          <div className="sfield">
            <label>
              <i className="fa-solid fa-tags" aria-hidden /> Secteur
            </label>
            <div className="si-wrap">
              <i className="fa-solid fa-industry ic" aria-hidden />
              <select value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="all">Tous les secteurs</option>
                <option value="it">Informatique & Numérique</option>
                <option value="btp">BTP & Travaux</option>
                <option value="sante">Santé</option>
              </select>
            </div>
          </div>
          <Link href="/login?callbackUrl=/recherche" className="btn-search-hero" style={{ textDecoration: 'none' }}>
            <i className="fa-solid fa-magnifying-glass" aria-hidden />
            Rechercher
          </Link>
          <div className="search-note">
            <i className="fa-solid fa-shield-halved" aria-hidden />
            Inscription gratuite — Aucune carte requise
          </div>
        </div>
      </div>
    </div>
  )
}
