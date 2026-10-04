import { useState, type FormEvent } from 'react'
import { ErrorBox, Field } from '@/shared/components/ui'
import { ACTIVITY_TYPES } from '@/shared/constants'
import type { Experience } from '@/shared/types'
import type { ExperienceInput } from '../services/catalogService'

interface Props {
  initial?: Experience
  categories: string[]
  onSubmit: (data: ExperienceInput) => Promise<void>
  onCancel: () => void
}

export default function ExperienceForm({ initial, categories, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ExperienceInput>({
    name: initial?.name ?? '', category: initial?.category ?? '', description: initial?.description ?? '', archived: initial?.archived ?? false,
  })
  const [error, setError] = useState<Error | null>(null)
  const [busy, setBusy] = useState(false)
  const suggestions = [...new Set([...Object.values(ACTIVITY_TYPES), ...categories])]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err as Error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <ErrorBox error={error} />
      <div className="form-grid">
        <Field label="Nombre de la experiencia"><input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Tipo" hint="(si coincide con un tipo de actividad, se sugiere al crearla)">
          <input required maxLength={100} list="experience-categories" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <datalist id="experience-categories">{suggestions.map((c) => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Descripción" className="full">
          <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <label className="check full">
          <input type="checkbox" checked={form.archived} onChange={(e) => setForm({ ...form, archived: e.target.checked })} />
          Archivada (no se podrá agregar a eventos nuevos; los datos históricos se conservan)
        </label>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
        <button className="btn primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar experiencia'}</button>
      </div>
    </form>
  )
}
