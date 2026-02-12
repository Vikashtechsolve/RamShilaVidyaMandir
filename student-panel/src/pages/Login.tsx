import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { motion, useAnimationControls } from 'framer-motion'
import { loginStudent } from '../lib/api'
import { setSession } from '../lib/session'
import { AnimationConfig as cfg } from '../animation/config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [bagPicked, setBagPicked] = useState(false)
  const [lightOn, setLightOn] = useState(false)
  const charCtrl = useAnimationControls()
  const bagCtrl = useAnimationControls()
  const torsoCtrl = useAnimationControls()
  const headCtrl = useAnimationControls()
  const armLeftCtrl = useAnimationControls()
  const armRightCtrl = useAnimationControls()
  const legLeftCtrl = useAnimationControls()
  const legRightCtrl = useAnimationControls()
  const navigate = useNavigate()
  const [stageW, setStageW] = useState(980)
  useEffect(() => {
    function onResize() {
      const w = Math.min(980, Math.max(320, window.innerWidth * 0.96))
      setStageW(w)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    async function run() {
      await charCtrl.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.6, ease: cfg.easing.enter } })
      armLeftCtrl.start({ rotate: [cfg.motion.walkSwingArm, -cfg.motion.walkSwingArm, cfg.motion.walkSwingArm], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      armRightCtrl.start({ rotate: [-cfg.motion.walkSwingArm, cfg.motion.walkSwingArm, -cfg.motion.walkSwingArm], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      legLeftCtrl.start({ rotate: [cfg.motion.walkSwingLeg, -cfg.motion.walkSwingLeg, cfg.motion.walkSwingLeg], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      legRightCtrl.start({ rotate: [-cfg.motion.walkSwingLeg, cfg.motion.walkSwingLeg, -cfg.motion.walkSwingLeg], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      const toBagX = stageW * cfg.distances.toBagX - stageW * 0.06
      await charCtrl.start({ x: toBagX, transition: { duration: cfg.timings.walkToBag, ease: cfg.easing.walk } })
      armLeftCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      armRightCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      legLeftCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      legRightCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      await torsoCtrl.start({ rotate: cfg.motion.bendTorsoDeg, transition: { duration: cfg.timings.bendDown, ease: cfg.easing.bend } })
      await headCtrl.start({ rotate: cfg.motion.bendHeadDeg, y: 4, transition: { duration: cfg.timings.bendDown - 0.2, ease: cfg.easing.bend } })
      await bagCtrl.start({ y: cfg.motion.pickBagLiftY, x: cfg.motion.pickBagLiftX, scale: cfg.motion.pickBagScale, transition: { duration: cfg.timings.pickBag, ease: cfg.easing.bend } })
      setBagPicked(true)
      await torsoCtrl.start({ rotate: 0, transition: { duration: cfg.timings.standUp, ease: cfg.easing.bend } })
      await headCtrl.start({ rotate: 0, y: 0, transition: { duration: cfg.timings.standUp - 0.1, ease: cfg.easing.bend } })
      armLeftCtrl.start({ rotate: [cfg.motion.walkSwingArm, -cfg.motion.walkSwingArm, cfg.motion.walkSwingArm], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      armRightCtrl.start({ rotate: [-cfg.motion.walkSwingArm, cfg.motion.walkSwingArm, -cfg.motion.walkSwingArm], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      legLeftCtrl.start({ rotate: [cfg.motion.walkSwingLeg, -cfg.motion.walkSwingLeg, cfg.motion.walkSwingLeg], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      legRightCtrl.start({ rotate: [-cfg.motion.walkSwingLeg, cfg.motion.walkSwingLeg, -cfg.motion.walkSwingLeg], transition: { repeat: cfg.loop ? Infinity : 0, duration: 0.4, ease: cfg.easing.walk } })
      const backX = stageW * cfg.distances.backX
      await charCtrl.start({ x: backX, transition: { duration: cfg.timings.walkBack, ease: cfg.easing.walk } })
      armLeftCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      armRightCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      legLeftCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      legRightCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      setTimeout(() => setShowForm(true), cfg.timings.formRevealDelay * 1000)
    }
    run()
  }, [charCtrl, bagCtrl, stageW])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const res = await loginStudent({ email, password })
      setSession({ token: res.token, role: res.role, name: res.name })
      navigate('/')
    } catch (err: unknown) {
      const msg = isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ?? err.message)
        : 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
 
  }
  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-overlay" />
      <motion.div className="login-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: cfg.timings.headerFadeIn }}>
        <h1 style={{ margin: 0 }}>Login Bag Animation</h1>
        <p style={{ margin: 6, opacity: .85 }}>Welcome to RamShila VidyaMandir Library</p>
        <div className="controls">
          <div style={{ color: 'white', fontSize: 13, opacity: .85 }}>Spotlight</div>
          <div className={`toggle ${lightOn ? 'on' : ''}`} onClick={() => setLightOn(v => !v)}>
            <div className="knob" />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: -220, opacity: 0 }}
        animate={lightOn ? { y: 180, opacity: 1 } : { y: -220, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          maxWidth: 760,
          height: 420,
          zIndex: 2,
          background: `radial-gradient(220px 140px at 50% 0%, rgba(59,130,246,.28), transparent 70%), linear-gradient(180deg, rgba(30,58,138,.45), rgba(30,58,138,.05))`,
          filter: 'blur(12px)'
        }}
      />
      <div className="login-stage">
        <div className="anim-stage" style={{ width: Math.min(980, stageW) }}>
          <motion.div className="anim-character" animate={charCtrl}>
            <svg viewBox="0 0 160 220" width="100%" height="100%">
              <motion.g animate={torsoCtrl} style={{ transformOrigin: '80px 120px' }}>
                <rect x="40" y="80" width="80" height="90" rx="16" fill="#3B82F6" />
              </motion.g>
              <motion.g animate={headCtrl} style={{ transformOrigin: '80px 56px' }}>
                <circle cx="80" cy="56" r="28" fill="#FDE68A" />
              </motion.g>
              <motion.g animate={armLeftCtrl} style={{ transformOrigin: '60px 100px' }}>
                <rect x="52" y="100" width="16" height="42" rx="6" fill="#1E3A8A" />
              </motion.g>
              <motion.g animate={armRightCtrl} style={{ transformOrigin: '100px 100px' }}>
                <rect x="92" y="100" width="16" height="42" rx="6" fill="#1E3A8A" />
                {bagPicked && (
                  <g transform="translate(92, 134)">
                    <rect x="-6" y="0" width="22" height="18" rx="6" fill="#8B5E3C" />
                    <rect x="-2" y="-6" width="14" height="6" rx="4" fill="#6B4423" />
                  </g>
                )}
              </motion.g>
              <motion.g animate={legLeftCtrl} style={{ transformOrigin: '70px 140px' }}>
                <rect x="60" y="140" width="20" height="60" rx="8" fill="#1E3A8A" />
              </motion.g>
              <motion.g animate={legRightCtrl} style={{ transformOrigin: '90px 140px' }}>
                <rect x="90" y="140" width="20" height="60" rx="8" fill="#1E3A8A" />
              </motion.g>
              <rect x="30" y="96" width="28" height="16" rx="4" fill="#0F172A" opacity=".12" />
            </svg>
          </motion.div>
          {!bagPicked && (
            <motion.div className="anim-bag" animate={bagCtrl}>
              <svg viewBox="0 0 120 120" width="100%" height="100%">
                <rect x="22" y="40" width="76" height="50" rx="12" fill="#8B5E3C" />
                <rect x="30" y="36" width="60" height="10" rx="6" fill="#6B4423" />
                <circle cx="60" cy="64" r="18" fill="#3B82F6" opacity=".18" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
      <div className="login-bottom">
        <div className="glass-card">
          <motion.div
            className={`card login-card ${lightOn ? 'neon' : ''}`}
            initial={{ opacity: 0, y: 24 }}
            animate={showForm ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: cfg.timings.formReveal, ease: cfg.easing.reveal }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--text)' }}>Student Login</h2>
                <p className="muted" style={{ margin: 0 }}>Access your library dashboard</p>
              </div>
            </div>
            {error && <div className="alert">{error}</div>}
            <motion.form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}
              initial={{ opacity: 0, y: 12 }}
              animate={showForm ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: .2, duration: .5 }}>
              <label>
                <div className="label">Email</div>
                <motion.input
                  className={`input ${lightOn ? 'neon' : ''}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: .15 }}
                />
              </label>
              <label>
                <div className="label">Password</div>
                <motion.input
                  className={`input ${lightOn ? 'neon' : ''}`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: .15 }}
                />
              </label>
              <motion.button
                disabled={loading}
                type="submit"
                className="btn-primary"
                style={{ padding: 12, borderRadius: 12 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Signing in...' : 'Login'}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
