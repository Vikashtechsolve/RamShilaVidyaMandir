import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import MyBooks from './pages/MyBooks'
import Fees from './pages/Fees'
import SeatInfo from './pages/SeatInfo'
import Issues from './pages/Issues'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Layout from './components/Layout'
import { useEffect } from 'react'
import { getSession, logout } from './lib/session'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  useEffect(() => {
    const s = getSession()
    if (!s) navigate('/login')
  }, [navigate])

  return (
    <div className="app">
      {!isLoginPage ? (
        <Layout>
          <Routes>
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/books" element={<RequireAuth><MyBooks /></RequireAuth>} />
            <Route path="/fees" element={<RequireAuth><Fees /></RequireAuth>} />
            <Route path="/seat" element={<RequireAuth><SeatInfo /></RequireAuth>} />
            <Route path="/issues" element={<RequireAuth><Issues /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
            <Route path="*" element={<RequireAuth><Dashboard /></RequireAuth>} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
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
