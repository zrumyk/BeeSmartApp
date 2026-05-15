import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

function ProtectedRoute({ allowedRoles }) {
  const location = useLocation()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const role = useAuthStore((state) => state.role ?? state.user?.role)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!role) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        Завантаження профілю...
      </section>
    )
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute