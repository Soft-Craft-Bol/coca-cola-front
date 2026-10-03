import { api } from '@/shared/services/api'
import type { EventMetrics, OverviewMetrics } from '@/shared/types'

export const dashboardService = {
  overview: () => api.get<OverviewMetrics>('/metrics/overview'),
  event: (eventId: string) => api.get<EventMetrics>(`/metrics/events/${eventId}`),
}
