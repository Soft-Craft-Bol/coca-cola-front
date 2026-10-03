import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePagination } from '@/shared/hooks/usePagination'
import Pagination from '@/shared/components/Pagination'
import { ErrorBox, Loading, Modal, PageHeader } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import type { CcEvent } from '@/shared/types'
import { useAuth } from '@/features/auth/hooks/useAuth'
import EventCard from '../components/EventCard'
import EventForm, { type EventFormValues } from '../components/EventForm'
import { useEvents } from '../hooks/useEvents'
import { eventService } from '../services/eventService'

export default function EventsPage() {
  const { data: events, loading, error, reload } = useEvents()
  const { can } = useAuth()
  const toast = useToast()
  const pg = usePagination(events ?? [], 6)
  const [editing, setEditing] = useState<Partial<CcEvent> | null>(null)
  const canEdit = can('admin')

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
    reload()
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
        actions={canEdit && <button className="btn primary icon-inline" onClick={() => setEditing({})}><Plus size={16} /> Nuevo evento</button>}
      />
      <ErrorBox error={error} />
      {loading ? <Loading /> : (
        <>
          <div className="grid cols-3">
            {pg.pageItems.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onEdit={canEdit ? () => setEditing(ev) : undefined}
                onDelete={canEdit ? () => remove(ev) : undefined}
              />
            ))}
          </div>
          <Pagination p={pg} sizes={[3, 6, 9, 12]} />
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
