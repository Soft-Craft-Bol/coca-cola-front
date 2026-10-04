import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Card, ErrorBox, Field, Loading, ProgressBar } from '@/shared/components/ui'
import { useAsync } from '@/shared/hooks/useAsync'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { userService } from '@/features/users/services/userService'
import { useToast } from '@/shared/components/Toast'
import { formatDateTime } from '@/shared/utils/format'
import { api } from '@/shared/services/api'
import type { User } from '@/shared/types'

interface Settings {
  organizerUserId: string | null
  managerUserId: string | null
  registrationGoal: number
  attendanceGoal: number
  conversionGoal: number
  lowNpsThreshold: number
}
interface Overview {
  settings: Settings
  organizerName: string | null
  managerName: string | null
  configured: boolean
  registered: number
  attended: number
  conversions: number
}
interface Note { id: string; authorName: string; createdAt: string; text: string }

export default function EventOperationsPanel({ eventId, onSaved }: { eventId: string; onSaved: () => void }) {
  const { can } = useAuth()
  const admin = can('admin')
  const { data, loading, error, reload } = useAsync(() => api.get<Overview>(`/events/${eventId}/operations`), [eventId])
  const people = useAsync(() => admin ? userService.list() : Promise.resolve([] as User[]), [admin])
  const notes = useAsync(() => api.get<Note[]>(`/events/${eventId}/notes`), [eventId])
  const [editing, setEditing] = useState<boolean | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [noteError, setNoteError] = useState<Error | null>(null)
  const toast = useToast()

  const addNote = async (e: FormEvent) => {
    e.preventDefault()
    if (busy || !text.trim()) return
    setBusy(true); setNoteError(null)
    try {
      await api.post(`/events/${eventId}/notes`, { text: text.trim() })
      setText(''); await notes.reload()
      toast.success('Observación registrada')
    } catch (err) { setNoteError(err as Error) } finally { setBusy(false) }
  }

  if (loading) return <Loading />
  if (error) return <ErrorBox error={error} />
  if (!data) return null
  const showForm = editing ?? (admin && !data.configured)
  const goals = [
    { label: 'Participantes registrados', actual: data.registered, goal: data.settings.registrationGoal },
    { label: 'Asistentes', actual: data.attended, goal: data.settings.attendanceGoal },
    { label: 'Personas con conversión explícita', actual: data.conversions, goal: data.settings.conversionGoal },
  ]

  return <div className="stack" style={{ marginTop: 20 }}>
    <Card title="Equipo responsable y metas" actions={admin && !showForm && <button className="btn" onClick={() => setEditing(true)}>Configurar</button>}>
      {showForm ? <SettingsForm initial={data.settings} users={people.data ?? []} loadingUsers={people.loading} usersError={people.error}
        onCancel={() => setEditing(false)} onSave={async (settings) => {
          await api.put(`/events/${eventId}/operations`, settings)
          setEditing(false); await reload(); onSaved(); toast.success('Responsables y metas guardados')
        }} /> : <div className="stack">
        {!data.configured && <p className="muted">Pendiente de asignación de usuarios. Las metas mostradas son los valores iniciales; un administrador puede configurarlas.</p>}
        <div className="grid cols-2">
          <div><strong>Organizador</strong><p>{data.organizerName || 'Sin asignar'}</p></div>
          <div><strong>Responsable</strong><p>{data.managerName || 'Sin asignar'}</p></div>
        </div>
        <div className="grid cols-3">
          {goals.map((g) => <div key={g.label} className="stack" style={{ gap: 8 }}>
            <span>{g.label}</span><strong>{g.actual} / {g.goal || 'Sin meta'}</strong>
            {g.goal > 0 && <><ProgressBar value={Math.min(100, g.actual / g.goal * 100)} /><small>{g.actual >= g.goal ? 'Meta alcanzada' : `${Math.round(g.actual / g.goal * 100)} % completado`}</small></>}
          </div>)}
        </div>
        <p className="muted" style={{ fontSize: 13 }}>Alerta por respuesta NPS de {data.settings.lowNpsThreshold} o menos. Las conversiones de esta meta cuentan personas con una acción marcada expresamente como conversión.</p>
      </div>}
    </Card>
    <Card title="Observaciones operativas">
      {can('admin', 'organizer') && <form className="stack" onSubmit={addNote} style={{ marginBottom: 20 }}>
        <Field label="Nueva observación"><textarea required maxLength={2000} rows={3} value={text} disabled={busy} onChange={(e) => setText(e.target.value)} placeholder="Incidencias, acuerdos o pendientes del evento…" /></Field>
        <div className="row spread"><small className="muted">{text.length}/2000 · Se guardará con tu nombre y fecha.</small><button className="btn primary" disabled={busy || !text.trim()}>{busy ? 'Guardando…' : 'Agregar observación'}</button></div>
        <ErrorBox error={noteError} />
      </form>}
      <ErrorBox error={notes.error} />
      {notes.loading ? <Loading /> : <div className="stack">
        {!notes.error && !notes.data?.length && <p className="muted">Todavía no hay observaciones.</p>}
        {notes.data?.map((note) => <article key={note.id} style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          <div className="row spread"><strong>{note.authorName}</strong><small className="muted">{formatDateTime(note.createdAt)}</small></div>
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginBottom: 0 }}>{note.text}</p>
        </article>)}
      </div>}
    </Card>
  </div>
}

function SettingsForm({ initial, users, loadingUsers, usersError, onSave, onCancel }: {
  initial: Settings; users: User[]; loadingUsers: boolean; usersError: Error | null
  onSave: (settings: Settings) => Promise<void>; onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const eligible = users.filter((u) => u.active && (u.role === 'admin' || u.role === 'organizer'))
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true); setError(null)
    try { await onSave(form) } catch (err) { setError(err as Error) } finally { setBusy(false) }
  }
  return <form className="stack" onSubmit={submit}>
    <ErrorBox error={error || usersError} />
    <p className="muted">Selecciona usuarios activos. Los organizadores podrán consultar y operar solo los eventos donde estén asignados. Administradores y marketing conservan su acceso general.</p>
    <div className="form-grid">
      {([['organizerUserId', 'Organizador'], ['managerUserId', 'Responsable']] as const).map(([key, label]) =>
        <Field label={label} key={key}><select required value={form[key] ?? ''} disabled={busy || loadingUsers} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
          <option value="">Selecciona un usuario…</option>
          {form[key] && !eligible.some((u) => u.id === form[key]) && <option value={form[key]!} disabled>Usuario no disponible: selecciona otro</option>}
          {eligible.map((u) => <option key={u.id} value={u.id}>{u.name} · {u.role === 'admin' ? 'Administrador' : 'Organizador'}</option>)}
        </select></Field>)}
      {([['registrationGoal', 'Meta de registros'], ['attendanceGoal', 'Meta de asistentes'], ['conversionGoal', 'Meta de personas con conversión'], ['lowNpsThreshold', 'Alerta NPS: respuesta menor o igual a']] as const).map(([key, label]) =>
        <Field label={label} key={key}><input required type="number" min={0} max={key === 'lowNpsThreshold' ? 10 : 2147483647} step={1} value={form[key]} disabled={busy} onChange={(e) => setForm({ ...form, [key]: e.target.value === '' ? '' : Number(e.target.value) } as Settings)} /></Field>)}
    </div>
    <p className="muted" style={{ fontSize: 13 }}>Una meta en 0 desactiva su aviso. Registros y asistencia avisan al 50 % y al 100 %; conversiones al alcanzar la meta. Los cambios aplican a nuevas operaciones, sin enviar avisos retroactivos.</p>
    <p className="muted" style={{ fontSize: 13 }}>Puedes crear los usuarios que faltan en <Link to="/usuarios">Usuarios</Link>.</p>
    <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" disabled={busy} onClick={onCancel}>Cancelar</button><button className="btn primary" disabled={busy || loadingUsers || !!usersError || !eligible.some((u) => u.id === form.organizerUserId) || !eligible.some((u) => u.id === form.managerUserId)}>{busy ? 'Guardando…' : 'Guardar configuración'}</button></div>
  </form>
}
