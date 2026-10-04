import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { formatDateTime } from '@/shared/utils/format'
import { optimizeImage } from '@/shared/utils/image'
import { publicService } from '@/features/participants/services/publicService'
import Reveal from './Reveal'

// Eventos abiertos a inscripción: cualquier persona puede pre-inscribirse (o inscribirse si ya está en curso)
export default function UpcomingEvents() {
  const { data, loading, error } = useAsync(() => publicService.events(), [])

  return (
    <section id="eventos" className="lp-section">
      <Reveal><span className="eyebrow dark">Eventos</span></Reveal>
      <Reveal delay={80}><h2>Inscríbete a los próximos eventos</h2></Reveal>
      <Reveal delay={160}>
        <p className="lead">Pre-inscríbete antes del evento y descarga tu entrada con tu código QR. Si ya estás inscrito y la perdiste, puedes recuperarla.</p>
      </Reveal>

      {loading && <p className="muted" style={{ marginTop: 40 }}>Cargando eventos…</p>}
      {error && <p className="muted" style={{ marginTop: 40 }}>No pudimos cargar los eventos en este momento.</p>}
      {data && data.length === 0 && <p className="muted" style={{ marginTop: 40 }}>Pronto anunciaremos nuevos eventos. ¡Vuelve a visitarnos!</p>}

      <div className="pub-events">
        {data?.map((e, i) => {
          const cover = optimizeImage(e.imageUrl, 640, 360)
          return (
            <Reveal key={e.id} delay={i * 90} direction="zoom">
              <article className="pub-event">
                <div className={`pub-cover ${cover ? '' : 'no-image'}`}>
                  {cover ? <img src={cover} alt={e.name} loading="lazy" /> : <CalendarDays size={44} strokeWidth={1.4} />}
                  <span className="pub-status">{e.status === 'active' ? 'Inscripciones abiertas hoy' : 'Pre-inscripciones abiertas'}</span>
                </div>
                <div className="pub-body">
                  <span className="pub-type">{e.type}</span>
                  <h3>{e.name}</h3>
                  <p className="icon-inline"><CalendarDays size={15} /> {formatDateTime(e.date)}</p>
                  <p className="icon-inline"><MapPin size={15} /> {e.location}</p>
                  <Link to={`/registro/${e.id}`} className="lp-btn lp-btn-red"><Ticket size={16} /> {e.status === 'active' ? 'Inscribirme' : 'Pre-inscribirme'}</Link>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
      <p style={{ marginTop: 34 }}><Link to="/mi-entrada" className="lp-link">¿Ya te inscribiste y perdiste tu entrada? Recupérala aquí</Link></p>
    </section>
  )
}
