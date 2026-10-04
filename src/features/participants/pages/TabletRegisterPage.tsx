import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import logo from '@/assets/coca-cola-logo.png'
import { ErrorBox, Loading } from '@/shared/components/ui'
import { formatDateTime } from '@/shared/utils/format'
import { useEvent } from '@/features/events/hooks/useEvents'
import type { Participant, ParticipantInput } from '@/shared/types'
import ParticipantForm from '../components/ParticipantForm'
import Ticket from '../components/Ticket'
import { participantService } from '../services/participantService'
import '@/styles/tablet.css'

const RESET_SECONDS = 20

// Registro en sitio para una tablet del evento: formulario a pantalla completa que se reinicia solo para la siguiente persona
export default function TabletRegisterPage() {
  const { eventId = '' } = useParams()
  const { data: event, loading, error } = useEvent(eventId)
  const [done, setDone] = useState<Participant | null>(null)
  const [left, setLeft] = useState(RESET_SECONDS)

  useEffect(() => {
    if (!done) return
    setLeft(RESET_SECONDS)
    const t = window.setInterval(() => setLeft((s) => s - 1), 1000)
    return () => window.clearInterval(t)
  }, [done])
  useEffect(() => { if (done && left <= 0) setDone(null) }, [done, left])

  if (loading) return <div className="public-page"><Loading /></div>
  if (error) return <div className="public-page"><ErrorBox error={error} /></div>
  if (!event) return <div className="public-page"><Loading /></div>

  if (event.status === 'finished') {
    return (
      <div className="public-page"><div className="tb-card">
        <h1>Este evento ya finalizó</h1>
        <p className="muted">Las inscripciones están cerradas.</p>
        <Link className="btn primary" to="/">Ir a la página principal</Link>
      </div></div>
    )
  }

  return (
    <div className="public-page tb-page">
      <div className="tb-card stack">
        <div className="tb-head">
          <img className="public-logo" src={logo} alt="Coca-Cola" />
          <div>
            <h1>{event.name}</h1>
            <p className="muted">{formatDateTime(event.date)} · {event.location}</p>
          </div>
        </div>

        {done ? (
          <div className="tb-done" role="status">
            <CheckCircle2 size={48} aria-hidden="true" />
            <h2>¡Listo, {done.firstName}! Ya estás inscrito</h2>
            <p>Presenta este código en el ingreso. También puedes recuperarlo con tu correo o celular en <strong>Mi entrada</strong>.</p>
            <Ticket data={{
              participantName: `${done.firstName} ${done.lastName}`,
              eventName: event.name,
              eventDate: event.date,
              location: event.location,
              code: done.qrCode,
              typeLabel: event.status === 'active' ? 'Inscripción' : 'Pre-inscripción',
            }} />
            <button type="button" className="btn primary tb-next" onClick={() => setDone(null)}>Registrar a otra persona</button>
            <p className="muted">La pantalla se reiniciará en {Math.max(left, 0)} s.</p>
          </div>
        ) : (
          <ParticipantForm
            event={event}
            defaultSource="Tablet en sitio"
            submitLabel="Inscribirme"
            onSubmit={async (data: ParticipantInput) => setDone(await participantService.create(data))}
          />
        )}
      </div>
    </div>
  )
}
