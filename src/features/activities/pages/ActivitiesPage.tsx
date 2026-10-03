import { useState, type FormEvent } from 'react'
import type { Activity, ActivityType, InteractionInput } from '@/shared/types'
import { usePagination } from '@/shared/hooks/usePagination'
import Pagination from '@/shared/components/Pagination'
import { Badge, Card, ErrorBox, Field, Loading, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import { ACTIVITY_TYPES, INTERACTION_TYPES } from '@/shared/constants'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { formatDateTime } from '@/shared/utils/format'
import { useAuth } from '@/features/auth/hooks/useAuth'
import EventSelector from '@/features/events/components/EventSelector'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import InteractionForm from '../components/InteractionForm'
import { useActivities, useInteractions } from '../hooks/useActivities'
import { activityService } from '../services/activityService'

export default function ActivitiesPage() {
  const { eventId, setEventId, event } = useSelectedEvent()
  const { data: activities, reload: reloadActs, error } = useActivities(eventId)
  const { data: interactions, loading, reload: reloadInts } = useInteractions(eventId)
  const { data: participants } = useParticipants(eventId)
  const { can } = useAuth()
  const toast = useToast()
  const historyPg = usePagination(interactions ?? [])
  const activitiesPg = usePagination(activities ?? [], 5)
  const [tab, setTab] = useState('registrar')
  const [newAct, setNewAct] = useState<{ name: string; type: ActivityType }>({ name: '', type: 'tasting' })

  const attendees = participants?.filter((p) => p.checkedInAt) ?? []
  const nameOf = (id: string) => {
    const p = participants?.find((x) => x.id === id)
    return p ? `${p.firstName} ${p.lastName}` : '—'
  }
  const actName = (id: string | null) => activities?.find((a) => a.id === id)?.name ?? '—'

  const addInteraction = async (data: InteractionInput) => {
    await activityService.addInteraction(data)
    toast.success('Interacción registrada')
    reloadInts()
  }

  const addActivity = async (e: FormEvent) => {
    e.preventDefault()
    await activityService.create({ ...newAct, eventId })
    setNewAct({ name: '', type: 'tasting' })
    toast.success('Actividad creada')
    reloadActs()
  }

  const removeActivity = async (a: Activity) => {
    if (!confirm(`¿Eliminar "${a.name}"?`)) return
    await activityService.remove(a.id)
    reloadActs()
  }

  return (
    <>
      <PageHeader title="Actividades e interacciones" subtitle="Degustaciones, dinámicas, canjes y conversiones" actions={<EventSelector value={eventId} onChange={setEventId} />} />
      <ErrorBox error={error} />
      <div className="tabs">
        {[['registrar', 'Registrar interacción'], ['historial', 'Historial'], ['actividades', 'Actividades del evento']].map(([k, l]) => (
          <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'registrar' && event && activities && (
        <div className="grid cols-2">
          <Card title="Nueva interacción">
            {activities.length === 0
              ? <div className="empty">Primero crea actividades para este evento</div>
              : <InteractionForm event={event} activities={activities} attendees={attendees} onSubmit={addInteraction} />}
          </Card>
          <Card title="Últimas interacciones">
            {(interactions ?? []).slice(0, 8).map((i) => (
              <div key={i.id} className="row spread" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f1' }}>
                <span>{nameOf(i.participantId)} <span className="muted">· {actName(i.activityId)}</span></span>
                <Badge tone="red">{INTERACTION_TYPES[i.type]}</Badge>
              </div>
            ))}
            {!interactions?.length && <div className="empty">Sin interacciones</div>}
          </Card>
        </div>
      )}

      {tab === 'historial' && (
        <Card>
          {loading ? <Loading /> : (
            <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Hora</th><th>Participante</th><th>Actividad</th><th>Tipo</th><th>Detalle</th><th /></tr></thead>
                <tbody>
                  {historyPg.pageItems.map((i) => (
                    <tr key={i.id}>
                      <td>{formatDateTime(i.at)}</td>
                      <td>{nameOf(i.participantId)}</td>
                      <td>{actName(i.activityId)}</td>
                      <td><Badge tone="red">{INTERACTION_TYPES[i.type]}</Badge></td>
                      <td>{i.type === 'tasting' ? `${i.rating}/5 · ${i.wouldBuy ? 'Compraría' : 'No compraría'}` : '—'}</td>
                      <td>{can('admin') && <button className="btn small danger" onClick={async () => { await activityService.removeInteraction(i.id); reloadInts() }}>Quitar</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!interactions?.length && <div className="empty">Sin interacciones</div>}
            </div>
            <Pagination p={historyPg} />
            </>
          )}
        </Card>
      )}

      {tab === 'actividades' && (
        <div className="grid cols-2">
          <Card title="Actividades">
            {activitiesPg.pageItems.map((a) => (
              <div key={a.id} className="row spread" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f1' }}>
                <span><strong>{a.name}</strong> <span className="muted">· {ACTIVITY_TYPES[a.type]}</span></span>
                {can('admin', 'organizer') && <button className="btn small danger" onClick={() => removeActivity(a)}>Eliminar</button>}
              </div>
            ))}
            {!activities?.length && <div className="empty">Aún no hay actividades</div>}
            <Pagination p={activitiesPg} sizes={[5, 10, 20]} />
          </Card>
          {can('admin', 'organizer') && (
            <Card title="Nueva actividad">
              <form className="stack" onSubmit={addActivity}>
                <Field label="Nombre"><input required value={newAct.name} onChange={(e) => setNewAct({ ...newAct, name: e.target.value })} /></Field>
                <Field label="Tipo">
                  <select value={newAct.type} onChange={(e) => setNewAct({ ...newAct, type: e.target.value as ActivityType })}>
                    {Object.entries(ACTIVITY_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <button className="btn primary">Agregar actividad</button>
              </form>
            </Card>
          )}
        </div>
      )}
    </>
  )
}
