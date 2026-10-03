import { useRef, useState, type FormEvent } from 'react'
import type { Participant } from '@/shared/types'
import { CheckCircle2 } from 'lucide-react'
import { Badge, Card, ErrorBox, KpiCard, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { useLive, useLiveFlag } from '@/shared/hooks/useLive'
import LiveToggle from '@/shared/components/LiveToggle'
import { formatDateTime, formatPercent } from '@/shared/utils/format'
import EventSelector from '@/features/events/components/EventSelector'
import { participantService } from '@/features/participants/services/participantService'
import { useParticipants } from '@/features/participants/hooks/useParticipants'

// Ingreso: el lector de QR USB/Bluetooth escribe el código en el campo y envía Enter.
export default function CheckinPage() {
  const { eventId, setEventId } = useSelectedEvent()
  const { data: participants, reload, refresh } = useParticipants(eventId)
  const [live, setLive] = useLiveFlag()
  useLive(refresh, live, 5000)
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const [last, setLast] = useState<Participant | null>(null)

  const registered = participants?.length ?? 0
  const attended = participants?.filter((p) => p.checkedInAt) ?? []
  const recent = [...attended].sort((a, b) => new Date(b.checkedInAt ?? 0).getTime() - new Date(a.checkedInAt ?? 0).getTime()).slice(0, 8)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setError(null)
    try {
      const found = await participantService.byCode(code)
      if (found.eventId !== eventId) throw new Error('Este código pertenece a otro evento')
      const p = await participantService.checkIn(found.id)
      setLast(p)
      toast.success(`Bienvenido/a ${p.firstName}`)
      reload()
    } catch (err) {
      setLast(null)
      setError(err as Error)
    } finally {
      setCode('')
      inputRef.current?.focus()
    }
  }

  const checkOut = async (p: Participant) => {
    await participantService.checkOut(p.id)
    toast.success('Salida registrada')
    reload()
  }

  return (
    <>
      <PageHeader title="Control de asistencia" subtitle="Escanea el QR o escribe el código del participante" actions={<><EventSelector value={eventId} onChange={setEventId} /><LiveToggle live={live} onChange={setLive} /></>} />
      <div className="grid cols-3" style={{ marginBottom: 16 }}>
        <KpiCard label="Registrados" value={registered} />
        <KpiCard label="Asistentes" value={attended.length} accent />
        <KpiCard label="Asistencia efectiva" value={formatPercent(registered ? (attended.length / registered) * 100 : 0)} />
      </div>
      <div className="grid cols-2">
        <Card title="Escanear / ingresar código">
          <form className="stack" onSubmit={submit}>
            <input ref={inputRef} autoFocus placeholder="CC-A1B2C3D4" value={code} onChange={(e) => setCode(e.target.value)} style={{ fontSize: 20, padding: 14 }} />
            <button className="btn primary">Registrar ingreso</button>
          </form>
          <div style={{ marginTop: 14 }}>
            <ErrorBox error={error} />
            {last && (
              <div className="ok-box">
                <CheckCircle2 size={16} className="icon-inline" /> <strong>{last.firstName} {last.lastName}</strong> ingresó a las {formatDateTime(last.checkedInAt)}
                {last.isReturning && <> · <Badge tone="red">Recurrente</Badge></>}
              </div>
            )}
          </div>
        </Card>
        <Card title="Últimos ingresos">
          {recent.length === 0 ? <div className="empty">Aún no hay ingresos</div> : (
            <table>
              <tbody>
                {recent.map((p) => (
                  <tr key={p.id}>
                    <td>{p.firstName} {p.lastName}</td>
                    <td className="muted">{formatDateTime(p.checkedInAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {p.checkedOutAt ? <Badge>Salió</Badge> : <button className="btn small" onClick={() => checkOut(p)}>Registrar salida</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  )
}
