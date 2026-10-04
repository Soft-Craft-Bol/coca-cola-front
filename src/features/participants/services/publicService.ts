import { api } from '@/shared/services/api'
import type { PublicEvent, PublicTicket } from '@/shared/types'

export const publicService = {
  events: () => api.get<PublicEvent[]>('/public/events'),
  lookup: (contact: string) => api.post<PublicTicket[]>('/public/tickets/lookup', { contact }),
  ticket: (code: string) => api.get<PublicTicket>(`/public/tickets/${encodeURIComponent(code)}`),
}
