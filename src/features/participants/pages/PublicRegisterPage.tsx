import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, MapPin, Search } from 'lucide-react'
import type { Participant, ParticipantInput } from '@/shared/types'
import logo from '@/assets/coca-cola-logo.png'
import { Badge, Card, ErrorBox, Loading } from '@/shared/components/ui'
import { formatDateTime } from '@/shared/utils/format'
import { optimizeImage } from '@/shared/utils/image'
import { useEvent } from '@/features/events/hooks/useEvents'
import ParticipantForm from '../components/ParticipantForm'
import Ticket from '../components/Ticket'
import { participantService } from '../services/participantService'

// Página pública (sin login): pre-inscripción antes del evento e inscripción mientras está en curso
export default function PublicRegisterPage() {
  const { eventId = '' } = useParams()
  const { data: event, loading, error } = useEvent(eventId)
  const [done, setDone] = useState<Participant | null>(null)

  if (loading) return <div className="public-page"><Loading /></div>
  if (error) return <div className="public-page"><ErrorBox error={error} /></div>
  if (!event) return <div className="public-page"><Loading /></div>

  const finished = event.status === 'finished'
  const typeLabel = event.status === 'active' ? 'Inscripción' : 'Pre-inscripción'
  const banner = optimizeImage(event.imageUrl, 1000, 360)

  return (
    <div className="public-page">
      <div className="public-card stack">
        <Link to="/"><img className="public-logo" src={logo} alt="Coca-Cola" /></Link>
        {banner && <img className="event-banner" src={banner} alt={event.name} />}
        <div>
          <Badge tone={finished ? '' : 'red'}>{finished ? 'Evento finalizado' : typeLabel}</Badge>
          <h1 style={{ fontSize: 26, margin: '8px 0 6px' }}>{event.name}</h1>
          <div className="stack" style={{ gap: 4, fontSize: 14 }}>
            <span className="icon-inline muted"><CalendarDays size={15} /> {formatDateTime(event.date)}</span>
            <span className="icon-inline muted"><MapPin size={15} /> {event.location}</span>
          </div>
        </div>

        {finished && (
          <Card title="Este evento ya finalizó">
            <p style={{ marginTop: 0 }}>Las inscripciones están cerradas. Mira los próximos eventos en la página principal.</p>
            <Link className="btn primary" to="/#eventos">Ver próximos eventos</Link>
          </Card>
        )}

        {!finished && done && (
          <Card title={`¡${typeLabel} confirmada!`}>
            <p style={{ marginTop: 0 }}>
              Descarga tu entrada y preséntala en el ingreso. Si la pierdes, puedes recuperarla con tu correo o celular en{' '}
              <Link to="/mi-entrada">Mi entrada</Link>.
            </p>
            <Ticket data={{
              participantName: `${done.firstName} ${done.lastName}`,
              eventName: event.name,
              eventDate: event.date,
              location: event.location,
              code: done.qrCode,
              typeLabel,
            }} />
            <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
              <button className="btn" onClick={() => setDone(null)}>Registrar a otra persona</button>
            </div>
          </Card>
        )}

        {!finished && !done && (
          <Card title={event.status === 'active' ? 'Inscríbete ahora' : 'Pre-inscríbete al evento'}>
            <ParticipantForm
              event={event}
              defaultSource={event.status === 'active' ? 'Inscripción web' : 'Preinscripción web'}
              submitLabel={event.status === 'active' ? 'Inscribirme' : 'Pre-inscribirme'}
              onSubmit={async (data: ParticipantInput) => setDone(await participantService.create(data))}
            />
            <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
              <Search size={13} style={{ verticalAlign: 'middle' }} /> ¿Ya te inscribiste? <Link to="/mi-entrada">Recupera tu entrada</Link>.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
