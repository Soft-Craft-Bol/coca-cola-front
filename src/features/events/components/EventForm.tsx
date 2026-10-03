import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { CcEvent, EventInput } from '@/shared/types'
import { ErrorBox, Field } from '@/shared/components/ui'
import { CAMPAIGNS, EVENT_STATUS, EVENT_TYPES } from '@/shared/constants'
import { toInputDate } from '@/shared/utils/format'
import ImageField from './ImageField'
import { useProducts } from '../hooks/useEvents'

const EMPTY: EventInput = {
  name: '', type: EVENT_TYPES[0], date: '', location: '', organizer: '', manager: '', description: '', objective: '',
  campaign: CAMPAIGNS[0], budget: 0, expected: 0, channel: '', productIds: [], status: 'planned',
}

export type EventFormValues = EventInput & {
  id?: string
  imageFile: File | null // imagen nueva por subir
  removeImage: boolean // eliminar la imagen guardada
}

interface Props {
  initial?: Partial<CcEvent>
  onSubmit: (form: EventFormValues) => Promise<void>
  onCancel: () => void
}

export default function EventForm({ initial, onSubmit, onCancel }: Props) {
  const { data: products } = useProducts()
  const { imageUrl, ...rest } = initial ?? {}
  const [form, setForm] = useState<EventFormValues>({
    ...EMPTY, ...rest, date: toInputDate(initial?.date), imageFile: null, removeImage: false,
  })
  const [error, setError] = useState<Error | null>(null)
  const set = (k: Exclude<keyof EventInput, 'productIds' | 'budget' | 'expected'>) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value })
  const num = (k: 'budget' | 'expected') => (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: Number(e.target.value) })
  const toggleProduct = (id: string) =>
    setForm({
      ...form,
      productIds: form.productIds.includes(id) ? form.productIds.filter((x: string) => x !== id) : [...form.productIds, id],
    })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({ ...form, date: new Date(`${form.date}T10:00:00`).toISOString() })
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <ErrorBox error={error} />
      <div className="form-grid">
        <Field label="Nombre del evento" className="full"><input required value={form.name} onChange={set('name')} /></Field>
        <Field label="Tipo de evento">
          <select value={form.type} onChange={set('type')}>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <Field label="Estado">
          <select value={form.status} onChange={set('status')}>
            {Object.entries(EVENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label="Fecha"><input type="date" required value={form.date} onChange={set('date')} /></Field>
        <Field label="Lugar"><input required value={form.location} onChange={set('location')} /></Field>
        <Field label="Organizador"><input required value={form.organizer} onChange={set('organizer')} /></Field>
        <Field label="Responsable"><input required value={form.manager} onChange={set('manager')} /></Field>
        <Field label="Campaña asociada">
          <input list="campaigns" value={form.campaign} onChange={set('campaign')} />
          <datalist id="campaigns">{CAMPAIGNS.map((c) => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Canal o aliado responsable"><input value={form.channel} onChange={set('channel')} /></Field>
        <Field label="Presupuesto (COP)"><input type="number" min="0" value={form.budget} onChange={num('budget')} /></Field>
        <Field label="Participantes esperados"><input type="number" min="0" value={form.expected} onChange={num('expected')} /></Field>
        <Field label="Descripción" className="full"><textarea rows={2} value={form.description} onChange={set('description')} /></Field>
        <Field label="Objetivo" className="full"><textarea rows={2} value={form.objective} onChange={set('objective')} /></Field>
        <ImageField
          currentUrl={imageUrl}
          file={form.imageFile}
          removed={form.removeImage}
          onChange={(imageFile, removeImage) => setForm({ ...form, imageFile, removeImage })}
        />
        <div className="field full">
          <span>Productos o experiencias destacadas</span>
          <div className="chips">
            {products?.map((p) => (
              <button type="button" key={p.id} className={`chip ${form.productIds.includes(p.id) ? 'on' : ''}`} onClick={() => toggleProduct(p.id)}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
        <button className="btn primary">Guardar evento</button>
      </div>
    </form>
  )
}
