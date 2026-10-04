import { Check } from 'lucide-react'
import DashboardPreview from './DashboardPreview'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const BENEFITS = [
  'Embudo de interacción: del registro a la conversión',
  'Comparación entre eventos y campañas',
  'Participantes nuevos y recurrentes',
  'Satisfacción por criterio y NPS',
]

export default function PanelSection() {
  return (
    <section id="panel" className="lp-light-section panel-sec" aria-labelledby="panel-title">
      <div className="panel-copy">
        <SectionHeading id="panel-title" eyebrow="EL PANEL" plain="Indicadores que cuentan la historia del evento" align="left">
          Ejemplo: asistieron 280 personas, se registraron 126 interacciones y se generaron 84 conversiones. Así de claro.
        </SectionHeading>
        <Reveal delay={200}>
          <ul className="benefits">
            {BENEFITS.map(b => <li key={b}><i aria-hidden="true"><Check size={13} strokeWidth={3} /></i>{b}</li>)}
          </ul>
        </Reveal>
      </div>
      <Reveal delay={120} className="panel-visual"><DashboardPreview /></Reveal>
    </section>
  )
}
