import { useEvents } from '../hooks/useEvents'

// Selector reutilizable de evento. `value` es el id; `onChange` recibe el id.
export default function EventSelector({ value, onChange, allowAll = false }: { value?: string; onChange: (id: string) => void; allowAll?: boolean }) {
  const { data: events } = useEvents()
  return (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={{ minWidth: 240, width: 'auto' }}>
      {allowAll && <option value="">Todos los eventos</option>}
      {!allowAll && !value && <option value="">Selecciona un evento…</option>}
      {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
    </select>
  )
}
