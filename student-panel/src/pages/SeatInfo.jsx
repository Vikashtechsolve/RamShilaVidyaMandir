import { useEffect, useMemo, useState } from 'react'
import { fetchSeat } from '../lib/api'

export default function SeatInfo() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSeat().then(setData).catch(err => {
      setError(err?.response?.data?.message || 'Failed to load seat info')
    })
  }, [])

  const layout = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`)
  }, [])

  return (
    <div>
      <div className="glass-card">
        <h3 className="card-heading">Seat Allocation</h3>
        <p className="muted">Your assigned seat details</p>
        {error && <div className="alert">{error}</div>}
        <div className="field"><span className="label">Seat Number</span><span className="value">#{data?.seatNumber || '-'}</span></div>
        <div className="field"><span className="label">Timing</span><span className="value">{data?.timing || '-'}</span></div>
        <div className="field"><span className="label">Status</span><span className="value">{data?.status || '-'}</span></div>
      </div>
      <div className="glass-card" style={{ marginTop: 16 }}>
        <h4 className="card-heading">Seat Layout</h4>
        <p className="muted">Simple highlight shows your seat</p>
        <div className="seat-layout">
          {layout.map(seat => {
            const isActive = `#${data?.seatNumber}` === `#${seat}`
            return (
              <div key={seat} className={`seat ${isActive ? 'active' : ''}`}>
                {seat}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
