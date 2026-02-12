import { useEffect, useMemo, useState } from 'react'
import { fetchSeat, SeatInfo as SeatData } from '../lib/api'

export default function SeatInfo() {
  const [data, setData] = useState<SeatData | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetchSeat().then(setData).catch(err => {
      setError(err?.response?.data?.message || 'Failed to load seat info')
    })
  }, [])

  const layout = useMemo(() => {
    const seats = Array.from({ length: 48 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`)
    return seats
  }, [])

  return (
    <div>
      <div className="card">
        <h3>Seat Information</h3>
        <p className="muted">Your assigned seat details</p>
        {error && <div className="alert">{error}</div>}
        <div className="field"><span className="label">Seat Number</span><span className="value">#{data?.seatNumber || '-'}</span></div>
        <div className="field"><span className="label">Timing</span><span className="value">{data?.timing || '-'}</span></div>
        <div className="field"><span className="label">Status</span><span className="value">{data?.status || '-'}</span></div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h4>Seat Layout</h4>
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
