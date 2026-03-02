import { useEffect, useState } from 'react'
import { getFees, getStudents, getPackages, assignFee, markFeePaid } from '../lib/api'

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

function feeStatusBadge(status) {
  const map = {
    paid: 'badge-green',
    pending: 'badge-yellow',
    due: 'badge-red',
    overdue: 'badge-red',
  }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

export default function Fees() {
  const [fees, setFees] = useState([])
  const [students, setStudents] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showAssign, setShowAssign] = useState(false)
  const [assignForm, setAssignForm] = useState({ studentId: '', packageId: '' })
  const [saving, setSaving] = useState(false)

  function flash(msg, isError = false) {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }
  }

  async function load() {
    try {
      const [f, s, p] = await Promise.all([getFees(), getStudents(), getPackages()])
      setFees(f)
      setStudents(s)
      setPackages(p)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function getStudentName(id) {
    return students.find(s => s.id === id)?.name || id
  }
  function getPackageName(id) {
    const p = packages.find(p => p.id === id)
    return p ? `${p.name} (₹${p.amount}, ${p.duration}d)` : id
  }

  async function handleAssign(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await assignFee(assignForm.studentId, assignForm.packageId)
      flash('Package assigned successfully!')
      setShowAssign(false)
      setAssignForm({ studentId: '', packageId: '' })
      load()
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to assign', true)
    } finally { setSaving(false) }
  }

  async function handleMarkPaid(studentId) {
    try {
      await markFeePaid(studentId)
      flash('Marked as paid!')
      load()
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to mark paid', true)
    }
  }

  const pending = fees.filter(f => f.status !== 'paid')
  const paid = fees.filter(f => f.status === 'paid')

  return (
    <div>
      <div className="page-header">
        <h3>Fees Management</h3>
        <button className="btn btn-primary" onClick={() => setShowAssign(true)}>+ Assign Package</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        <div className="stat-card yellow">
          <span className="stat-icon">⏳</span>
          <span className="stat-label">Pending Fees</span>
          <span className="stat-value">{pending.length}</span>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">✅</span>
          <span className="stat-label">Paid Fees</span>
          <span className="stat-value">{paid.length}</span>
        </div>
        <div className="stat-card blue">
          <span className="stat-icon">📋</span>
          <span className="stat-label">Total Records</span>
          <span className="stat-value">{fees.length}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading">⏳ Loading fees...</div>
        ) : fees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <p>No fee records yet. Assign a package to a student to get started.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id || f.studentId}>
                    <td style={{ fontWeight: 500 }}>{getStudentName(f.studentId)} <span style={{ fontSize: 11, color: 'var(--text-light)' }}>({f.studentId})</span></td>
                    <td>{getPackageName(f.packageId)}</td>
                    <td>{feeStatusBadge(f.status)}</td>
                    <td style={{ color: f.dueDate ? 'var(--text)' : 'var(--text-light)' }}>
                      {f.dueDate || '—'}
                    </td>
                    <td>
                      {f.status !== 'paid' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleMarkPaid(f.studentId)}>
                          ✅ Mark Paid
                        </button>
                      )}
                      {f.status === 'paid' && <span style={{ color: 'var(--text-light)', fontSize: 12 }}>Paid</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAssign && (
        <Modal title="Assign Package to Student" onClose={() => setShowAssign(false)}>
          <form onSubmit={handleAssign}>
            <div className="form-group">
              <label>Select Student *</label>
              <select className="form-control" value={assignForm.studentId} onChange={e => setAssignForm(f => ({ ...f, studentId: e.target.value }))} required>
                <option value="">— Choose Student —</option>
                {students.filter(s => s.status === 'active').map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Package *</label>
              <select className="form-control" value={assignForm.packageId} onChange={e => setAssignForm(f => ({ ...f, packageId: e.target.value }))} required>
                <option value="">— Choose Package —</option>
                {packages.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — ₹{p.amount} / {p.duration} days</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setShowAssign(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Assigning...' : 'Assign Package'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
