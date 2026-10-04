import { useState } from 'react'
import { CalendarDays, CheckCircle2, MapPin, QrCode } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/format'
import type { PublicTicket } from '@/shared/types'
import Ticket from './Ticket'

// Tarjeta con los datos de una entrada y, al abrirla, la entrada descargable
export default function TicketForPublic({ ticket, startOpen = false }: { ticket: PublicTicket; startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <article className="tk-ticket">
      <div className="tk-ticket-top">
        <span className="tk-pill">{ticket.registrationType}</span>
        {ticket.attended && <span className="tk-ok"><CheckCircle2 size={15} aria-hidden="true" /> Ya ingresaste</span>}
      </div>
      <h3>{ticket.eventName}</h3>
      <p className="tk-meta"><CalendarDays size={16} aria-hidden="true" /> {formatDateTime(ticket.eventDate)}</p>
      <p className="tk-meta"><MapPin size={16} aria-hidden="true" /> {ticket.location}</p>
      <button type="button" className="tk-outline" onClick={() => setOpen(!open)} aria-expanded={open}>
        <QrCode size={16} aria-hidden="true" /> {open ? 'Ocultar entrada' : 'Ver mi entrada'}
      </button>
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
    </article>
  )
}
