import { api, tokenStorage } from '@/shared/services/api'
import type { User } from '@/shared/types'

interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { token, user } = await api.post<LoginResponse>('/auth/login', { email, password })
    tokenStorage.set(token)
    return user
  },
  logout() {
    tokenStorage.clear()
  },
}
