import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

function BeekeeperProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = () => {
    clearAuth()
    toast.success('Ви вийшли з системи')
    navigate('/login', { replace: true })
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-black p-4 pb-24">
      <h1 className="text-2xl font-black text-yellow-300">Профіль пасічника</h1>

      <div className="space-y-2 rounded-xl border-2 border-zinc-700 bg-zinc-900 p-4">
        <p className="text-sm text-zinc-300">Ім'я</p>
        <p className="text-lg font-bold text-white">{user?.name ?? 'Не вказано'}</p>
        <p className="mt-3 text-sm text-zinc-300">Email</p>
        <p className="text-base font-semibold text-white">{user?.email ?? 'Не вказано'}</p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="h-14 w-full rounded-2xl border-2 border-rose-400 bg-rose-600 text-lg font-black text-white"
      >
        Вийти з системи
      </button>
    </section>
  )
}

export default BeekeeperProfilePage
