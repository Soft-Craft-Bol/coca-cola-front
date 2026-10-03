import { api } from '@/shared/services/api'
import type { AffinityReport, AttendanceForecast, InsightSummary, Recommendation, Segment } from '@/shared/types'

const q = (eventId?: string) => (eventId ? `?eventId=${eventId}` : '')

export const insightsService = {
  segments: (eventId?: string) => api.get<Segment[]>(`/insights/segments${q(eventId)}`),
  affinity: (eventId?: string, limit = 20) => api.get<AffinityReport>(`/insights/affinity?limit=${limit}${eventId ? `&eventId=${eventId}` : ''}`),
  forecast: () => api.get<AttendanceForecast[]>('/insights/forecast'),
  recommendations: (eventId?: string) => api.get<Recommendation[]>(`/insights/recommendations${q(eventId)}`),
  summary: (eventId?: string, ai = false) => api.get<InsightSummary>(`/insights/summary?ai=${ai}${eventId ? `&eventId=${eventId}` : ''}`),
}
