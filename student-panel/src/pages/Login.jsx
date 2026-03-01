import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { loginStudent } from '../lib/api'
import { setSession } from '../lib/session'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setError(null)
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginStudent({ email, password })
      setSession({ token: res.token, role: res.role, name: res.name })
      navigate('/')
    } catch (err) {
      let msg = 'Login failed'
      if (isAxiosError(err)) {
        msg = err.response?.data?.message ?? err.message
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-center">
        <div className="card login-card">
          <h2 style={{ margin: '0 0 20px 0', color: '#0F172A' }}>Student Login</h2>
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
