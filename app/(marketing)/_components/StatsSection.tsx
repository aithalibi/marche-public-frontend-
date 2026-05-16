export default function StatsSection() {
  const stats = [
    { value: '12 400', label: 'Marchés indexés' },
    { value: '248', label: "Collectés aujourd'hui" },
    { value: '6h', label: 'Fréquence collecte' },
    { value: '16', label: 'Régions couvertes' },
    { value: '98%', label: 'Taux de détection' },
  ]

  return (
    <div className="statsband">
      <div className="si">
        {stats.map((stat, idx) => (
          <div key={idx} className="sb-item">
            <div className="sb-val">{stat.value}</div>
            <div className="sb-lbl">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
