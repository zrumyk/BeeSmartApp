import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/hives', label: 'Hives' },
  { to: '/admin/tasks', label: 'Tasks' },
]

function AdminSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <h2 className="mb-6 text-xl font-black text-yellow-300">BeeSmart Admin</h2>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-yellow-300 text-black'
                  : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white'
              }`
            }
            end={item.end}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
