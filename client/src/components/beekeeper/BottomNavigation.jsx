import { NavLink } from 'react-router-dom'

const navItems = [
  {
    to: '/beekeeper',
    label: 'Головна',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    to: '/beekeeper/tasks',
    label: 'Завдання',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="m3 6 1.5 1.5L6.5 5.5M3 12l1.5 1.5L6.5 11.5M3 18l1.5 1.5L6.5 17.5" />
      </svg>
    ),
  },
  {
    to: '/beekeeper/profile',
    label: 'Профіль',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c2-4 5-6 8-6s6 2 8 6" />
      </svg>
    ),
  },
]

function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-yellow-300 bg-black px-3 py-2">
      <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/beekeeper'}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center rounded-xl border-2 text-xs font-bold ${
                isActive
                  ? 'border-yellow-300 bg-yellow-300 text-black'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-100'
              }`
            }
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation
