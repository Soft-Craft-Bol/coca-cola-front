import { useMemo, useState } from 'react'
import { Download, Mail, MessageCircle, Send, Sparkles, Users } from 'lucide-react'
import { Badge, Card, ErrorBox, Field, Loading, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import Pagination from '@/shared/components/Pagination'
import { useAsync } from '@/shared/hooks/useAsync'
import { usePagination } from '@/shared/hooks/usePagination'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { formatDateTime } from '@/shared/utils/format'
import EventSelector from '@/features/events/components/EventSelector'
import { useEvents } from '@/features/events/hooks/useEvents'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import type { Channel, MessageType, SendCommunication, SendResult } from '@/shared/types'
import { communicationService } from '../services/communicationService'

const TYPES: { value: MessageType; label: string; marketing: boolean; hint: string }[] = [
  { value: 'CONFIRMATION', label: 'Confirmación de registro (con QR)', marketing: false, hint: 'Se envía automáticamente al registrarse; aquí puedes reenviarla a quien no la recibió.' },
  { value: 'REMINDER', label: 'Recordatorio previo al evento', marketing: false, hint: 'También se envía solo 24 horas antes del evento.' },
  { value: 'THANKS', label: 'Agradecimiento y encuesta', marketing: true, hint: 'Incluye el enlace para responder la encuesta. También se envía solo el día siguiente.' },
  { value: 'INVITATION', label: 'Invitación a otro evento', marketing: true, hint: 'Invita a los participantes de este evento a registrarse en otro.' },
]

const AUDIENCES = [
  ['ALL', 'Todos los registrados'],
  ['ATTENDED', 'Solo quienes asistieron'],
  ['NOT_ATTENDED', 'Registrados que no asistieron'],
] as const

export default function CommunicationsPage() {
  const { eventId, setEventId } = useSelectedEvent('finished')
  const { data: events } = useEvents()
  const { data: participants } = useParticipants(eventId)
  const status = useAsync(() => communicationService.status(), [])
  const log = useAsync(() => (eventId ? communicationService.log(eventId, 100) : Promise.resolve([])), [eventId])
  const toast = useToast()

  const [type, setType] = useState<MessageType>('THANKS')
  const [channel, setChannel] = useState<Channel>('EMAIL')
  const [audience, setAudience] = useState<SendCommunication['audience']>('ATTENDED')
  const [target, setTarget] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [crmResult, setCrmResult] = useState<string | null>(null)

  const names = useMemo(() => new Map((participants ?? []).map((p) => [p.id, `${p.firstName} ${p.lastName}`])), [participants])
  const pg = usePagination(log.data ?? [], 8)
  const typeInfo = TYPES.find((t) => t.value === type)!
  const configured = status.data ? (channel === 'EMAIL' ? status.data.email : status.data.whatsapp) : true

  const send = async () => {
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      const r = await communicationService.send({ eventId, type, channel, audience, targetEventId: type === 'INVITATION' ? target : undefined })
      setResult(r)
      log.reload()
      if (r.sent > 0) toast.success(`${r.sent} mensajes enviados`)
    } catch (e) {
      setError(e as Error)
    } finally {
      setBusy(false)
    }
  }

  const crmSync = async () => {
    setCrmResult(null)
    try {
      const r = await communicationService.crmSync(eventId)
      setCrmResult(`${r.sent} de ${r.total} contactos enviados${r.errors ? ` (${r.errors} con error)` : ''}.`)
    } catch (e) {
      setCrmResult((e as Error).message)
    }
  }

  const download = async () => {
    try { await communicationService.crmCsv(eventId) } catch (e) { toast.error((e as Error).message) }
  }

  const channelCard = (label: string, icon: React.ReactNode, ok: boolean | undefined, hint: string) => (
    <div className="card channel-card">
      <span className={`channel-icon ${ok ? 'ok' : ''}`}>{icon}</span>
      <div>
        <strong>{label}</strong><br />
        {ok ? <Badge tone="green">Conectado</Badge> : <Badge tone="amber">Sin configurar</Badge>}
        {!ok && <p className="muted" style={{ fontSize: 12, margin: '6px 0 0' }}>{hint}</p>}
      </div>
    </div>
  )

  return (
    <>
      <PageHeader title="Comunicaciones" subtitle="Correo, WhatsApp y CRM: confirmaciones, recordatorios, encuestas e invitaciones" actions={<EventSelector value={eventId} onChange={setEventId} />} />
      <ErrorBox error={status.error} />

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        {channelCard('Correo', <Mail size={20} />, status.data?.email, 'Define spring.mail.host y las credenciales SMTP.')}
        {channelCard('WhatsApp', <MessageCircle size={20} />, status.data?.whatsapp, 'Define whatsapp.token y whatsapp.phone-number-id. Mientras tanto usa el botón de WhatsApp en Participantes.')}
        {channelCard('CRM', <Users size={20} />, status.data?.crm, 'Define crm.webhook-url (HubSpot, Zapier, Make…). Puedes descargar el CSV sin configurarlo.')}
        {channelCard('IA (Claude)', <Sparkles size={20} />, status.data?.ai, 'Define ai.anthropic.api-key. Sin ella se usa el resumen automático.')}
      </div>

      <div className="grid cols-2">
        <Card title="Enviar comunicación">
          <div className="stack">
            <Field label="Tipo de mensaje">
              <select value={type} onChange={(e) => { setType(e.target.value as MessageType); setResult(null) }}>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>{typeInfo.hint}</p>
            {type === 'INVITATION' && (
              <Field label="Evento al que invitas">
                <select value={target} onChange={(e) => setTarget(e.target.value)}>
                  <option value="">Selecciona…</option>
                  {events?.filter((e) => e.id !== eventId).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </Field>
            )}
            <div className="form-grid">
              <Field label="Canal">
                <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                  <option value="EMAIL">Correo electrónico</option>
                  <option value="WHATSAPP">WhatsApp</option>
                </select>
              </Field>
              <Field label="Destinatarios">
                <select value={audience} onChange={(e) => setAudience(e.target.value as SendCommunication['audience'])}>
                  {AUDIENCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
            </div>
            {typeInfo.marketing && <div className="ok-box" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>Este tipo de mensaje solo llega a quienes aceptaron recibir comunicaciones.</div>}
            {!configured && <div className="error-box">Este canal no está configurado en el backend, por lo que no se enviará nada.</div>}
            <ErrorBox error={error} />
            {result && (
              <div className="ok-box">
                {result.note && !result.total ? result.note : <>Destinatarios: <strong>{result.total}</strong> · enviados: <strong>{result.sent}</strong> · omitidos (ya enviados o sin contacto): {result.skipped}{result.errors ? <> · con error: <strong>{result.errors}</strong></> : null}.</>}
              </div>
            )}
            <button className="btn primary icon-inline" disabled={busy || !eventId || (type === 'INVITATION' && !target)} onClick={send}>
              <Send size={15} /> {busy ? 'Enviando…' : 'Enviar'}
            </button>
          </div>
        </Card>

        <Card title="CRM">
          <p className="muted" style={{ marginTop: 0, fontSize: 14, lineHeight: 1.6 }}>
            Solo se comparten los contactos que aceptaron recibir comunicaciones. Descarga el CSV para importarlo en tu CRM o
            sincronízalo por webhook si lo configuraste. Al registrarse, cada contacto nuevo se envía solo.
          </p>
          <div className="row">
            <button className="btn icon-inline" onClick={download}><Download size={15} /> Descargar contactos (CSV)</button>
            <button className="btn icon-inline" disabled={!status.data?.crm} onClick={crmSync}><Users size={15} /> Sincronizar con el CRM</button>
          </div>
          {crmResult && <div className="ok-box" style={{ marginTop: 12 }}>{crmResult}</div>}
        </Card>
      </div>

      <Card title="Historial de envíos" className="">
        {log.loading ? <Loading /> : (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Fecha</th><th>Participante</th><th>Canal</th><th>Mensaje</th><th>Estado</th></tr></thead>
                <tbody>
                  {pg.pageItems.map((m) => (
                    <tr key={m.id}>
                      <td>{formatDateTime(m.sentAt)}</td>
                      <td>{names.get(m.participantId) ?? '—'}</td>
                      <td>{m.channel === 'EMAIL' ? 'Correo' : 'WhatsApp'}</td>
                      <td>{TYPES.find((t) => m.type.startsWith(t.value))?.label ?? m.type}</td>
                      <td>{m.status === 'SENT' ? <Badge tone="green">Enviado</Badge> : <span title={m.detail ?? ''}><Badge tone="red">Error</Badge></span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!log.data?.length && <div className="empty">Aún no se han enviado mensajes de este evento</div>}
            </div>
            <Pagination p={pg} sizes={[8, 20, 50]} />
          </>
        )}
      </Card>
    </>
  )
}
