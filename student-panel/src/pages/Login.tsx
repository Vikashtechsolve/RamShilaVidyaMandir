import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { loginStudent, checkHealth } from '../lib/api'
import { setSession } from '../lib/session'
import ConnectionRefused from '../components/ConnectionRefused'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkHealth().then(setConnectionOk)
  }, [])

  function handleRetry() {
    setConnectionOk(null)
    checkHealth().then(setConnectionOk)
  }

  useEffect(() => {
    if (connectionOk === false) {
      setError('Cannot connect to server. Please ensure the backend is running on port 4000 and MongoDB is connected.')
    } else if (connectionOk === true) {
      setError(null)
    }
  }, [connectionOk])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginStudent({ email, password })
      setSession({ token: res.token, role: res.role, name: res.name })
      navigate('/')
    } catch (err: unknown) {
      let msg = 'Login failed'
      if (isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          msg = 'Cannot connect to server. Please ensure the backend is running on port 4000 and MongoDB is connected.'
        } else {
          msg = (err.response?.data as { message?: string })?.message ?? err.message
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (connectionOk === false) {
    return <ConnectionRefused onRetry={handleRetry} />
  }

  return (
    <div className="login-page">
      <div className="login-center">
        <div className="card login-card">
          <h2 style={{ margin: '0 0 20px 0', color: '#0F172A' }}>Student Login</h2>
          {connectionOk === null && !error && (
            <div className="alert" style={{ background: '#fef3c7', color: '#92400e' }}>Checking connection to server...</div>
          )}
          {error && <div className="alert">{error}</div>}
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <label>
              <div className="label">Email</div>
              <input
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Enter your email"
              />
            </label>
            <label>
              <div className="label">Password</div>
              <input
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                required
                placeholder="Enter your password"
              />
            </label>
            <button disabled={loading} type="submit" className="btn-primary">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
