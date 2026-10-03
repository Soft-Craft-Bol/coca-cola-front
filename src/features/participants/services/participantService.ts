import { api } from '@/shared/services/api'
import type { Participant, ParticipantInput } from '@/shared/types'

export const participantService = {
  page: (eventId: string, search: string, page: number, size: number) =>
    api.get<{ content: Participant[]; totalElements: number; totalPages: number; number: number }>(
      `/participants/page?${new URLSearchParams({ eventId, search, page: String(page), size: String(size) })}`),
  list: (eventId?: string) => api.get<Participant[]>(`/participants${eventId ? `?eventId=${eventId}` : ''}`),
  get: (id: string) => api.get<Participant>(`/participants/${id}`),
  byCode: (code: string) => api.get<Participant>(`/participants/by-code/${encodeURIComponent(code.trim())}`),
  create: (data: ParticipantInput) => api.post<Participant>('/participants', data),
  update: (id: string, data: Partial<ParticipantInput>) => api.put<Participant>(`/participants/${id}`, data),
  remove: (id: string) => api.delete(`/participants/${id}`),
  checkIn: (id: string) => api.post<Participant>(`/participants/${id}/checkin`),
  checkOut: (id: string) => api.post<Participant>(`/participants/${id}/checkout`),
}
