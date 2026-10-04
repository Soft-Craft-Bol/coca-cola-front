import { useState } from 'react'
import { CalendarDays, CheckCircle2, MapPin } from 'lucide-react'
import { Badge } from '@/shared/components/ui'
import { formatDateTime } from '@/shared/utils/format'
import type { PublicTicket } from '@/shared/types'
import Ticket from './Ticket'

// Tarjeta con los datos de una entrada y, al abrirla, la entrada descargable
export default function TicketForPublic({ ticket, startOpen = false }: { ticket: PublicTicket; startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <div className="card stack" style={{ gap: 10 }}>
      <div className="row spread">
        <Badge tone="red">{ticket.registrationType}</Badge>
        {ticket.attended && <span className="icon-inline" style={{ color: '#166534', fontSize: 13 }}><CheckCircle2 size={15} /> Ya ingresaste</span>}
      </div>
      <h3 style={{ fontSize: 18, margin: 0 }}>{ticket.eventName}</h3>
      <span className="icon-inline muted" style={{ fontSize: 14 }}><CalendarDays size={15} /> {formatDateTime(ticket.eventDate)}</span>
      <span className="icon-inline muted" style={{ fontSize: 14 }}><MapPin size={15} /> {ticket.location}</span>
      <button className="btn" onClick={() => setOpen(!open)}>{open ? 'Ocultar entrada' : 'Ver mi entrada'}</button>
      {open && (
        <Ticket data={{
          participantName: ticket.participantName,
          eventName: ticket.eventName,
          eventDate: ticket.eventDate,
          location: ticket.location,
          code: ticket.qrCode,
          typeLabel: ticket.registrationType,
        }} />
      )}
    </div>
  )
}
