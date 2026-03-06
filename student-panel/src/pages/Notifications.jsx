import { motion } from 'framer-motion'

export default function Notifications() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
    >
      <h3 className="card-heading">Notifications</h3>
      <p className="muted">Stay updated with library announcements</p>
      <div className="empty-state">
        <span className="empty-icon">🔔</span>
        <p>No new notifications</p>
        <p className="muted small">You're all caught up!</p>
      </div>
    </motion.div>
  )
}
