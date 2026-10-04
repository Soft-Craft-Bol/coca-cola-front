import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Columns3, LayoutGrid, Plus } from 'lucide-react'
import { usePagination } from '@/shared/hooks/usePagination'
import Pagination from '@/shared/components/Pagination'
import { ErrorBox, Loading, Modal, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import type { CcEvent, EventStatus } from '@/shared/types'
import { EVENT_STATUS } from '@/shared/constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import EventCard from '../components/EventCard'
import EventBoard from '../components/EventBoard'
import EventForm, { type EventFormValues } from '../components/EventForm'
import { useEvents } from '../hooks/useEvents'
import { eventService } from '../services/eventService'

export default function EventsPage() {
  const navigate = useNavigate()
  const { data: events, loading, error, reload } = useEvents()
  const { can } = useAuth()
  const toast = useToast()
  const [view, setView] = useState<'board' | 'cards'>('board')
  const [statuses, setStatuses] = useState<Record<string, EventStatus>>({})
  const [pendingId, setPendingId] = useState<string | null>(null)
  const moving = useRef(false)
  const visibleEvents = (events ?? []).map((event) => ({ ...event, status: statuses[event.id] ?? event.status }))
  const pg = usePagination(visibleEvents, 6)
  const [editing, setEditing] = useState<Partial<CcEvent> | null>(null)
  const canEdit = can('admin')

  const move = async (event: CcEvent, status: EventStatus) => {
    if (!canEdit || moving.current || event.status === status) return
    moving.current = true
    setPendingId(event.id)
    setStatuses((current) => ({ ...current, [event.id]: status }))
    try {
      // Obtener los datos vigentes antes de actualizar mediante el endpoint existente.
      const current = await eventService.get(event.id)
      await eventService.update(event.id, {
        name: current.name, type: current.type, date: current.date, location: current.location,
        organizer: current.organizer, manager: current.manager, description: current.description,
        objective: current.objective, campaign: current.campaign, budget: current.budget,
        expected: current.expected, channel: current.channel, productIds: current.productIds, experienceIds: current.experienceIds ?? [], status,
      })
      toast.success(`${event.name}: ${EVENT_STATUS[status]}`)
    } catch (err) {
      setStatuses((current) => ({ ...current, [event.id]: event.status }))
      toast.error(`No se pudo cambiar el estado: ${(err as Error).message}`)
    } finally {
      moving.current = false
      setPendingId(null)
    }
  }

  const save = async (form: EventFormValues) => {
    const { id, imageFile, removeImage, ...payload } = form
    const saved = id ? await eventService.update(id, payload) : await eventService.create(payload)

    // La imagen va aparte: el backend la sube a Cloudinary (y borra la anterior al reemplazarla o quitarla)
    let imageError: string | null = null
    try {
      if (imageFile) await eventService.uploadImage(saved.id, imageFile)
      else if (removeImage) await eventService.removeImage(saved.id)
    } catch (err) {
      imageError = (err as Error).message
    }

    if (imageError) toast.error(`Evento guardado, pero la imagen falló: ${imageError}`)
    else toast.success('Evento guardado')
    setEditing(null)
    setStatuses((current) => ({ ...current, [saved.id]: saved.status }))
    reload()
    if (!id) navigate(`/eventos/${saved.id}`)
  }

  const remove = async (ev: CcEvent) => {
    if (!confirm(`¿Eliminar "${ev.name}" y todos sus datos${ev.imageUrl ? ' (incluida su imagen)' : ''}?`)) return
    await eventService.remove(ev.id)
    toast.success('Evento eliminado')
    reload()
  }

  return (
    <>
      <PageHeader
        title="Eventos"
        subtitle="Planifica y administra los eventos especiales"
        actions={canEdit && <button disabled={!!pendingId} className="btn primary icon-inline" onClick={() => setEditing({})}><Plus size={16} /> Nuevo evento</button>}
      />
      <div className="events-toolbar">
        <p>{view === 'board' && canEdit ? 'Arrastra desde la parte superior de la tarjeta o usa «Mover a».' : `${visibleEvents.length} eventos`}</p>
        <div className="events-view-toggle" role="group" aria-label="Vista de eventos">
          <button className={`btn icon-inline ${view === 'board' ? 'primary' : ''}`} aria-pressed={view === 'board'} onClick={() => setView('board')}><Columns3 size={16} /> Tablero</button>
          <button className={`btn icon-inline ${view === 'cards' ? 'primary' : ''}`} aria-pressed={view === 'cards'} onClick={() => setView('cards')}><LayoutGrid size={16} /> Tarjetas</button>
        </div>
      </div>
      <ErrorBox error={error} />
      {!loading && !error && can('organizer') && !visibleEvents.length && <p className="event-column-empty">No tienes eventos asignados. Un administrador debe agregarte como organizador o responsable desde la ficha del evento.</p>}
      {loading ? <Loading /> : (
        <>
          {view === 'board' ? <EventBoard events={visibleEvents} canEdit={canEdit} pendingId={pendingId}
            onMove={move} onEdit={setEditing} onDelete={remove} /> : <>
          {!visibleEvents.length && <p className="event-column-empty">Todavía no hay eventos.</p>}
          <div className="grid cols-3">
            {pg.pageItems.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onEdit={canEdit && !pendingId ? () => setEditing(ev) : undefined}
                onDelete={canEdit && !pendingId ? () => remove(ev) : undefined}
                busy={!!pendingId}
                onStatusChange={canEdit ? (status) => move(ev, status) : undefined}
              />
            ))}
          </div>
          <Pagination p={pg} sizes={[3, 6, 9, 12]} />
          </>}
        </>
      )}
      {editing && (
        <Modal title={editing.id ? 'Editar evento' : 'Nuevo evento'} onClose={() => setEditing(null)}>
          <EventForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  )
}
