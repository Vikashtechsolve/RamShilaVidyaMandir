import { useEffect, useState, useCallback } from 'react'
import { getStudents, searchStudents, createStudent, updateStudent, deleteStudent, toggleStudentStatus } from '../lib/api'

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

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')

  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(null)
  const [showDelete, setShowDelete] = useState(null)

  const [form, setForm] = useState({ name: '', mobile: '', email: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async (q = '') => {
    try {
      const data = q ? await searchStudents(q) : await getStudents()
      setStudents(data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => load(search), 300)
    return () => clearTimeout(t)
  }, [search, load])

  function flash(msg, isError = false) {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createStudent(form)
      flash('Student added successfully!')
      setShowAdd(false)
      setForm({ name: '', mobile: '', email: '' })
      load(search)
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to add student', true)
    } finally { setSaving(false) }
  }

  async function handleEdit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateStudent(showEdit.id, form)
      flash('Student updated!')
      setShowEdit(null)
      load(search)
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to update', true)
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await deleteStudent(showDelete.id)
      flash('Student deleted.')
      setShowDelete(null)
      load(search)
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to delete', true)
    } finally { setSaving(false) }
  }

  async function handleToggle(id) {
    try {
      const updated = await toggleStudentStatus(id)
      setStudents(prev => prev.map(s => s.id === id ? { ...s, status: updated.status } : s))
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to toggle status', true)
    }
  }

  function openEdit(s) {
    setForm({ name: s.name, mobile: s.mobile, email: s.email })
    setShowEdit(s)
  }

  function openAdd() {
    setForm({ name: '', mobile: '', email: '' })
    setShowAdd(true)
  }

  return (
    <div>
      <div className="page-header">
        <h3>Students ({students.length})</h3>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Student</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="🔍 Search by name, mobile or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading">⏳ Loading students...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <p>No students found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td><code style={{ fontSize: 12, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>{s.id}</code></td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.mobile}</td>
                    <td style={{ color: 'var(--text-light)' }}>{s.email}</td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                        <button
                          className={`btn btn-sm ${s.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggle(s.id)}
                        >
                          {s.status === 'active' ? '🚫 Deactivate' : '✅ Activate'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(s)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Student" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Full Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ramesh Kumar" required />
            </div>
            <div className="form-group">
              <label>Mobile *</label>
              <input className="form-control" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="e.g. 9876543210" required />
            </div>
            <div className="form-group">
              <label>Email (optional)</label>
              <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Auto-generated if blank" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 14 }}>Default password will be: <strong>student123</strong></p>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Student'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title={`Edit — ${showEdit.name}`} onClose={() => setShowEdit(null)}>
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Mobile *</label>
              <input className="form-control" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setShowEdit(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {showDelete && (
        <Modal title="Delete Student" onClose={() => setShowDelete(null)}>
          <p style={{ marginBottom: 20 }}>Are you sure you want to delete <strong>{showDelete.name}</strong>? This cannot be undone.</p>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setShowDelete(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting...' : 'Yes, Delete'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
