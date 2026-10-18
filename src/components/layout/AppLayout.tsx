import { NavLink, Outlet } from 'react-router-dom'

const navigationItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/setup', label: 'Practice' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" end>
          Math Sprouts
        </NavLink>
        <nav aria-label="Main navigation">
          <ul className="site-nav">
            {navigationItems.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link--active' : 'nav-link'
                  }
                  to={to}
                  end={end}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}
