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

  // Library bookshelf SVG background (inline data URI)
  const librarySvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1628"/><stop offset="1" stop-color="#0d1f3c"/></linearGradient>
    <linearGradient id="shelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a0e"/><stop offset="1" stop-color="#1a0f07"/></linearGradient>
    <linearGradient id="lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbbf24" stop-opacity="0.6"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>

  <!-- warm light glow -->
  <ellipse cx="600" cy="100" rx="400" ry="250" fill="url(#lamp)" opacity="0.12"/>
  <ellipse cx="200" cy="80" rx="200" ry="180" fill="url(#lamp)" opacity="0.06"/>
  <ellipse cx="1000" cy="80" rx="200" ry="180" fill="url(#lamp)" opacity="0.06"/>

  <!-- shelf boards -->
  <rect x="40" y="195" width="1120" height="10" rx="2" fill="#3b2415" opacity="0.7"/>
  <rect x="40" y="395" width="1120" height="10" rx="2" fill="#3b2415" opacity="0.7"/>
  <rect x="40" y="595" width="1120" height="10" rx="2" fill="#3b2415" opacity="0.7"/>

  <!-- ROW 1 books (y baseline ~195) -->
  <rect x="60" y="110" width="22" height="85" rx="2" fill="#1e40af" opacity="0.8"/>
  <rect x="86" y="100" width="18" height="95" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="108" y="115" width="26" height="80" rx="2" fill="#2563eb" opacity="0.7"/>
  <rect x="138" y="105" width="16" height="90" rx="2" fill="#60a5fa" opacity="0.6"/>
  <rect x="158" y="120" width="24" height="75" rx="2" fill="#1e40af" opacity="0.7"/>
  <rect x="186" y="108" width="20" height="87" rx="2" fill="#3b82f6" opacity="0.65"/>
  <rect x="210" y="125" width="18" height="70" rx="2" fill="#93c5fd" opacity="0.5"/>
  <rect x="232" y="100" width="28" height="95" rx="2" fill="#1d4ed8" opacity="0.75"/>
  <rect x="264" y="118" width="15" height="77" rx="2" fill="#2563eb" opacity="0.6"/>
  <rect x="284" y="108" width="22" height="87" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="310" y="130" width="20" height="65" rx="2" fill="#60a5fa" opacity="0.5"/>
  <rect x="340" y="105" width="25" height="90" rx="2" fill="#1e40af" opacity="0.7"/>
  <rect x="370" y="112" width="18" height="83" rx="2" fill="#3b82f6" opacity="0.65"/>
  <rect x="392" y="98" width="22" height="97" rx="2" fill="#1d4ed8" opacity="0.8"/>
  <rect x="420" y="125" width="16" height="70" rx="2" fill="#93c5fd" opacity="0.45"/>
  <rect x="440" y="108" width="28" height="87" rx="2" fill="#2563eb" opacity="0.7"/>
  <rect x="472" y="115" width="20" height="80" rx="2" fill="#1e3a5f" opacity="0.75"/>

  <rect x="520" y="105" width="24" height="90" rx="2" fill="#1e40af" opacity="0.8"/>
  <rect x="548" y="118" width="18" height="77" rx="2" fill="#60a5fa" opacity="0.55"/>
  <rect x="570" y="100" width="26" height="95" rx="2" fill="#3b82f6" opacity="0.7"/>
  <rect x="600" y="112" width="15" height="83" rx="2" fill="#1d4ed8" opacity="0.65"/>
  <rect x="620" y="125" width="22" height="70" rx="2" fill="#2563eb" opacity="0.6"/>
  <rect x="646" y="103" width="20" height="92" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="670" y="110" width="28" height="85" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="702" y="98" width="18" height="97" rx="2" fill="#1e40af" opacity="0.75"/>
  <rect x="724" y="120" width="24" height="75" rx="2" fill="#3b82f6" opacity="0.65"/>
  <rect x="752" y="108" width="16" height="87" rx="2" fill="#60a5fa" opacity="0.5"/>
  <rect x="772" y="115" width="22" height="80" rx="2" fill="#1d4ed8" opacity="0.7"/>

  <rect x="820" y="100" width="26" height="95" rx="2" fill="#2563eb" opacity="0.75"/>
  <rect x="850" y="112" width="18" height="83" rx="2" fill="#1e40af" opacity="0.7"/>
  <rect x="872" y="105" width="24" height="90" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="900" y="120" width="15" height="75" rx="2" fill="#3b82f6" opacity="0.55"/>
  <rect x="920" y="108" width="22" height="87" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="946" y="98" width="28" height="97" rx="2" fill="#1d4ed8" opacity="0.75"/>
  <rect x="978" y="115" width="20" height="80" rx="2" fill="#60a5fa" opacity="0.6"/>
  <rect x="1002" y="105" width="18" height="90" rx="2" fill="#2563eb" opacity="0.7"/>
  <rect x="1024" y="125" width="24" height="70" rx="2" fill="#1e40af" opacity="0.65"/>
  <rect x="1052" y="110" width="16" height="85" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="1072" y="100" width="22" height="95" rx="2" fill="#3b82f6" opacity="0.7"/>
  <rect x="1098" y="118" width="18" height="77" rx="2" fill="#60a5fa" opacity="0.5"/>

  <!-- ROW 2 books (y baseline ~395) -->
  <rect x="60" y="310" width="26" height="85" rx="2" fill="#3b82f6" opacity="0.7"/>
  <rect x="90" y="300" width="18" height="95" rx="2" fill="#1e40af" opacity="0.75"/>
  <rect x="112" y="318" width="22" height="77" rx="2" fill="#60a5fa" opacity="0.55"/>
  <rect x="138" y="305" width="28" height="90" rx="2" fill="#1d4ed8" opacity="0.7"/>
  <rect x="170" y="320" width="16" height="75" rx="2" fill="#93c5fd" opacity="0.45"/>
  <rect x="190" y="298" width="24" height="97" rx="2" fill="#2563eb" opacity="0.8"/>
  <rect x="218" y="312" width="20" height="83" rx="2" fill="#1e3a5f" opacity="0.75"/>
  <rect x="242" y="308" width="18" height="87" rx="2" fill="#1e40af" opacity="0.65"/>
  <rect x="264" y="325" width="26" height="70" rx="2" fill="#3b82f6" opacity="0.6"/>
  <rect x="294" y="300" width="22" height="95" rx="2" fill="#60a5fa" opacity="0.5"/>
  <rect x="320" y="315" width="15" height="80" rx="2" fill="#1d4ed8" opacity="0.7"/>
  <rect x="340" y="304" width="28" height="91" rx="2" fill="#2563eb" opacity="0.75"/>
  <rect x="372" y="318" width="20" height="77" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="396" y="310" width="18" height="85" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="418" y="298" width="24" height="97" rx="2" fill="#1e40af" opacity="0.7"/>
  <rect x="446" y="320" width="22" height="75" rx="2" fill="#3b82f6" opacity="0.65"/>
  <rect x="472" y="305" width="16" height="90" rx="2" fill="#60a5fa" opacity="0.5"/>

  <rect x="520" y="310" width="26" height="85" rx="2" fill="#1d4ed8" opacity="0.7"/>
  <rect x="550" y="298" width="18" height="97" rx="2" fill="#2563eb" opacity="0.8"/>
  <rect x="572" y="315" width="24" height="80" rx="2" fill="#1e40af" opacity="0.65"/>
  <rect x="600" y="305" width="20" height="90" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="624" y="320" width="28" height="75" rx="2" fill="#3b82f6" opacity="0.7"/>
  <rect x="656" y="300" width="16" height="95" rx="2" fill="#1e3a5f" opacity="0.75"/>
  <rect x="676" y="312" width="22" height="83" rx="2" fill="#60a5fa" opacity="0.55"/>
  <rect x="702" y="308" width="18" height="87" rx="2" fill="#1d4ed8" opacity="0.7"/>
  <rect x="724" y="298" width="26" height="97" rx="2" fill="#1e40af" opacity="0.75"/>
  <rect x="754" y="318" width="24" height="77" rx="2" fill="#2563eb" opacity="0.65"/>
  <rect x="782" y="310" width="15" height="85" rx="2" fill="#3b82f6" opacity="0.6"/>

  <rect x="820" y="305" width="22" height="90" rx="2" fill="#93c5fd" opacity="0.45"/>
  <rect x="846" y="300" width="28" height="95" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="878" y="315" width="18" height="80" rx="2" fill="#60a5fa" opacity="0.5"/>
  <rect x="900" y="298" width="24" height="97" rx="2" fill="#1d4ed8" opacity="0.75"/>
  <rect x="928" y="312" width="20" height="83" rx="2" fill="#2563eb" opacity="0.7"/>
  <rect x="952" y="320" width="16" height="75" rx="2" fill="#1e40af" opacity="0.6"/>
  <rect x="972" y="305" width="26" height="90" rx="2" fill="#3b82f6" opacity="0.7"/>
  <rect x="1002" y="310" width="22" height="85" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="1028" y="298" width="18" height="97" rx="2" fill="#1e3a5f" opacity="0.75"/>
  <rect x="1050" y="318" width="28" height="77" rx="2" fill="#60a5fa" opacity="0.55"/>
  <rect x="1082" y="308" width="20" height="87" rx="2" fill="#1d4ed8" opacity="0.7"/>

  <!-- ROW 3 books (y baseline ~595) -->
  <rect x="60" y="510" width="24" height="85" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="88" y="498" width="20" height="97" rx="2" fill="#2563eb" opacity="0.75"/>
  <rect x="112" y="515" width="26" height="80" rx="2" fill="#3b82f6" opacity="0.6"/>
  <rect x="142" y="505" width="16" height="90" rx="2" fill="#60a5fa" opacity="0.5"/>
  <rect x="162" y="520" width="22" height="75" rx="2" fill="#1e40af" opacity="0.7"/>
  <rect x="188" y="500" width="28" height="95" rx="2" fill="#1d4ed8" opacity="0.8"/>
  <rect x="220" y="512" width="18" height="83" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="242" y="508" width="24" height="87" rx="2" fill="#1e3a5f" opacity="0.75"/>
  <rect x="270" y="498" width="15" height="97" rx="2" fill="#2563eb" opacity="0.7"/>
  <rect x="290" y="518" width="22" height="77" rx="2" fill="#3b82f6" opacity="0.65"/>
  <rect x="316" y="505" width="20" height="90" rx="2" fill="#1e40af" opacity="0.6"/>
  <rect x="340" y="510" width="28" height="85" rx="2" fill="#60a5fa" opacity="0.45"/>
  <rect x="372" y="500" width="18" height="95" rx="2" fill="#1d4ed8" opacity="0.75"/>
  <rect x="394" y="520" width="24" height="75" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="422" y="508" width="16" height="87" rx="2" fill="#2563eb" opacity="0.7"/>
  <rect x="442" y="512" width="26" height="83" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="472" y="498" width="22" height="97" rx="2" fill="#3b82f6" opacity="0.65"/>

  <rect x="520" y="510" width="20" height="85" rx="2" fill="#1e40af" opacity="0.7"/>
  <rect x="544" y="500" width="28" height="95" rx="2" fill="#60a5fa" opacity="0.5"/>
  <rect x="576" y="515" width="16" height="80" rx="2" fill="#1d4ed8" opacity="0.65"/>
  <rect x="596" y="505" width="24" height="90" rx="2" fill="#2563eb" opacity="0.75"/>
  <rect x="624" y="520" width="18" height="75" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="646" y="498" width="22" height="97" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="672" y="508" width="26" height="87" rx="2" fill="#3b82f6" opacity="0.6"/>
  <rect x="702" y="512" width="15" height="83" rx="2" fill="#1e40af" opacity="0.7"/>
  <rect x="722" y="500" width="28" height="95" rx="2" fill="#60a5fa" opacity="0.55"/>
  <rect x="754" y="518" width="20" height="77" rx="2" fill="#1d4ed8" opacity="0.7"/>
  <rect x="778" y="505" width="18" height="90" rx="2" fill="#2563eb" opacity="0.65"/>

  <rect x="820" y="510" width="24" height="85" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="848" y="498" width="22" height="97" rx="2" fill="#1e3a5f" opacity="0.8"/>
  <rect x="874" y="515" width="16" height="80" rx="2" fill="#3b82f6" opacity="0.6"/>
  <rect x="894" y="500" width="28" height="95" rx="2" fill="#1e40af" opacity="0.75"/>
  <rect x="926" y="512" width="20" height="83" rx="2" fill="#60a5fa" opacity="0.5"/>
  <rect x="950" y="508" width="18" height="87" rx="2" fill="#1d4ed8" opacity="0.7"/>
  <rect x="972" y="520" width="26" height="75" rx="2" fill="#2563eb" opacity="0.7"/>
  <rect x="1002" y="498" width="24" height="97" rx="2" fill="#93c5fd" opacity="0.4"/>
  <rect x="1030" y="510" width="15" height="85" rx="2" fill="#1e3a5f" opacity="0.75"/>
  <rect x="1050" y="505" width="22" height="90" rx="2" fill="#3b82f6" opacity="0.65"/>
  <rect x="1076" y="515" width="28" height="80" rx="2" fill="#1e40af" opacity="0.6"/>

  <!-- side panels (bookcase frame) -->
  <rect x="40" y="80" width="8" height="530" rx="2" fill="#2a1a0e" opacity="0.5"/>
  <rect x="1152" y="80" width="8" height="530" rx="2" fill="#2a1a0e" opacity="0.5"/>
</svg>`)}`

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.82) 0%, rgba(30,58,95,0.78) 50%, rgba(12,45,87,0.85) 100%), url("${librarySvg}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* decorative floating orbs */}
      <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-90px', right: '-90px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.10), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '25%', right: '8%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,253,0.07), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 16px',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(96, 165, 250, 0.16)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(148,197,253,0.06)',
        padding: '40px 36px 34px',
        position: 'relative',
        zIndex: 1,
      }}>
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
