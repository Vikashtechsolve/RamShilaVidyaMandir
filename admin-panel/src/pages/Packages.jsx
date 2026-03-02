import { useEffect, useState } from 'react'
import { getPackages, createPackage } from '../lib/api'

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

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', duration: '' })
  const [saving, setSaving] = useState(false)

  function flash(msg, isError = false) {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }
  }

  async function load() {
    try {
      setPackages(await getPackages())
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createPackage({ name: form.name, amount: Number(form.amount), duration: Number(form.duration) })
      flash('Package created!')
      setShowAdd(false)
      setForm({ name: '', amount: '', duration: '' })
      load()
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to create', true)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h3>Packages ({packages.length})</h3>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ New Package</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading">⏳ Loading packages...</div>
      ) : packages.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No packages yet. Create your first membership package.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {packages.map(p => (
            <div key={p.id} className="card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                  <code style={{ fontSize: 11, color: 'var(--text-light)' }}>{p.id}</code>
                </div>
                <span style={{ fontSize: 24 }}>📦</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Amount</div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--success)' }}>₹{p.amount}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Duration</div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--accent)' }}>{p.duration}d</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Create New Package" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Package Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Monthly Basic" required />
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input className="form-control" type="number" min="1" max="100000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 500" required />
            </div>
            <div className="form-group">
              <label>Duration (days) *</label>
              <input className="form-control" type="number" min="1" max="365" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 30" required />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Package'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
