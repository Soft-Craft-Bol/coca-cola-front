import { useState, type FormEvent } from 'react'
import { ErrorBox, Field } from '@/shared/components/ui'
import type { Product } from '@/shared/types'
import type { ProductInput } from '../services/catalogService'

const PRESENTATIONS = ['Lata 250 ml', 'Lata 330 ml', 'Botella 350 ml', 'Botella 500 ml', 'Botella 600 ml', 'Botella 1 L', 'Botella 1,5 L', 'Botella 2 L', 'Botella 3 L']

interface Props {
  initial?: Product
  categories: string[]
  presentations: string[]
  onSubmit: (data: ProductInput) => Promise<void>
  onCancel: () => void
}

export default function ProductForm({ initial, categories, presentations, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ProductInput>({
    name: initial?.name ?? '', category: initial?.category ?? '', flavor: initial?.flavor ?? '',
    presentation: initial?.presentation ?? '', archived: initial?.archived ?? false,
  })
  const [error, setError] = useState<Error | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof Omit<ProductInput, 'archived'>) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })
  const suggestions = [...new Set([...presentations, ...PRESENTATIONS])]

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
        <Field label="Producto o marca" hint="(ej. Coca-Cola)"><input required maxLength={120} value={form.name} onChange={set('name')} /></Field>
        <Field label="Categoría" hint="(ej. Cola, Frutas, Agua)">
          <input required maxLength={100} list="catalog-categories" value={form.category} onChange={set('category')} />
          <datalist id="catalog-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Sabor" hint="(ej. Original, Zero, Naranja)"><input maxLength={100} value={form.flavor} onChange={set('flavor')} /></Field>
        <Field label="Presentación" hint="(ej. Lata 330 ml)">
          <input maxLength={100} list="catalog-presentations" value={form.presentation} onChange={set('presentation')} />
          <datalist id="catalog-presentations">{suggestions.map((p) => <option key={p} value={p} />)}</datalist>
        </Field>
        <label className="check full">
          <input type="checkbox" checked={form.archived} onChange={(e) => setForm({ ...form, archived: e.target.checked })} />
          Archivado (no se podrá agregar a eventos nuevos; los datos históricos se conservan)
        </label>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
        <button className="btn primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar producto'}</button>
      </div>
    </form>
  )
}
