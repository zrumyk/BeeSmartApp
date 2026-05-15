import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

function AuthRedirectFallback() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const role = useAuthStore((state) => state.role ?? state.user?.role)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/beekeeper" replace />
}

export default AuthRedirectFallback
