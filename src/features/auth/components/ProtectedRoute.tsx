import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '@/shared/types'
import { useAuth } from '../hooks/useAuth'

// Exige sesión y, opcionalmente, uno de los roles indicados
export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/panel" replace />
  return <Outlet />
}
