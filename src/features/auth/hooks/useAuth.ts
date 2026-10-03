import { useAuthStore } from '@/app/store'
import { ROLES } from '@/shared/constants'
import type { Role, User } from '@/shared/types'

/** Usuario autenticado; solo para componentes dentro de rutas protegidas. */
export function useCurrentUser(): User {
  const user = useAuthStore((s) => s.user)
  if (!user) throw new Error('Sin sesión activa')
  return user
}

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  return {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === ROLES.ADMIN,
    can: (...roles: Role[]) => user !== null && roles.includes(user.role),
  }
}
