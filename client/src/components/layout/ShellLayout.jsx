import { Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import BottomNavigation from '../beekeeper/BottomNavigation'

function ShellLayout() {
  const user = useAuthStore((state) => state.user)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <p className="text-sm font-semibold text-yellow-300">BeeSmart Platform</p>
        <p className="text-xs text-zinc-300">{user?.name ?? 'Пасічник'}</p>
      </header>
      <Outlet />
      <BottomNavigation />
    </main>
  )
}

export default ShellLayout
