import { motion } from 'framer-motion'

export default function MyBooks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
    >
      <h3 className="card-heading">My Books</h3>
      <p className="muted">Books issued to you from the library</p>
      <div className="empty-state">
        <span className="empty-icon">📖</span>
        <p>No books currently issued</p>
        <p className="muted small">Visit the library desk to borrow books</p>
      </div>
    </motion.div>
  )
}
