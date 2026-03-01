import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Fees from './pages/Fees'
import SeatInfo from './pages/SeatInfo'
import Issues from './pages/Issues'
import Login from './pages/Login'
import { useEffect } from 'react'
import { getSession, logout } from './lib/session'

export default function App() {
  const navigate = useNavigate()
  useEffect(() => {
    const s = getSession()
    if (!s) navigate('/login')
  }, [navigate])
  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">📚 Student Panel</div>
        <div className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/profile">My Profile</NavLink>
          <NavLink to="/fees">Fees</NavLink>
          <NavLink to="/seat">Seat</NavLink>
          <NavLink to="/issues">Issues</NavLink>
          <button onClick={() => { logout(); navigate('/login') }}>Logout</button>
        </div>
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/fees" element={<RequireAuth><Fees /></RequireAuth>} />
          <Route path="/seat" element={<RequireAuth><SeatInfo /></RequireAuth>} />
          <Route path="/issues" element={<RequireAuth><Issues /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  )
}

function RequireAuth({ children }) {
  const navigate = useNavigate()
  useEffect(() => {
    const s = getSession()
    if (!s) navigate('/login')
    if (s?.role !== 'student') {
      logout()
      navigate('/login')
    }
  }, [navigate])
  return children
}
