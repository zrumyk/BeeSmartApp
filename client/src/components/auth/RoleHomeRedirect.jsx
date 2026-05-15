import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

function RoleHomeRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role ?? state.user?.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!role) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        Завантаження профілю...
      </section>
    )
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  if (role === 'beekeeper') {
    return <Navigate to="/beekeeper" replace />
  }

  return <Navigate to="/login" replace />
}

export default RoleHomeRedirect
