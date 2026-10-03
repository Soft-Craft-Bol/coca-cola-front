import { api } from '@/shared/services/api'
import type { AppNotification } from '@/shared/types'

export const notificationService = {
  list: (unread = false, limit = 20) => api.get<AppNotification[]>(`/notifications?unread=${unread}&limit=${limit}`),
  count: () => api.get<{ unread: number }>('/notifications/count'),
  read: (id: string) => api.post(`/notifications/${id}/read`),
  readAll: () => api.post('/notifications/read-all'),
}
