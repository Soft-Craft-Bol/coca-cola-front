import { useState, type FormEvent } from 'react'
import type { Coupon, CouponStatus } from '@/shared/types'
import { usePagination } from '@/shared/hooks/usePagination'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import Pagination from '@/shared/components/Pagination'
import { Badge, Card, ErrorBox, Field, Loading, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import { formatDateTime } from '@/shared/utils/format'
import { useAuth } from '@/features/auth/hooks/useAuth'
import EventSelector from '@/features/events/components/EventSelector'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { useCoupons } from '../hooks/useCoupons'
import { couponService } from '../services/couponService'

const STATUS_LABEL: Record<CouponStatus, string> = { issued: 'Emitido', redeemed: 'Canjeado', expired: 'Vencido' }
const STATUS_TONE: Record<CouponStatus, string> = { issued: '', redeemed: 'green', expired: 'amber' }
const FILTERS: Array<[CouponStatus | 'all', string]> = [['all', 'Todos'], ['issued', 'Emitidos'], ['redeemed', 'Canjeados'], ['expired', 'Vencidos']]

export default function CouponsPage() {
  const { eventId, setEventId, event } = useSelectedEvent()
  const { data: coupons, loading, error, reload } = useCoupons(eventId)
  const { data: participants } = useParticipants(eventId)
  const { can } = useAuth()
  const toast = useToast()
  const canManage = can('admin', 'organizer')
  const [filter, setFilter] = useState<CouponStatus | 'all'>('all')
  const [form, setForm] = useState({ participantId: '', benefit: '', validUntil: '' })
  const [formError, setFormError] = useState<Error | null>(null)

  const attendees = participants?.filter((p) => p.checkedInAt) ?? []
  const visible = (coupons ?? []).filter((c) => filter === 'all' || c.status === filter)
  const pg = usePagination(visible, 10)

  const issue = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    try {
      await couponService.issue({
        eventId,
        participantId: form.participantId,
        benefit: form.benefit,
        // La vigencia se toma hasta el final del día elegido
        validUntil: form.validUntil ? new Date(`${form.validUntil}T23:59:59`).toISOString() : null,
      })
      setForm({ participantId: '', benefit: '', validUntil: '' })
      toast.success('Cupón emitido')
      reload()
    } catch (err) {
      setFormError(err as Error)
    }
  }

  const remove = async (c: Coupon) => {
    if (!confirm(`¿Eliminar el cupón ${c.code}?`)) return
    await couponService.remove(c.id)
    reload()
  }

  return (
    <>
      <PageHeader
        title="Cupones"
        subtitle="Beneficios emitidos a participantes y canjes realizados"
        actions={<EventSelector value={eventId} onChange={setEventId} />}
      />
      <ErrorBox error={error} />

      <div className="grid cols-2">
        {canManage && event && (
          <Card title="Emitir cupón">
            <form className="stack" onSubmit={issue}>
              <ErrorBox error={formError} />
              <Field label="Participante (solo asistentes con ingreso registrado)">
                <select required value={form.participantId} onChange={(e) => setForm({ ...form, participantId: e.target.value })}>
                  <option value="">Selecciona…</option>
                  {attendees.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </Field>
              <Field label="Beneficio"><input required placeholder="Ej.: Gaseosa gratis" value={form.benefit} onChange={(e) => setForm({ ...form, benefit: e.target.value })} /></Field>
              <Field label="Vigencia hasta" hint="(opcional)">
                <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
              </Field>
              <button className="btn primary" disabled={!form.participantId || !form.benefit.trim()}>Emitir cupón</button>
            </form>
          </Card>
        )}

        <div style={canManage ? undefined : { gridColumn: '1 / -1' }}>
          <Card title="Cupones del evento">
            <div className="chips" style={{ marginBottom: 12 }}>
              {FILTERS.map(([k, label]) => (
                <button key={k} className={`chip ${filter === k ? 'on' : ''}`} onClick={() => { setFilter(k); pg.setPage(1) }}>{label}</button>
              ))}
            </div>
            {loading ? <Loading /> : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Participante</th><th>Beneficio</th><th>Código</th><th>Estado</th><th>Emitido</th><th>Canjeado</th><th>Promociones</th><th /></tr>
                    </thead>
                    <tbody>
                      {pg.pageItems.map((c) => (
                        <tr key={c.id}>
                          <td>{c.participantName ?? '—'}<div className="muted">{c.participantEmail ?? ''}</div></td>
                          <td>{c.benefit}</td>
                          <td><code>{c.code}</code></td>
                          <td><Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge></td>
                          <td>{formatDateTime(c.issuedAt)}</td>
                          <td>{c.redeemedAt ? formatDateTime(c.redeemedAt) : '—'}</td>
                          <td>{c.consent ? 'Sí' : 'No'}</td>
                          <td>
                            {canManage && c.status !== 'redeemed' && <button className="btn small danger" onClick={() => remove(c)}>Eliminar</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!visible.length && <div className="empty">Sin cupones{filter !== 'all' ? ' con este estado' : ''}</div>}
                </div>
                <Pagination p={pg} />
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
