import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function PublicRoute({ children }: any) {
  const { user } = useAuth()

  // Si YA está logueado → redirige según rol
  if (user) {
    if (user.rol === 'ADMIN') return <Navigate to="/admin" />
    if (user.rol === 'PORTERO') return <Navigate to="/portero" />
  }

  return children
}