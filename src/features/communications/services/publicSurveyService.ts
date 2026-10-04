import { api } from '@/shared/services/api'
import type { PublicSurveyInfo } from '@/shared/types'

export interface PublicSurveyAnswers {
  organization: number
  service: number
  experiences: number
  products: number
  overall: number
  nps: number
}

export interface PendingSurvey {
  code: string
  eventName: string
  eventDate: string | null
  answered: boolean
}

export const publicSurveyService = {
  lookup: (email: string) => api.post<PendingSurvey[]>('/public/survey/lookup', { email }),
  info: (code: string) => api.get<PublicSurveyInfo>(`/public/survey/${encodeURIComponent(code)}`),
  submit: (code: string, answers: PublicSurveyAnswers) => api.post(`/public/survey/${encodeURIComponent(code)}`, answers),
}
