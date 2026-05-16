export default function SectorsSection() {
  const sectors = [
    { name: 'Informatique & IT', count: '3 240 marchés', icon: 'fa-laptop-code' },
    { name: 'BTP & Travaux', count: '4 180 marchés', icon: 'fa-hard-hat' },
    { name: 'Santé', count: '1 560 marchés', icon: 'fa-stethoscope' },
    { name: 'Éducation', count: '890 marchés', icon: 'fa-graduation-cap' },
    { name: 'Énergie', count: '720 marchés', icon: 'fa-bolt' },
    { name: 'Transport', count: '1 010 marchés', icon: 'fa-truck' },
  ]

  return (
    <section>
      <div className="container">
        <div className="sec-tag">
          <i className="fa-solid fa-building-columns" aria-hidden />
          Secteurs couverts
        </div>
        <div className="sec-title">Tous les secteurs des marchés publics</div>
        <div className="sectors-grid-home">
          {sectors.map((s) => (
            <div key={s.name} className="sc-card">
              <div className="sc-ico">
                <i className={`fa-solid ${s.icon}`} aria-hidden />
              </div>
              <div className="sc-name">{s.name}</div>
              <div className="sc-count">{s.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
