import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/UI/Button.jsx'
import api, { checkHealth } from '../services/api.js'
import ConnectionRefused from '../components/ConnectionRefused.jsx'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [connectionOk, setConnectionOk] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkHealth().then(setConnectionOk)
  }, [])

  const handleRetry = () => {
    setConnectionOk(null)
    checkHealth().then(setConnectionOk)
  }

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { username: user, password: pass })
      localStorage.setItem('liberry_token', data.token)
      navigate('/')
    } catch (err) {
      const isNetwork = err.code === 'ERR_NETWORK' || err.message === 'Network Error'
      setError(isNetwork ? 'Cannot connect to server. Ensure the backend is running on port 4000.' : (err.response?.data?.message || 'Invalid credentials'))
    } finally {
      setLoading(false)
    }
  }

  if (connectionOk === false) {
    return <ConnectionRefused onRetry={handleRetry} />
  }

  return (
    <div
      className="h-full flex items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.9)), url(/library.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-white shadow border border-secondary p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Admin Login</h2>
        {error && (<div className="mb-3 rounded-md bg-danger text-white px-3 py-2">{error}</div>)}
        <form className="space-y-3" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm text-textLight mb-1">Username</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded-md border border-secondary px-3 py-2 focus:ring-2 focus:ring-accent outline-none"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-textLight mb-1">Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-md border border-secondary px-3 py-2 focus:ring-2 focus:ring-accent outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <Button className="w-full mt-2" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}
