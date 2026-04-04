/** Colonne gauche du template VeilleMarché (auth). */
export default function AuthMarketingPanel() {
  return (
    <div className="auth-left">
      <div className="auth-left-logo">
        <div className="ico">
          <i className="fa-solid fa-landmark" aria-hidden />
        </div>
        <span>VeilleMarché.ma</span>
      </div>
      <h2>Automatisez votre veille des marchés publics</h2>
      <p>
        Créez votre profil en 3 minutes et ne manquez plus jamais un appel d&apos;offres pertinent.
      </p>
      <div className="benefits">
        {[
          { icon: 'fa-robot', title: 'Robot de collecte 24/7', desc: 'Surveillance automatique toutes les 6 heures' },
          { icon: 'fa-crosshairs', title: 'Matching intelligent', desc: 'Uniquement les marchés qui correspondent à vos critères' },
          { icon: 'fa-envelope-open-text', title: 'Alertes instantanées', desc: 'Email ou résumé quotidien selon vos préférences' },
          { icon: 'fa-chart-line', title: 'Tableau de bord complet', desc: 'Gérez toutes vos opportunités depuis un seul endroit' },
        ].map((b) => (
          <div key={b.title} className="benefit">
            <div className="benefit-ico">
              <i className={`fa-solid ${b.icon}`} aria-hidden />
            </div>
            <div>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="left-stats">
        <div>
          <div className="lst-val">12 400+</div>
          <div className="lst-lbl">Marchés indexés</div>
        </div>
        <div>
          <div className="lst-val">850+</div>
          <div className="lst-lbl">Utilisateurs</div>
        </div>
        <div>
          <div className="lst-val">98%</div>
          <div className="lst-lbl">Détection</div>
        </div>
      </div>
    </div>
  )
}
