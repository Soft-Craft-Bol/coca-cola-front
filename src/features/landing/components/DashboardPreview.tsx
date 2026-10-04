import { CheckCircle2, MousePointerClick, ShoppingBag, Users } from 'lucide-react'

// Ilustración estática con datos de ejemplo (no se conecta al sistema)
const METRICS = [
  { label: 'Participantes', value: '350', icon: Users },
  { label: 'Asistentes', value: '280', icon: CheckCircle2 },
  { label: 'Interacciones', value: '126', icon: MousePointerClick },
  { label: 'Conversiones', value: '84', icon: ShoppingBag },
]
const HOURS = [['16h', 20], ['17h', 45], ['18h', 70], ['19h', 100], ['20h', 85], ['21h', 55]] as const
const PRODUCTS = [['Coca-Cola Original', 86], ['Zero', 62], ['Fanta', 45]] as const

export default function DashboardPreview() {
  return (
    <div className="dash" role="group" aria-label="Ejemplo de panel de indicadores con datos de muestra">
      <div className="dash-head">
        <h3>Panel de indicadores</h3>
        <span className="dash-tag">Datos de ejemplo</span>
      </div>
      <dl className="dash-kpis">
        {METRICS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="dash-kpi">
            <dt><Icon size={14} aria-hidden="true" /> {label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="dash-grid">
        <figure className="dash-card">
          <figcaption>Asistencia por hora</figcaption>
          <div className="dash-chart" role="img" aria-label="Gráfico de barras de ejemplo: la asistencia sube hasta las 19 h y baja después.">
            <div className="dash-bars">
              {HOURS.map(([h, v]) => <i key={h} style={{ height: `${v}%` }} />)}
            </div>
            <div className="dash-hours" aria-hidden="true">{HOURS.map(([h]) => <span key={h}>{h}</span>)}</div>
          </div>
        </figure>
        <figure className="dash-card">
          <figcaption>Interés por producto</figcaption>
          <ul className="dash-rows" aria-label="Interés por producto, ilustrativo">
            {PRODUCTS.map(([name, v]) => (
              <li key={name}><span>{name}</span><b aria-hidden="true"><i style={{ width: `${v}%` }} /></b></li>
            ))}
          </ul>
        </figure>
      </div>
    </div>
  )
}
