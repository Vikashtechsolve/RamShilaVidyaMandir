import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/fees', label: 'Fees', icon: '💰' },
  { to: '/packages', label: 'Packages', icon: '📦' },
  { to: '/issues', label: 'Issues', icon: '🎫' },
  { to: '/seating', label: 'Seating', icon: '💺' },
  { to: '/reports', label: 'Reports', icon: '📊' },
]

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/fees': 'Fees',
  '/packages': 'Packages',
  '/issues': 'Issues',
  '/seating': 'Seating',
  '/reports': 'Reports',
}

export default function Layout() {
  const navigate = useNavigate()
  const path = window.location.pathname
  const title = PAGE_TITLES[path] || 'Admin'

  function logout() {
    localStorage.removeItem('admin_token')
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>📚 RamShila Vidya Mandir</h1>
          <p>Library Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
            >
              <span className="icon">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>🚪 Logout</button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <h2>{title}</h2>
          <div className="topbar-right">
            <span className="admin-badge">👤 Admin</span>
          </div>
        </header>
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
