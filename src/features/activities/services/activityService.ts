import { api } from '@/shared/services/api'
import type { Activity, ActivityInput, Interaction, InteractionInput } from '@/shared/types'

export const activityService = {
  list: (eventId: string) => api.get<Activity[]>(`/activities?eventId=${eventId}`),
  create: (data: ActivityInput) => api.post<Activity>('/activities', data),
  remove: (id: string) => api.delete(`/activities/${id}`),
  interactions: (eventId: string) => api.get<Interaction[]>(`/interactions?eventId=${eventId}`),
  addInteraction: (data: InteractionInput) => api.post<Interaction>('/interactions', data),
  removeInteraction: (id: string) => api.delete(`/interactions/${id}`),
}
