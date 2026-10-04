import { useEffect, useState } from 'react'
import type { Participant, ParticipantInput } from '@/shared/types'
import { Check, MessageCircle } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import Pagination from '@/shared/components/Pagination'
import { Badge, Card, ErrorBox, Loading, Modal, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { formatDateTime } from '@/shared/utils/format'
import { downloadCsv, type CsvColumn } from '@/shared/utils/csv'
import { useAuth } from '@/features/auth/hooks/useAuth'
import EventSelector from '@/features/events/components/EventSelector'
import ParticipantForm from '../components/ParticipantForm'
import Ticket from '../components/Ticket'
import { participantService } from '../services/participantService'

const CSV_COLUMNS: CsvColumn<Participant>[] = [
  { label: 'Nombre', value: (p) => `${p.firstName} ${p.lastName}` },
  { label: 'Celular', value: (p) => p.phone },
  { label: 'Correo', value: (p) => p.email },
  { label: 'Ciudad', value: (p) => p.city },
  { label: 'Edad', value: (p) => p.ageRange },
  { label: 'Recurrente', value: (p) => (p.isReturning ? 'Sí' : 'No') },
  { label: 'Consentimiento', value: (p) => (p.consent ? 'Sí' : 'No') },
  { label: 'Fuente', value: (p) => p.source },
  { label: 'Campaña', value: (p) => p.campaign },
  { label: 'Código QR', value: (p) => p.qrCode },
  { label: 'Ingreso', value: (p) => p.checkedInAt ?? '' },
]

// Enlace "click to chat" de WhatsApp (no requiere API): abre la conversación con el mensaje listo
const whatsappLink = (p: Participant, eventName = 'el evento') => {
  const digits = p.phone.replace(/\D/g, '')
  const phone = digits.length === 8 ? `591${digits}` : digits
  const text = `Hola ${p.firstName}, tu código de ingreso para ${eventName} es ${p.qrCode}. Preséntalo en la entrada.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export default function ParticipantsPage() {
  const { eventId, setEventId, event } = useSelectedEvent()
  const { can } = useAuth()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<Error | null>(null)
  const [adding, setAdding] = useState(false)
  const [badge, setBadge] = useState<Participant | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => { setQuery(search.trim()); setPage(1) }, 300)
    return () => clearTimeout(timer)
  }, [search])
  const { data, loading, error, reload } = useAsync(() => eventId
    ? participantService.page(eventId, query, page - 1, pageSize)
    : Promise.resolve({ content: [], totalElements: 0, totalPages: 0, number: 0 }), [eventId, query, page, pageSize])
  const total = data?.totalElements ?? 0
  const totalPages = Math.max(1, data?.totalPages ?? 1)
  useEffect(() => {
    if (!loading && data && page > totalPages) setPage(totalPages)
  }, [loading, data, page, totalPages])
  const pg = {
    pageItems: data?.content ?? [], page, pageSize, total, totalPages,
    from: total ? (page - 1) * pageSize + 1 : 0, to: Math.min(page * pageSize, total),
    setPage, setPageSize: (size: number) => { setPageSize(size); setPage(1) }, reset: () => setPage(1),
  }

  const exportCsv = async () => {
    setExporting(true)
    setExportError(null)
    try {
      const rows: Participant[] = []
      let index = 0
      let pages = 1
      do {
        const result = await participantService.page(eventId, query, index++, 100)
        rows.push(...result.content)
        pages = result.totalPages
      } while (index < pages)
      downloadCsv(`participantes-${eventId}.csv`, rows, CSV_COLUMNS)
    } catch (e) {
      setExportError(e as Error)
    } finally {
      setExporting(false)
    }
  }

  const create = async (data: ParticipantInput) => {
    const p = await participantService.create(data)
    toast.success('Participante registrado')
    setAdding(false)
    setBadge(p)
    reload()
  }

  const remove = async (p: Participant) => {
    if (!confirm(`¿Eliminar a ${p.firstName}?`)) return
    await participantService.remove(p.id)
    toast.success('Participante eliminado')
    reload()
  }

  return (
    <>
      <PageHeader
        title="Participantes"
        subtitle="Registro y consulta de asistentes por evento"
        actions={
          <>
            <EventSelector value={eventId} onChange={(id) => { setEventId(id); setPage(1) }} />
            <button className="btn" disabled={!total || loading || exporting || query !== search.trim()} onClick={exportCsv}>{exporting ? 'Exportando…' : 'Exportar CSV'}</button>
            {can('admin', 'organizer') && <button className="btn primary" onClick={() => setAdding(true)}>+ Registrar</button>}
          </>
        }
      />
      <Card>
        <div className="row spread" style={{ marginBottom: 12 }}>
          <input placeholder="Buscar por nombre, correo, celular o código…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
          <span className="muted">{total} participantes</span>
        </div>
        <ErrorBox error={error || exportError} />
        {loading ? <Loading /> : (
          <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nombre</th><th>Contacto</th><th>Ciudad</th><th>Tipo</th><th>Consent.</th><th>Fuente</th><th>Asistencia</th><th /></tr>
              </thead>
              <tbody>
                {pg.pageItems.map((p) => (
                  <tr key={p.id}>
                    <td>{p.firstName} {p.lastName}<br /><span className="muted" style={{ fontSize: 12 }}>{p.ageRange} años</span></td>
                    <td>{p.email}<br /><span className="muted" style={{ fontSize: 12 }}>{p.phone}</span></td>
                    <td>{p.city}</td>
                    <td><Badge tone={p.isReturning ? 'red' : ''}>{p.isReturning ? 'Recurrente' : 'Nuevo'}</Badge></td>
                    <td>{p.consent ? <Check size={16} /> : '—'}</td>
                    <td>{p.source}</td>
                    <td>{p.checkedInAt ? <Badge tone="green">{formatDateTime(p.checkedInAt)}</Badge> : <Badge tone="amber">Pendiente</Badge>}</td>
                    <td className="row" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn small" onClick={() => setBadge(p)}>QR</button>
                      <a className="btn small icon-btn" href={whatsappLink(p, event?.name)} target="_blank" rel="noreferrer" title="Enviar su código por WhatsApp" aria-label="Enviar por WhatsApp"><MessageCircle size={14} /></a>
                      {can('admin') && <button className="btn small danger" onClick={() => remove(p)}>Eliminar</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!pg.pageItems.length && <div className="empty">No hay participantes registrados</div>}
          </div>
          <Pagination p={pg} />
          </>
        )}
      </Card>
      {adding && event && (
        <Modal title={`Registrar participante · ${event.name}`} onClose={() => setAdding(false)}>
          <ParticipantForm event={event} onSubmit={create} />
        </Modal>
      )}
      {badge && event && (
        <Modal title="Entrada del participante" onClose={() => setBadge(null)}>
          <Ticket data={{
            participantName: `${badge.firstName} ${badge.lastName}`,
            eventName: event.name,
            eventDate: event.date,
            location: event.location,
            code: badge.qrCode,
            typeLabel: event.status === 'active' ? 'Inscripción' : 'Pre-inscripción',
          }} />
          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
            <button className="btn primary" onClick={() => setBadge(null)}>Cerrar</button>
          </div>
        </Modal>
      )}
    </>
  )
}
