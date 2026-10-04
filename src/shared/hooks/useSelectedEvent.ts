import { useEffect } from 'react'
import { useEventStore } from '@/app/store'
import { useEvents } from '@/features/events/hooks/useEvents'

// Evento activo compartido (store global). Si no hay uno válido, elige el primero con estado `prefer`.
export function useSelectedEvent(prefer = 'active') {
  const { data: events } = useEvents()
  const eventId = useEventStore((s) => s.eventId)
  const setEventId = useEventStore((s) => s.setEventId)

  useEffect(() => {
    if (!events) return
    if (!events.length) { if (eventId) setEventId(''); return }
    if (!events.some((e) => e.id === eventId)) {
      setEventId((events.find((e) => e.status === prefer) ?? events[0]).id)
    }
  }, [events, eventId, prefer, setEventId])

  return { eventId, setEventId, event: events?.find((e) => e.id === eventId), events }
}
