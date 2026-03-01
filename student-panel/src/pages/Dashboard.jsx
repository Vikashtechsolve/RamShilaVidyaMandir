import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchSummary } from '../lib/api'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSummary().then(setData).catch(err => {
      setError(err?.response?.data?.message || 'Failed to load dashboard')
    })
  }, [])

  const statusBadge = (feeStatus, active, dueDate) => {
    const now = new Date()
    const due = dueDate ? new Date(dueDate) : now
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (feeStatus === 'Pending') return <span className="badge bg-red">Fee Pending</span>
    if (diff <= 7) return <span className="badge bg-yellow">Due Soon</span>
    return <span className="badge bg-green">{active ? 'Active' : 'Inactive'}</span>
  }

  return (
    <div>
      <motion.div className="banner library-banner"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .5 }}>
        <div className="inner">
          <h2>Welcome{data?.name ? `, ${data.name}` : ''}</h2>
          <p className="muted">Your study space at RamShila VidyaMandir Library</p>
        </div>
      </motion.div>
      {error && <div className="alert" style={{ marginTop: 12 }}>{error}</div>}
      <motion.div className="grid" style={{ marginTop: 12 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: .15, duration: .5 }}>
        <div className="card kpi">
          <div style={{ width: 8, height: 40, borderRadius: 999, background: 'var(--blue)' }} />
          <div>
            <div className="muted">Package</div>
            <div>{data?.packageName || '-'} • {data?.packageDuration || '-'}</div>
          </div>
        </div>
        <div className="card kpi">
          <div style={{ width: 8, height: 40, borderRadius: 999, background: 'var(--green)' }} />
          <div>
            <div className="muted">Fee Status</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div>{data?.feeStatus || '-'}</div>
              {statusBadge(data?.feeStatus || 'Pending', !!data?.active, data?.dueDate)}
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div style={{ width: 8, height: 40, borderRadius: 999, background: 'var(--yellow)' }} />
          <div>
            <div className="muted">Due Date</div>
            <div>{data?.dueDate ? new Date(data.dueDate).toLocaleDateString() : '-'}</div>
          </div>
        </div>
        <div className="card kpi">
          <div style={{ width: 8, height: 40, borderRadius: 999, background: 'var(--red)' }} />
          <div>
            <div className="muted">Seat</div>
            <div>#{data?.seatNumber || '-'} • {data?.timing || '-'}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
