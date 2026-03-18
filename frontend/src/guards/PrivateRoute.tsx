import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export default function PrivateRoute({ children, role }: any) {
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore.persist.hasHydrated()

  if (!hasHydrated) return null

  if (!user) return <Navigate to="/login" replace />

  if (role && user.rol !== role) {
    return <Navigate to="/login" replace />
  }

  return children
}