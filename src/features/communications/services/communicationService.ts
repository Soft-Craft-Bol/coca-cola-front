import { api } from '@/shared/services/api'
import type { IntegrationStatus, MessageLog, SendCommunication, SendResult } from '@/shared/types'

export const communicationService = {
  status: () => api.get<IntegrationStatus>('/integrations/status'),
  testEmail: (to?: string) => api.post<{ to: string }>(`/integrations/email/test${to ? `?to=${encodeURIComponent(to)}` : ''}`),
  send: (data: SendCommunication) => api.post<SendResult>('/communications/send', data),
  log: (eventId: string, limit = 50) => api.get<MessageLog[]>(`/communications/log?eventId=${eventId}&limit=${limit}`),
  crmSync: (eventId?: string) => api.post<{ total: number; sent: number; errors: number }>(`/crm/sync${eventId ? `?eventId=${eventId}` : ''}`),
  crmCsv: (eventId?: string) => api.download(`/crm/contacts?format=csv${eventId ? `&eventId=${eventId}` : ''}`, 'contactos-crm.csv'),
}
