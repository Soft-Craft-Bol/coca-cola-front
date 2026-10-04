import { BarChart3, FileSpreadsheet, GlassWater, QrCode, ScanLine, Star } from 'lucide-react'
import FeatureCard from './FeatureCard'
import {
  CupIllustration, PanelIllustration, ReportIllustration, ScannerIllustration, SurveyIllustration, TicketIllustration,
} from './FeatureIllustrations'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const FEATURES = [
  { icon: QrCode, title: 'Registro con QR', text: 'Formulario web, preinscripción o tablet en sitio. Cada asistente recibe su código QR personal.', benefit: 'Acceso más rápido', art: <TicketIllustration /> },
  { icon: ScanLine, title: 'Control de ingreso', text: 'Escanea el código y registra la hora de llegada: distingue a los registrados de quienes realmente asistieron.', benefit: 'Control de ingreso al instante', art: <ScannerIllustration /> },
  { icon: GlassWater, title: 'Degustaciones', text: 'Qué producto probó cada persona, cómo lo calificó y si lo compraría después de probarlo.', benefit: 'Conecta la experiencia con resultados', art: <CupIllustration /> },
  { icon: BarChart3, title: 'Indicadores en vivo', text: 'Asistencia, participación, conversión, recurrencia y satisfacción en un panel claro para decidir rápido.', benefit: 'Toma decisiones al instante', art: <PanelIllustration /> },
  { icon: Star, title: 'Encuestas y NPS', text: 'Mide la satisfacción del evento y qué tan probable es que recomienden la experiencia.', benefit: 'Escucha a tu audiencia', art: <SurveyIllustration /> },
  { icon: FileSpreadsheet, title: 'Reportes y Power BI', text: 'Compara eventos, exporta a CSV y conecta tu dashboard ejecutivo con la información estructurada.', benefit: 'Convierte datos en oportunidades', art: <ReportIllustration /> },
]

export default function Solution() {
  return (
    <section id="solucion" className="lp-light-section" aria-labelledby="solucion-title">
      <SectionHeading id="solucion-title" eyebrow="LA SOLUCIÓN" plain="Todo el evento" accent="en un solo lugar">
        Deja de repartir la información entre hojas de cálculo, formularios y fotos. Una plataforma que estructura cada dato del evento y lo convierte en resultados medibles.
      </SectionHeading>
      <div className="fc-grid">
        {FEATURES.map(({ art, ...f }, i) => (
          <Reveal key={f.title} delay={(i % 3) * 80} className="fill"><FeatureCard {...f} illustration={art} /></Reveal>
        ))}
      </div>
    </section>
  )
}
