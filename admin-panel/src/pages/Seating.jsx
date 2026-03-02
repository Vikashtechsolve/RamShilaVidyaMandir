import { useEffect, useState } from 'react'
import { getSeating, setSeatStatus } from '../lib/api'

const STATUS_OPTIONS = ['available', 'occupied', 'dual']
const STATUS_LABELS = { available: '🟢 Available', occupied: '🔴 Occupied', dual: '🟡 Dual Shift' }
const STATUS_CLASS = { available: 'seat-available', occupied: 'seat-occupied', dual: 'seat-dual' }
const STATUS_ICON = { available: '🪑', occupied: '🙎', dual: '👥' }

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

export default function Seating() {
  const [grid, setGrid] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('available')
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      setGrid(await getSeating())
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load seating')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const allSeats = grid.flat()
  const available = allSeats.filter(s => s.status === 'available').length
  const occupied = allSeats.filter(s => s.status === 'occupied').length
  const dual = allSeats.filter(s => s.status === 'dual').length

  function openSeat(seat) {
    setSelected(seat)
    setNewStatus(seat.status)
  }

  async function handleStatusChange(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await setSeatStatus(selected.id, newStatus)
      setGrid(updated)
      setSelected(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update seat')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h3>Seating Chart</h3>
        <button className="btn btn-outline" onClick={load}>🔄 Refresh</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        <div className="stat-card green">
          <span className="stat-icon">🪑</span>
          <span className="stat-label">Available</span>
          <span className="stat-value">{available}</span>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">🙎</span>
          <span className="stat-label">Occupied</span>
          <span className="stat-value">{occupied}</span>
        </div>
        <div className="stat-card yellow">
          <span className="stat-icon">👥</span>
          <span className="stat-label">Dual Shift</span>
          <span className="stat-value">{dual}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <div className={`seat-cell ${STATUS_CLASS[s]}`} style={{ width: 24, height: 24, fontSize: 10, borderRadius: 4, cursor: 'default' }} />
            <span>{STATUS_LABELS[s]}</span>
          </div>
        ))}
        <span style={{ fontSize: 12, color: 'var(--text-light)', alignSelf: 'center' }}>— Click a seat to change its status</span>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">⏳ Loading seating chart...</div>
        ) : grid.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💺</div>
            <p>No seats found in the database.</p>
          </div>
        ) : (
          <div className="seat-grid">
            {grid.map((row, ri) => (
              <div key={ri} className="seat-row">
                {row.map(seat => (
                  <div
                    key={seat.id}
                    className={`seat-cell ${STATUS_CLASS[seat.status] || 'seat-available'}`}
                    onClick={() => openSeat(seat)}
                    title={`${seat.id} — ${seat.status}`}
                  >
                    <span className="seat-icon">{STATUS_ICON[seat.status] || '🪑'}</span>
                    <span>{seat.id.replace('R', '').replace('C', ',')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Modal title={`Seat ${selected.id}`} onClose={() => setSelected(null)}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>
              Current status: <span className={`badge ${selected.status === 'available' ? 'badge-green' : selected.status === 'occupied' ? 'badge-red' : 'badge-yellow'}`}>{selected.status}</span>
            </div>
          </div>
          <form onSubmit={handleStatusChange}>
            <div className="form-group">
              <label>Change Status To:</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                {STATUS_OPTIONS.map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={newStatus === s}
                      onChange={() => setNewStatus(s)}
                    />
                    {STATUS_LABELS[s]}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Seat'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
