import { NavLink, Outlet } from 'react-router-dom'
import { useContext, type MouseEvent } from 'react'
import { ActiveSessionContext } from '../../contexts/activeSessionState'

const navigationItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/setup', label: 'Practice' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  const activeSession = useContext(ActiveSessionContext)
  if (!activeSession)
    throw new Error('App layout requires active-session navigation.')
  const { confirmLeaveActiveSession } = activeSession
  const confirmNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!confirmLeaveActiveSession()) event.preventDefault()
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" end onClick={confirmNavigation}>
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
                  onClick={confirmNavigation}
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
