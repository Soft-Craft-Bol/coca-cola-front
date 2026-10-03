import { api } from '@/shared/services/api'
import type { EventMetrics, OverviewMetrics } from '@/shared/types'

export const reportService = {
  overview: () => api.get<OverviewMetrics>('/metrics/overview'),
  event: (id: string) => api.get<EventMetrics>(`/metrics/events/${id}`),
}
