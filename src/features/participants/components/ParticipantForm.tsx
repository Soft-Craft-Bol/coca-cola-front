import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { CcEvent, ParticipantInput } from '@/shared/types'
import { ErrorBox, Field } from '@/shared/components/ui'
import { AGE_RANGES, CITIES, SOURCES } from '@/shared/constants'
import { useProducts } from '@/features/events/hooks/useEvents'
import { productLabel } from '@/shared/utils/catalog'

// Formulario único de registro (uso interno y página pública)
interface Props {
  event: CcEvent
  defaultSource?: string
  onSubmit: (data: ParticipantInput) => Promise<void>
  submitLabel?: string
}

export default function ParticipantForm({ event, defaultSource = SOURCES[2], onSubmit, submitLabel = 'Registrar' }: Props) {
  const { data: products } = useProducts()
  const [form, setForm] = useState<Omit<ParticipantInput, 'eventId'>>({
    firstName: '', lastName: '', phone: '', email: '', city: CITIES[0], ageRange: AGE_RANGES[1],
    preferences: [], consent: false, source: defaultSource,
  })
  const [error, setError] = useState<Error | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (k: 'firstName' | 'lastName' | 'phone' | 'email' | 'city' | 'ageRange') => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })
  const eventProducts = products?.filter((p) => event?.productIds?.includes(p.id)) ?? []
  const togglePref = (id: string) =>
    setForm({
      ...form,
      preferences: form.preferences.includes(id) ? form.preferences.filter((x) => x !== id) : [...form.preferences, id],
    })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await onSubmit({ ...form, eventId: event.id })
      setForm((f) => ({ ...f, firstName: '', lastName: '', phone: '', email: '', preferences: [], consent: false }))
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
        <Field label="Nombre"><input required value={form.firstName} onChange={set('firstName')} /></Field>
        <Field label="Apellido"><input required value={form.lastName} onChange={set('lastName')} /></Field>
        <Field label="Celular"><input required type="tel" pattern="[0-9 +]{7,15}" value={form.phone} onChange={set('phone')} /></Field>
        <Field label="Correo electrónico"><input required type="email" value={form.email} onChange={set('email')} /></Field>
        <Field label="Ciudad">
          <input list="cities" required value={form.city} onChange={set('city')} />
          <datalist id="cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Rango de edad">
          <select value={form.ageRange} onChange={set('ageRange')}>{AGE_RANGES.map((a) => <option key={a}>{a}</option>)}</select>
        </Field>
        {eventProducts.length > 0 && (
          <div className="field full">
            <span>¿Qué productos te interesan?</span>
            <div className="chips">
              {eventProducts.map((p) => (
                <button type="button" key={p.id} className={`chip ${form.preferences.includes(p.id) ? 'on' : ''}`} onClick={() => togglePref(p.id)}>
                  {productLabel(p)}
                </button>
              ))}
            </div>
          </div>
        )}
        <label className="check full">
          <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
          Acepto recibir comunicaciones, promociones y novedades de Coca-Cola.
        </label>
      </div>
      <button className="btn primary" disabled={busy}>{busy ? 'Guardando…' : submitLabel}</button>
    </form>
  )
}
