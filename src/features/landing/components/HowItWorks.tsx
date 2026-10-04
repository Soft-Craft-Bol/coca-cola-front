import { BarChart3, ClipboardList, Users, type LucideIcon } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const STEPS: { n: string; phase: string; title: string; text: string; icon: LucideIcon }[] = [
  { n: '01', phase: 'Antes', title: 'Registro y planificación', text: 'Crea el evento, define campaña, presupuesto y productos. Abre el registro y comparte el QR.', icon: ClipboardList },
  { n: '02', phase: 'Durante', title: 'Control e interacción', text: 'Valida asistencia en la puerta y registra cada degustación, dinámica, canje y conversión.', icon: Users },
  { n: '03', phase: 'Después', title: 'Seguimiento y análisis', text: 'Convierte los datos en indicadores, compara eventos y entiende qué experiencia funcionó mejor.', icon: BarChart3 },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="lp-light-section" aria-labelledby="como-title">
      <SectionHeading id="como-title" eyebrow="CÓMO FUNCIONA" plain="De la planificación a la decisión" />
      <ol className="steps-list">
        {STEPS.map(({ n, phase, title, text, icon: Icon }, i) => (
          <li key={n}>
            <Reveal delay={i * 80} className="fill">
              <div className={`step-card ${i === 2 ? 'last' : ''}`}>
                <span className="step-n" aria-hidden="true">{n}</span>
                <span className="step-phase"><Icon size={15} aria-hidden="true" /> {phase}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
