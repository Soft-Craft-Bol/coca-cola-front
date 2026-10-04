import { Link } from 'react-router-dom'
import { CalendarDays, Eye, Megaphone, MapPin, Pencil, Trash2, Users, Wallet } from 'lucide-react'
import { Badge } from '@/shared/components/ui'
import { EVENT_STATUS } from '@/shared/constants'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { optimizeImage } from '@/shared/utils/image'
import type { CcEvent, EventStatus } from '@/shared/types'

const TONE: Record<EventStatus, string> = { planned: 'amber', active: 'green', finished: '' }

interface Props {
  event: CcEvent
  onEdit?: () => void
  onDelete?: () => void
  onStatusChange?: (status: EventStatus) => void
  busy?: boolean
}

export default function EventCard({ event, onEdit, onDelete, onStatusChange, busy }: Props) {
  const cover = optimizeImage(event.imageUrl, 640, 360)
  const date = new Date(event.date)

  return (
    <article className="event-card">
      <div className={`event-cover ${cover ? '' : 'no-image'}`}>
        {cover ? <img src={cover} alt={event.name} loading="lazy" draggable={false} /> : <CalendarDays size={40} strokeWidth={1.5} />}
        <div className="event-status"><Badge tone={TONE[event.status]}>{EVENT_STATUS[event.status]}</Badge></div>
        <div className="event-date">
          <span>{new Intl.DateTimeFormat('es-BO', { day: '2-digit' }).format(date)}</span>
          <small>{new Intl.DateTimeFormat('es-BO', { month: 'short' }).format(date).replace('.', '')}</small>
        </div>
      </div>

      <div className="event-body">
        <span className="event-type">{event.type}</span>
        <h3 className="event-title">{event.name}</h3>
        <ul className="event-meta">
          <li><MapPin size={15} /> <span>{event.location}</span></li>
          <li><CalendarDays size={15} /> <span>{formatDate(event.date)}</span></li>
          <li><Users size={15} /> <span>{event.expected} participantes esperados</span></li>
          <li><Wallet size={15} /> <span>{formatCurrency(event.budget)}</span></li>
          {event.campaign && <li><Megaphone size={15} /> <span>{event.campaign}</span></li>}
        </ul>
      </div>

      {onStatusChange && <label className="event-move">
        <span>{busy ? 'Guardando estado…' : 'Mover a'}</span>
        <select aria-label={`Estado de ${event.name}`} value={event.status} disabled={busy}
          onChange={(e) => onStatusChange(e.target.value as EventStatus)}>
          {Object.entries(EVENT_STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>}
      <div className="event-actions">
        <Link className="btn small primary icon-inline" to={`/eventos/${event.id}`}><Eye size={14} /> Ver detalle</Link>
        <span className="spacer" />
        {onEdit && <button className="btn small icon-btn" onClick={onEdit} title="Editar" aria-label="Editar evento"><Pencil size={14} /></button>}
        {onDelete && <button className="btn small icon-btn danger" onClick={onDelete} title="Eliminar" aria-label="Eliminar evento"><Trash2 size={14} /></button>}
      </div>
    </article>
  )
}
