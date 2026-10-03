import { useState } from 'react'
import type { Participant, ParticipantInput } from '@/shared/types'
import { useParams } from 'react-router-dom'
import logo from '@/assets/coca-cola-logo.png'
import { Card, ErrorBox, Loading } from '@/shared/components/ui'
import { formatDate } from '@/shared/utils/format'
import { useEvent } from '@/features/events/hooks/useEvents'
import ParticipantForm from '../components/ParticipantForm'
import QrBadge from '../components/QrBadge'
import { participantService } from '../services/participantService'

// Página pública (sin login): preinscripción desde el QR del evento
export default function PublicRegisterPage() {
  const { eventId = '' } = useParams()
  const { data: event, loading, error } = useEvent(eventId)
  const [done, setDone] = useState<Participant | null>(null)

  if (loading) return <div className="public-page"><Loading /></div>
  if (error) return <div className="public-page"><ErrorBox error={error} /></div>
  if (!event) return <div className="public-page"><Loading /></div>

  return (
    <div className="public-page">
      <div className="public-card stack">
        <div className="row">
          <img className="public-logo" src={logo} alt="Coca-Cola" />
          <div>
            <h2 style={{ margin: 0 }}>{event.name}</h2>
            <span className="muted">{formatDate(event.date)} · {event.location}</span>
          </div>
        </div>
        {done ? (
          <Card title="¡Registro exitoso!">
            <p style={{ marginTop: 0 }}>Presenta este código QR en la entrada del evento.</p>
            <QrBadge participant={done} eventName={event.name} />
          </Card>
        ) : (
          <Card title="Regístrate para el evento">
            <ParticipantForm
              event={event}
              defaultSource="Preinscripción web"
              submitLabel="Quiero asistir"
              onSubmit={async (data: ParticipantInput) => setDone(await participantService.create(data))}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
