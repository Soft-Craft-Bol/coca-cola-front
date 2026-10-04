import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Badge, Card, ErrorBox, KpiCard, Loading, PageHeader } from '@/shared/components/ui'
import { EVENT_STATUS } from '@/shared/constants'
import { formatCurrency, formatDate, formatPercent } from '@/shared/utils/format'
import { optimizeImage } from '@/shared/utils/image'
import { useAsync } from '@/shared/hooks/useAsync'
import { dashboardService } from '@/features/dashboard/services/dashboardService'
import { useEvent, useProducts } from '../hooks/useEvents'
import EventOperationsPanel from '../components/EventOperationsPanel'

export default function EventDetailPage() {
  const { id = '' } = useParams()
  const { data: ev, loading, error, refresh } = useEvent(id)
  const { data: products } = useProducts()
  const { data: m } = useAsync(() => dashboardService.event(id), [id])

  if (loading) return <Loading />
  if (error) return <ErrorBox error={error} />
  if (!ev) return <Loading />

  const publicUrl = `${window.location.origin}/registro/${ev.id}`

  return (
    <>
      <PageHeader
        title={ev.name}
        subtitle={`${ev.type} · ${formatDate(ev.date)} · ${ev.location}`}
        actions={
          <>
            <Link className="btn icon-inline" to="/eventos"><ArrowLeft size={15} /> Volver</Link>
            <Link className="btn primary" to={`/panel?evento=${ev.id}`}>Ver panel</Link>
          </>
        }
      />
      {ev.imageUrl && (
        <img className="event-banner" src={optimizeImage(ev.imageUrl, 1200, 360)} alt={ev.name} />
      )}
      {m && (
        <div className="grid cols-4" style={{ marginBottom: 16 }}>
          <KpiCard label="Registrados" value={m.registered} hint={`Esperados: ${ev.expected}`} />
          <KpiCard label="Asistentes" value={m.attended} hint={`${formatPercent(m.attendanceRate)} de asistencia`} accent />
          <KpiCard label="Conversiones" value={m.conversions} hint={`${formatPercent(m.conversionRate)} de conversión`} />
          <KpiCard label="Satisfacción" value={m.satisfaction ? `${m.satisfaction.toFixed(1)} / 5` : '—'} hint={`NPS ${Math.round(m.nps)}`} />
        </div>
      )}
      <div className="grid cols-2">
        <Card title="Información general">
          <div className="stack" style={{ gap: 8, fontSize: 14 }}>
            <div><Badge>{EVENT_STATUS[ev.status]}</Badge></div>
            <div><strong>Organizador:</strong> {ev.organizer || 'Sin asignar'}</div>
            <div><strong>Responsable:</strong> {ev.manager || 'Sin asignar'}</div>
            <div><strong>Campaña:</strong> {ev.campaign}</div>
            <div><strong>Canal / aliado:</strong> {ev.channel || '—'}</div>
            <div><strong>Presupuesto:</strong> {formatCurrency(ev.budget)}</div>
            <div><strong>Descripción:</strong> {ev.description || '—'}</div>
            <div><strong>Objetivo:</strong> {ev.objective || '—'}</div>
            <div>
              <strong>Productos destacados:</strong>{' '}
              {ev.productIds.map((pid) => products?.find((p) => p.id === pid)?.name).filter(Boolean).join(', ') || '—'}
            </div>
          </div>
        </Card>
        <Card title="Registro público por QR">
          <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
            Comparte este código para que los asistentes se preinscriban desde su celular.
          </p>
          <div className="qr-box"><QRCodeSVG value={publicUrl} size={180} /></div>
          <p style={{ fontSize: 12, wordBreak: 'break-all' }}><a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a></p>
        </Card>
      </div>
      <EventOperationsPanel key={id} eventId={id} onSaved={refresh} />
    </>
  )
}
