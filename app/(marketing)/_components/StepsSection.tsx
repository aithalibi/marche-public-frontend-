export default function StepsSection() {
  const steps = [
    { num: 1, title: 'Créez votre profil', desc: 'Définissez vos secteurs, mots-clés et région cible en quelques minutes.', icon: 'fa-user-gear' },
    { num: 2, title: 'Le robot surveille', desc: 'Notre système scrute marchespublics.gov.ma toutes les 6 heures automatiquement.', icon: 'fa-robot' },
    { num: 3, title: 'Matching intelligent', desc: 'Seuls les marchés correspondant à votre profil sont sélectionnés et filtrés.', icon: 'fa-bullseye' },
    { num: 4, title: 'Recevez les alertes', desc: 'Notification immédiate ou résumé quotidien selon vos préférences.', icon: 'fa-bell' },
  ]

  return (
    <section className="bg-light">
      <div className="container">
        <div className="sec-tag">
          <i className="fa-solid fa-circle-nodes" aria-hidden />
          Comment ça marche
        </div>
        <div className="sec-title">En 4 étapes simples</div>
        <div className="sec-sub">
          Notre plateforme surveille les marchés publics pour vous et vous envoie uniquement ce qui correspond à votre
          activité.
        </div>
        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={step.num} className="step-card">
              <div className="step-num">{step.num}</div>
              <div className="step-ico">
                <i className={`fa-solid ${step.icon}`} aria-hidden />
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="step-arrow max-lg:hidden">
                  <i className="fa-solid fa-arrow-right" aria-hidden />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
