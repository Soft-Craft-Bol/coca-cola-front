import { api } from '@/shared/services/api'
import type { User, UserInput } from '@/shared/types'

export const userService = {
  list: () => api.get<User[]>('/users'),
  create: (data: UserInput) => api.post<User>('/users', data),
  update: (id: string, data: Partial<UserInput>) => api.put<User>(`/users/${id}`, data),
  remove: (id: string) => api.delete(`/users/${id}`),
}
