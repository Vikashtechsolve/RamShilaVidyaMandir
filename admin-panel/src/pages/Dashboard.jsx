import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReportSummary } from '../lib/api'

const STATS = [
  { key: 'total', label: 'Total Students', icon: '🎓', color: 'blue' },
  { key: 'active', label: 'Active Students', icon: '✅', color: 'green' },
  { key: 'inactive', label: 'Inactive Students', icon: '🚫', color: 'red' },
  { key: 'pendingFees', label: 'Pending Fees', icon: '💳', color: 'yellow' },
  { key: 'dueSoon', label: 'Dues Soon', icon: '⏰', color: 'red' },
  { key: 'monthlyCollection', label: 'Paid Fees', icon: '💰', color: 'green' },
]

const QUICK_LINKS = [
  { to: '/students', label: 'Manage Students', icon: '🎓', desc: 'Add, edit, activate/deactivate students' },
  { to: '/fees', label: 'Manage Fees', icon: '💰', desc: 'Assign packages, mark fees as paid' },
  { to: '/packages', label: 'Packages', icon: '📦', desc: 'Create membership packages' },
  { to: '/issues', label: 'Student Issues', icon: '🎫', desc: 'View and respond to student issues' },
  { to: '/seating', label: 'Seating Chart', icon: '💺', desc: 'Manage library seat availability' },
  { to: '/reports', label: 'Reports', icon: '📊', desc: 'View full student & fee reports' },
]

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getReportSummary()
      .then(setSummary)
      .catch(e => setError(e.response?.data?.message || 'Failed to load summary'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Welcome back, Admin 👋</h3>
        <p style={{ color: 'var(--text-light)', fontSize: 13 }}>Here's what's happening at your library today.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">⏳ Loading stats...</div>
      ) : (
        <div className="stat-grid">
          {STATS.map(s => (
            <div key={s.key} className={`stat-card ${s.color}`}>
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{summary?.[s.key] ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-light)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Quick Actions
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {QUICK_LINKS.map(l => (
          <div
            key={l.to}
            className="card"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.1s' }}
            onClick={() => navigate(l.to)}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{l.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{l.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{l.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
