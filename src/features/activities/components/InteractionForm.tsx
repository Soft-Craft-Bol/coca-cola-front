import { useMemo, useState, type FormEvent } from 'react'
import type { Activity, CcEvent, InteractionInput, Participant } from '@/shared/types'
import { ErrorBox, Field, Stars } from '@/shared/components/ui'
import { useProducts } from '@/features/events/hooks/useEvents'

// Registra la interacción de un asistente con una actividad (participación, degustación, canje, conversión)
interface Props {
  event: CcEvent
  activities: Activity[]
  attendees: Participant[]
  onSubmit: (data: InteractionInput) => Promise<void>
}

export default function InteractionForm({ event, activities, attendees, onSubmit }: Props) {
  const { data: products } = useProducts()
  const [participantId, setParticipantId] = useState('')
  const [activityId, setActivityId] = useState('')
  const [search, setSearch] = useState('')
  const [productId, setProductId] = useState('')
  const [rating, setRating] = useState(0)
  const [wouldBuy, setWouldBuy] = useState(true)
  const [convert, setConvert] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const activity = activities.find((a) => a.id === activityId)
  const eventProducts = products?.filter((p) => event.productIds.includes(p.id)) ?? []
  const matches = useMemo(() => {
    const q = search.trim().toLowerCase()
    return attendees.filter((p) => !q || `${p.firstName} ${p.lastName} ${p.qrCode}`.toLowerCase().includes(q)).slice(0, 6)
  }, [attendees, search])
  const participant = attendees.find((p) => p.id === participantId)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!activity) return
    setError(null)
    try {
      const base = { eventId: event.id, participantId, activityId }
      if (activity.type === 'tasting') {
        await onSubmit({ ...base, type: 'tasting', productId, rating, wouldBuy, wantsPromos: participant?.consent ?? false })
      } else if (activity.type === 'redeem') {
        await onSubmit({ ...base, type: 'redeem' })
        if (convert) await onSubmit({ ...base, type: 'conversion' })
      } else {
        await onSubmit({ ...base, type: 'activity' })
      }
      setParticipantId('')
      setSearch('')
      setRating(0)
      setProductId('')
      setConvert(false)
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <ErrorBox error={error} />
      <Field label="Actividad">
        <select required value={activityId} onChange={(e) => setActivityId(e.target.value)}>
          <option value="">Selecciona…</option>
          {activities.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Field>
      <Field label="Participante (solo asistentes con ingreso registrado)">
        {participant ? (
          <div className="row spread">
            <strong>{participant.firstName} {participant.lastName}</strong>
            <button type="button" className="btn small" onClick={() => setParticipantId('')}>Cambiar</button>
          </div>
        ) : (
          <>
            <input placeholder="Buscar nombre o código…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="chips">
              {matches.map((p) => (
                <button type="button" key={p.id} className="chip" onClick={() => setParticipantId(p.id)}>{p.firstName} {p.lastName}</button>
              ))}
              {!matches.length && <span className="muted" style={{ fontWeight: 400 }}>Sin coincidencias</span>}
            </div>
          </>
        )}
      </Field>

      {activity?.type === 'tasting' && (
        <>
          <Field label="Producto o sabor probado">
            <select required value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Selecciona…</option>
              {eventProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="¿Cómo calificaría el producto?"><Stars value={rating} onChange={setRating} /></Field>
          <label className="check"><input type="checkbox" checked={wouldBuy} onChange={(e) => setWouldBuy(e.target.checked)} /> Lo compraría después de probarlo</label>
        </>
      )}
      {activity?.type === 'redeem' && (
        <label className="check"><input type="checkbox" checked={convert} onChange={(e) => setConvert(e.target.checked)} /> Cumplió la acción objetivo de la campaña (conversión)</label>
      )}

      <button className="btn primary" disabled={!participantId || !activityId || (activity?.type === 'tasting' && !rating)}>Registrar interacción</button>
    </form>
  )
}
