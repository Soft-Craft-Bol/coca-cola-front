import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import type { CcEvent, EventStatus } from '@/shared/types'
import { EVENT_STATUS } from '@/shared/constants'
import EventCard from './EventCard'

interface Props {
  events: CcEvent[]
  canEdit: boolean
  pendingId: string | null
  onMove: (event: CcEvent, status: EventStatus) => void
  onEdit: (event: CcEvent) => void
  onDelete: (event: CcEvent) => void
}

export default function EventBoard({ events, canEdit, pendingId, onMove, onEdit, onDelete }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [over, setOver] = useState<EventStatus | null>(null)
  const reset = () => { setDraggedId(null); setOver(null) }

  return <div className="event-board" aria-label="Eventos por estado">
    {(Object.entries(EVENT_STATUS) as [EventStatus, string][]).map(([status, label]) => {
      const items = events.filter((event) => event.status === status)
      return <section key={status} className={`event-column ${status}${over === status ? ' drag-over' : ''}`}
        aria-label={`${label}: ${items.length} eventos`}
        onDragOver={(e) => {
          if (!canEdit || pendingId || !draggedId) return
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
          setOver(status)
        }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(null) }}
        onDrop={(e) => {
          e.preventDefault()
          const event = events.find((item) => item.id === draggedId)
          reset()
          if (canEdit && !pendingId && event && event.status !== status) onMove(event, status)
        }}>
        <header className="event-column-head"><h2><span className="event-column-dot" />{label}</h2><span>{items.length}</span></header>
        <div className="event-column-cards">
          {items.map((event) => <div key={event.id} className={`event-board-item${draggedId === event.id ? ' dragging' : ''}`}
            aria-busy={pendingId === event.id}>
            {canEdit && <div className="event-drag-handle" draggable={!pendingId}
              title="Arrastra a otra columna para cambiar el estado"
              onDragStart={(e) => {
                if (pendingId) { e.preventDefault(); return }
                setDraggedId(event.id)
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('text/plain', event.id)
                e.dataTransfer.setDragImage(e.currentTarget.parentElement!, 30, 20)
              }} onDragEnd={reset}>
              <GripVertical size={16} /><span>Arrastrar evento</span>
            </div>}
            <EventCard event={event} busy={!!pendingId}
              onStatusChange={canEdit ? (next) => onMove(event, next) : undefined}
              onEdit={canEdit && !pendingId ? () => onEdit(event) : undefined}
              onDelete={canEdit && !pendingId ? () => onDelete(event) : undefined} />
          </div>)}
          {!items.length && <div className="event-column-empty">{canEdit ? 'Arrastra un evento aquí' : 'Sin eventos en este estado'}</div>}
        </div>
      </section>
    })}
  </div>
}
