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

  /* ---- inline SVG icons ---- */
  const BookStackIcon = () => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
      <path d="M8 7h6" />
      <path d="M8 11h4" />
    </svg>
  )

  const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )

  const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )

  // Futuristic floating books - position around the login card, with depth blur
  const floatingBooks = [
    { left: '8%', top: '15%', size: 48, rotateY: -25, rotateX: 10, blur: 3, delay: 0, duration: 14 },
    { left: '85%', top: '20%', size: 56, rotateY: 35, rotateX: -8, blur: 2, delay: 1, duration: 16 },
    { left: '5%', top: '55%', size: 40, rotateY: 15, rotateX: 5, blur: 4, delay: 2, duration: 12 },
    { left: '90%', top: '60%', size: 52, rotateY: -30, rotateX: 12, blur: 3, delay: 0.5, duration: 15 },
    { left: '15%', top: '80%', size: 44, rotateY: 40, rotateX: -5, blur: 5, delay: 1.5, duration: 13 },
    { left: '82%', top: '82%', size: 38, rotateY: -20, rotateX: 8, blur: 4, delay: 2.5, duration: 17 },
    { left: '78%', top: '12%', size: 36, rotateY: 45, rotateX: -10, blur: 2, delay: 0.8, duration: 11 },
    { left: '12%', top: '35%', size: 42, rotateY: -15, rotateX: 6, blur: 4, delay: 1.2, duration: 14 },
  ]

  // Floating book pages - thin glowing sheets
  const floatingPages = [
    { left: '10%', top: '25%', width: 32, height: 42, rotate: -12, blur: 5, delay: 0.3, duration: 18 },
    { left: '88%', top: '35%', width: 28, height: 36, rotate: 18, blur: 4, delay: 1.8, duration: 15 },
    { left: '6%', top: '72%', width: 36, height: 44, rotate: 8, blur: 6, delay: 0.6, duration: 20 },
    { left: '92%', top: '75%', width: 30, height: 38, rotate: -15, blur: 5, delay: 2.2, duration: 16 },
    { left: '72%', top: '8%', width: 24, height: 32, rotate: 22, blur: 3, delay: 1, duration: 14 },
    { left: '18%', top: '48%', width: 34, height: 40, rotate: -8, blur: 5, delay: 1.5, duration: 19 },
  ]

  // Small sparkles and light particles
  const sparkles = [
    { left: '12%', top: '18%', size: 3, delay: 0, duration: 6 },
    { left: '88%', top: '22%', size: 2, delay: 1.5, duration: 8 },
    { left: '72%', top: '65%', size: 4, delay: 0.8, duration: 7 },
    { left: '22%', top: '70%', size: 2, delay: 2, duration: 9 },
    { left: '50%', top: '12%', size: 2, delay: 0.5, duration: 10 },
    { left: '8%', top: '45%', size: 3, delay: 1, duration: 8 },
    { left: '92%', top: '78%', size: 2, delay: 2.5, duration: 7 },
    { left: '38%', top: '85%', size: 2, delay: 0.3, duration: 11 },
    { left: '65%', top: '38%', size: 3, delay: 1.8, duration: 9 },
    { left: '25%', top: '30%', size: 2, delay: 1.2, duration: 7 },
    { left: '75%', top: '50%', size: 2, delay: 0.7, duration: 8 },
  ]

  return (
    <div className="login-page-wrapper">
      {/* Layer 1: Smooth blue gradient base */}
      <div className="login-bg-gradient" />

      {/* Layer 2: Floating 3D books with glowing edges */}
      <div className="login-floating-books" aria-hidden="true">
        {floatingBooks.map((b, i) => (
          <div
            key={`book-${i}`}
            className="login-float-book"
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size * 1.35,
              '--ry': `${b.rotateY}deg`,
              '--rx': `${b.rotateX}deg`,
              filter: `blur(${b.blur}px)`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          >
            <div className="login-float-book-inner" />
          </div>
        ))}
      </div>

      {/* Layer 3: Floating book pages */}
      <div className="login-floating-pages" aria-hidden="true">
        {floatingPages.map((p, i) => (
          <div
            key={`page-${i}`}
            className="login-float-page"
            style={{
              left: p.left,
              top: p.top,
              width: p.width,
              height: p.height,
              '--page-rotate': `${p.rotate}deg`,
              filter: `blur(${p.blur}px)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 4: Soft blue glow effects */}
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />
      <div className="login-bg-glow login-bg-glow-3" />
      <div className="login-bg-glow login-bg-glow-4" />

      {/* Layer 5: Sparkles and light particles */}
      <div className="login-bg-particles" aria-hidden="true">
        {sparkles.map((p, i) => (
          <div
            key={i}
            className="login-particle login-sparkle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 6: Login form card */}
      <div className="login-form-card">
        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.14), rgba(30,58,95,0.35))',
            border: '1px solid rgba(96,165,250,0.18)',
            marginBottom: '14px',
          }}>
            <BookStackIcon />
          </div>
          <h2 style={{
            fontSize: '21px',
            fontWeight: 700,
            color: '#e0ecff',
            margin: '0 0 4px',
            letterSpacing: '0.3px',
          }}>
            Student Login
          </h2>
          <p style={{ fontSize: '13px', color: '#7da1c4', margin: 0 }}>
            Ram Shila Vidya Mandir — Library Portal
          </p>
        </div>

        {/* error */}
        {error && (
          <div style={{
            marginBottom: '16px',
            borderRadius: '10px',
            background: 'rgba(239,68,68,0.14)',
            border: '1px solid rgba(239,68,68,0.28)',
            color: '#fca5a5',
            padding: '10px 14px',
            fontSize: '13px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* email */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#93c5fd', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Email
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(30, 58, 95, 0.4)',
              border: '1px solid rgba(96,165,250,0.18)',
              borderRadius: '10px',
              padding: '0 12px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}>
              <MailIcon />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#dbeafe',
                  fontSize: '14px',
                  padding: '12px 10px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* password */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#93c5fd', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(30, 58, 95, 0.4)',
              border: '1px solid rgba(96,165,250,0.18)',
              borderRadius: '10px',
              padding: '0 12px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}>
              <LockIcon />
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                required
                placeholder="Enter your password"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#dbeafe',
                  fontSize: '14px',
                  padding: '12px 10px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* submit */}
          <button
            disabled={loading}
            type="submit"
            style={{
              marginTop: '6px',
              width: '100%',
              padding: '13px 0',
              borderRadius: '10px',
              border: 'none',
              background: loading
                ? 'rgba(59,130,246,0.35)'
                : 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.4px',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.4)',
              transition: 'all 0.25s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.55)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.4)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* footer */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#475569', marginTop: '22px', marginBottom: 0 }}>
          Powered by Ram Shila Vidya Mandir Library System
        </p>
      </div>

      {/* global overrides for input placeholders and autofill */}
      <style>{`
        input::placeholder { color: #64748b !important; opacity: 1; }
        input:focus { outline: none; }
        div:has(> input:focus) { border-color: rgba(96,165,250,0.5) !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(30, 58, 95, 0.9) inset !important;
          -webkit-text-fill-color: #dbeafe !important;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: #dbeafe;
        }
      `}</style>
    </div>
  )
}
