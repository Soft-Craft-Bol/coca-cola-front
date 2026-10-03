import { api } from '@/shared/services/api'
import type { Survey, SurveyInput } from '@/shared/types'

export const surveyService = {
  list: (eventId: string) => api.get<Survey[]>(`/surveys?eventId=${eventId}`),
  create: (data: SurveyInput) => api.post<Survey>('/surveys', data),
}
