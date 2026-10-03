import { api } from '@/shared/services/api'
import type { CcEvent, EventInput, Product } from '@/shared/types'

export const eventService = {
  list: () => api.get<CcEvent[]>('/events'),
  get: (id: string) => api.get<CcEvent>(`/events/${id}`),
  create: (data: EventInput) => api.post<CcEvent>('/events', data),
  update: (id: string, data: EventInput) => api.put<CcEvent>(`/events/${id}`, data),
  remove: (id: string) => api.delete(`/events/${id}`),
  // Imagen del evento: el backend la guarda en Cloudinary (y elimina la anterior)
  uploadImage: (id: string, file: File) => {
    const data = new FormData()
    data.append('file', file)
    return api.upload<CcEvent>(`/events/${id}/image`, data)
  },
  removeImage: (id: string) => api.delete<CcEvent>(`/events/${id}/image`),
  products: () => api.get<Product[]>('/products'),
}
