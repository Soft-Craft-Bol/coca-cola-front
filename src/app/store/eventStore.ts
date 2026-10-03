import { create } from 'zustand'

const KEY = 'cc_selected_event'
const read = () => {
  try { return localStorage.getItem(KEY) ?? '' } catch { return '' }
}

// Evento seleccionado, compartido entre el navbar y todas las páginas
interface EventState {
  eventId: string
  setEventId: (eventId: string) => void
}

export const useEventStore = create<EventState>((set) => ({
  eventId: read(),
  setEventId(eventId: string) {
    try { localStorage.setItem(KEY, eventId) } catch { /* sin persistencia */ }
    set({ eventId })
  },
}))
