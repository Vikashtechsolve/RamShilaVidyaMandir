import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchSummary, listIssues } from '../lib/api'

const categories = [
  { title: 'Programming', icon: '💻', color: '#3B82F6' },
  { title: 'Data Structures', icon: '🔗', color: '#8B5CF6' },
  { title: 'Artificial Intelligence', icon: '🤖', color: '#10B981' },
  { title: 'Database', icon: '🗄️', color: '#F59E0B' },
  { title: 'Web Development', icon: '🌐', color: '#EC4899' },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [openIssuesCount, setOpenIssuesCount] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSummary().then(setData).catch(err => {
      setError(err?.response?.data?.message || 'Failed to load dashboard')
    })
    listIssues().then(issues => {
      const open = issues.filter(i => i.status !== 'Solved').length
      setOpenIssuesCount(open)
    }).catch(() => {})
  }, [])

  const statusBadge = (feeStatus, active, dueDate) => {
    if (!feeStatus || feeStatus === 'Pending') return <span className="badge badge-red">Pending</span>
    if (feeStatus === 'Due Soon') return <span className="badge badge-yellow">Due Soon</span>
    return <span className="badge badge-green">{active ? 'Active' : 'Paid'}</span>
  }

  const stats = [
    { label: 'Active Package', value: data?.packageName || '-', sub: data?.packageDuration || '', icon: '📦' },
    { label: 'Fee Status', value: data?.feeStatus || '-', badge: statusBadge(data?.feeStatus, !!data?.active, data?.dueDate), icon: '💰' },
    { label: 'Seat Number', value: data?.seatNumber || '-', sub: data?.timing || '', icon: '🪑' },
    { label: 'Due Date', value: data?.dueDate ? new Date(data.dueDate).toLocaleDateString() : '-', icon: '📅' },
    { label: 'Books Issued', value: '0', sub: 'Currently', icon: '📚' },
    { label: 'Pending Requests', value: String(openIssuesCount), sub: 'Open issues', icon: '📋' },
  ]

  return (
    <div className="dashboard-page">
      {error && <div className="alert">{error}</div>}
      <motion.div
        className="dashboard-welcome"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2>Welcome{data?.name ? `, ${data.name}` : ''}</h2>
        <p className="muted">Your study space at RamShila VidyaMandir Library</p>
      </motion.div>

      <motion.div
        className="stats-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.35 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                {stat.badge}
              </div>
              {stat.sub && <span className="stat-sub">{stat.sub}</span>}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.section
        className="categories-section glass-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="section-heading">Popular Books / Categories</h3>
        <p className="section-subtitle">Explore books by category</p>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="category-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05, duration: 0.35 }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              style={{ '--cat-color': cat.color }}
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-title">{cat.title}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
