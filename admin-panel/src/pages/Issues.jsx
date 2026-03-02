import { useEffect, useState } from 'react'
import { getIssues, respondIssue, toggleIssueStatus } from '../lib/api'

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Issues() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [response, setResponse] = useState('')
  const [saving, setSaving] = useState(false)

  function flash(msg, isError = false) {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }
  }

  async function load() {
    try {
      setIssues(await getIssues())
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load issues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleRespond(e) {
    e.preventDefault()
    if (!response.trim()) return
    setSaving(true)
    try {
      await respondIssue(selected.id, response)
      flash('Response sent!')
      setSelected(null)
      setResponse('')
      load()
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to respond', true)
    } finally { setSaving(false) }
  }

  async function handleToggle(id) {
    try {
      await toggleIssueStatus(id)
      load()
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to toggle', true)
    }
  }

  function openRespond(issue) {
    setSelected(issue)
    setResponse(issue.response || '')
  }

  const filtered = filter === 'all' ? issues : issues.filter(i => i.status === filter)
  const openCount = issues.filter(i => i.status === 'open').length
  const solvedCount = issues.filter(i => i.status === 'solved').length

  return (
    <div>
      <div className="page-header">
        <h3>Student Issues ({issues.length})</h3>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        <div className="stat-card red">
          <span className="stat-icon">🔴</span>
          <span className="stat-label">Open Issues</span>
          <span className="stat-value">{openCount}</span>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">✅</span>
          <span className="stat-label">Solved</span>
          <span className="stat-value">{solvedCount}</span>
        </div>
        <div className="stat-card blue">
          <span className="stat-icon">📋</span>
          <span className="stat-label">Total</span>
          <span className="stat-value">{issues.length}</span>
        </div>
      </div>

      <div className="tabs">
        {['all', 'open', 'solved'].map(t => (
          <button key={t} className={`tab-btn ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All' : t === 'open' ? '🔴 Open' : '✅ Solved'}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading">⏳ Loading issues...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <p>No {filter === 'all' ? '' : filter} issues found.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(issue => (
                  <tr key={issue.id}>
                    <td><code style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>{issue.id}</code></td>
                    <td style={{ fontWeight: 500 }}>{issue.studentId}</td>
                    <td>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{issue.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.message}</div>
                    </td>
                    <td>
                      <span className={`badge ${issue.status === 'open' ? 'badge-red' : 'badge-green'}`}>{issue.status}</span>
                    </td>
                    <td style={{ color: 'var(--text-light)', fontSize: 12 }}>
                      {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => openRespond(issue)}>
                          {issue.status === 'open' ? '💬 Respond' : '👁️ View'}
                        </button>
                        <button
                          className={`btn btn-sm ${issue.status === 'open' ? 'btn-success' : 'btn-warning'}`}
                          onClick={() => handleToggle(issue.id)}
                        >
                          {issue.status === 'open' ? '✅ Solve' : '🔄 Reopen'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <Modal title={`Issue — ${selected.title}`} onClose={() => { setSelected(null); setResponse('') }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>From: <strong>{selected.studentId}</strong></div>
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: 13.5 }}>
              {selected.message}
            </div>
          </div>

          {selected.response && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>Previous Response:</div>
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: 12, fontSize: 13.5, color: '#065F46' }}>
                {selected.response}
              </div>
            </div>
          )}

          {selected.status === 'open' && (
            <form onSubmit={handleRespond}>
              <div className="form-group">
                <label>Your Response *</label>
                <textarea
                  className="respond-area"
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  placeholder="Type your response here..."
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => { setSelected(null); setResponse('') }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sending...' : '💬 Send Response'}</button>
              </div>
            </form>
          )}

          {selected.status === 'solved' && (
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setSelected(null); setResponse('') }}>Close</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
