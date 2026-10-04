import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/shared/types'
import { authService } from '@/features/auth/services/authService'
import { queryClient } from '@/shared/services/queryClient'

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      async login(email: string, password: string) {
        const user = await authService.login(email, password)
        set({ user })
        return user
      },
      logout() {
        authService.logout()
        queryClient.clear()
        set({ user: null })
      },
    }),
    { name: 'cc_auth' },
  ),
)
