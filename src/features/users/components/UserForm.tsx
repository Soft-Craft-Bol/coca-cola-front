import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Role, User } from '@/shared/types'
import { ErrorBox, Field } from '@/shared/components/ui'
import { ROLE_LABELS } from '@/shared/constants'

export interface UserFormValues {
  id?: string
  name: string
  email: string
  role: Role
  active: boolean
  password: string
}

interface Props {
  initial?: Partial<User>
  onSubmit: (form: UserFormValues) => Promise<void>
  onCancel: () => void
}

export default function UserForm({ initial, onSubmit, onCancel }: Props) {
  const editing = Boolean(initial?.id)
  const [form, setForm] = useState<UserFormValues>({ name: '', email: '', role: 'organizer', active: true, ...initial, password: '' })
  const [error, setError] = useState<Error | null>(null)
  const set = (k: keyof UserFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <ErrorBox error={error} />
      <div className="form-grid">
        <Field label="Nombre"><input required value={form.name} onChange={set('name')} /></Field>
        <Field label="Correo"><input type="email" required value={form.email} onChange={set('email')} /></Field>
        <Field label="Rol">
          <select value={form.role} onChange={set('role')}>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label="Contraseña" hint={editing ? '(vacío = sin cambios)' : ''}>
          <input type="password" required={!editing} minLength={6} value={form.password} onChange={set('password')} />
        </Field>
        <label className="check full"><input type="checkbox" checked={form.active} onChange={set('active')} /> Usuario activo</label>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
        <button className="btn primary">Guardar</button>
      </div>
    </form>
  )
}
