import { api } from '@/shared/services/api'
import type { AffinityReport, AttendanceForecast, InsightSummary, Recommendation, Segment } from '@/shared/types'

const q = (eventId?: string) => (eventId ? `?eventId=${eventId}` : '')

export interface ChatTurn {
  role: 'user' | 'assistant'
  text: string
}

export const insightsService = {
  chat: (message: string, history: ChatTurn[]) => api.post<{ answer: string; source: 'ia' | 'local' }>('/chat', { message, history }),
  segments: (eventId?: string) => api.get<Segment[]>(`/insights/segments${q(eventId)}`),
  affinity: (eventId?: string, limit = 20) => api.get<AffinityReport>(`/insights/affinity?limit=${limit}${eventId ? `&eventId=${eventId}` : ''}`),
  forecast: () => api.get<AttendanceForecast[]>('/insights/forecast'),
  recommendations: (eventId?: string) => api.get<Recommendation[]>(`/insights/recommendations${q(eventId)}`),
  predictionAnalysis: (eventId?: string) => api.get<{ text: string; source: 'ia' | 'local' }>(`/insights/predictions/analysis${q(eventId)}`),
  narrate: (text: string) => api.audio('/insights/narrate', { text }),
  summary: (eventId?: string, ai = false) => api.get<InsightSummary>(`/insights/summary?ai=${ai}${eventId ? `&eventId=${eventId}` : ''}`),
}
