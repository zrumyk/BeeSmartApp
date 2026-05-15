import { Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'
import AdminSidebar from '../admin/AdminSidebar'

function AdminLayout() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = () => {
    clearAuth()
    toast.success('Ви вийшли з системи')
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <AdminSidebar />

        <section className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <p className="text-sm font-semibold text-zinc-300">Industrial Apiary Control Center</p>
            <button
              type="button"
              className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition hover:border-yellow-300 hover:text-yellow-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>

          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default AdminLayout
