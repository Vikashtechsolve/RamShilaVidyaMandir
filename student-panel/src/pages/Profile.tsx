import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { fetchProfile, StudentProfile } from '../lib/api'

export default function Profile() {
  const [data, setData] = useState<StudentProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetchProfile().then(setData).catch((err: unknown) => {
      const msg = isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ?? err.message)
        : 'Failed to load profile'
      setError(msg)
    })
  }, [])
  return (
    <div className="card">
      <h3>My Profile</h3>
      <p className="muted">View only</p>
      {error && <div className="alert">{error}</div>}
      <div>
        <div className="field"><span className="label">Name</span><span className="value">{data?.name || '-'}</span></div>
        <div className="field"><span className="label">Joining Date</span><span className="value">{data?.joiningDate ? new Date(data.joiningDate).toLocaleDateString() : '-'}</span></div>
        <div className="field"><span className="label">Package</span><span className="value">{data?.packageName || '-'}</span></div>
        <div className="field"><span className="label">Seat</span><span className="value">#{data?.seatNumber || '-'}</span></div>
        <div className="field"><span className="label">Timing</span><span className="value">{data?.timing || '-'}</span></div>
        <div className="field"><span className="label">Status</span><span className="value">{data?.active ? 'Active' : 'Inactive'}</span></div>
      </div>
    </div>
  )
}
