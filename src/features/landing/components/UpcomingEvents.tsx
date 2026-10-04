import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { publicService } from '@/features/participants/services/publicService'
import EventCard, { EventCardSkeleton } from './EventCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

// Eventos abiertos a inscripción: cualquier persona puede pre-inscribirse (o inscribirse si ya está en curso)
export default function UpcomingEvents() {
  const { data, loading, error, reload } = useAsync(() => publicService.events(), [])

  return (
    <section id="eventos" className="lp-light-section" aria-labelledby="eventos-title">
      <SectionHeading id="eventos-title" eyebrow="EVENTOS" plain="Inscríbete a los" accent="próximos eventos">
        Pre-inscríbete antes del evento y descarga tu entrada con tu código QR. Si ya estás inscrito y la perdiste, puedes recuperarla.
      </SectionHeading>

      {loading && (
        <div className="ev-grid" role="status" aria-label="Cargando eventos">
          <EventCardSkeleton /><EventCardSkeleton /><EventCardSkeleton />
        </div>
      )}
      {!loading && error && (
        <div className="ev-state" role="alert">
          <p>No pudimos cargar los eventos en este momento.</p>
          <button type="button" className="ev-retry" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!loading && !error && data && data.length === 0 && (
        <div className="ev-state"><p>Pronto anunciaremos nuevos eventos. ¡Vuelve a visitarnos!</p></div>
      )}
      {data && data.length > 0 && (
        <div className="ev-grid">
          {data.map((e, i) => (
            <Reveal key={e.id} delay={i * 80} className="fill"><EventCard event={e} /></Reveal>
          ))}
        </div>
      )}

      <p className="ev-recover">
        <Link to="/mi-entrada">¿Ya te inscribiste y perdiste tu entrada? Recupérala aquí <ArrowRight size={16} aria-hidden="true" /></Link>
      </p>
    </section>
  )
}
