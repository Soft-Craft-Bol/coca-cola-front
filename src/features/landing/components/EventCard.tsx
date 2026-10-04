import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ImageOff, MapPin } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/format'
import { optimizeImage } from '@/shared/utils/image'
import type { PublicEvent } from '@/shared/types'

// Tarjeta de un evento abierto a inscripción; el botón lleva al flujo real de registro
export default function EventCard({ event: e }: { event: PublicEvent }) {
  const cover = optimizeImage(e.imageUrl, 720, 360)
  const active = e.status === 'active'
  return (
    <article className="ev-card">
      <div className={`ev-cover ${cover ? '' : 'empty'}`}>
        {cover ? <img src={cover} alt={`Imagen de ${e.name}`} width={720} height={360} loading="lazy" /> : <ImageOff size={32} strokeWidth={1.4} aria-hidden="true" />}
        {e.type && <span className="ev-type">{e.type}</span>}
      </div>
      <div className="ev-body">
        <h3>{e.name}</h3>
        <p className="ev-meta"><CalendarDays size={16} aria-hidden="true" /> {formatDateTime(e.date)}</p>
        <p className="ev-meta"><MapPin size={16} aria-hidden="true" /> {e.location}</p>
        {e.description && <p className="ev-desc">{e.description}</p>}
        <Link to={`/registro/${e.id}`} className="ev-cta">
          {active ? 'Inscribirme' : 'Pre-inscribirme'} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="ev-card skeleton" aria-hidden="true">
      <div className="ev-cover" />
      <div className="ev-body">
        <i className="sk-line w60 tall" /><i className="sk-line w40" /><i className="sk-line w50" />
        <i className="sk-line" /><i className="sk-line w80" /><i className="sk-btn" />
      </div>
    </div>
  )
}
