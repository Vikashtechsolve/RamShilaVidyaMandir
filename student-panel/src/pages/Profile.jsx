import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { fetchProfile, updateProfile } from '../lib/api'

export default function Profile() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile().then(d => {
      setData(d)
      setName(d?.name || '')
      setMobile(d?.mobile || '')
    }).catch((err) => {
      const msg = isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : 'Failed to load profile'
      setError(msg)
    })
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateProfile({ name, mobile })
      setData({ ...data, name, mobile })
      setEditing(false)
    } catch (err) {
      setError(isAxiosError(err) ? (err.response?.data?.message ?? err.message) : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 className="card-heading">My Profile</h3>
          <p className="muted">Your library membership details — updates sync to Admin</p>
        </div>
        {!editing ? (
          <button className="btn-secondary" onClick={() => setEditing(true)}>Edit Profile</button>
        ) : (
          <button className="btn-secondary" onClick={() => { setEditing(false); setName(data?.name || ''); setMobile(data?.mobile || ''); }}>Cancel</button>
        )}
      </div>
      {error && <div className="alert">{error}</div>}
      {editing ? (
        <form onSubmit={handleSave} className="profile-form">
          <label><span className="label">Name</span><input className="input" value={name} onChange={e => setName(e.target.value)} required /></label>
          <label><span className="label">Mobile</span><input className="input" value={mobile} onChange={e => setMobile(e.target.value)} required /></label>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </form>
      ) : (
        <div className="profile-fields">
          <div className="field"><span className="label">Name</span><span className="value">{data?.name || '-'}</span></div>
          <div className="field"><span className="label">Mobile</span><span className="value">{data?.mobile || '-'}</span></div>
          <div className="field"><span className="label">Email</span><span className="value">{data?.email || '-'}</span></div>
          <div className="field"><span className="label">Joining Date</span><span className="value">{data?.joiningDate ? new Date(data.joiningDate).toLocaleDateString() : '-'}</span></div>
          <div className="field"><span className="label">Package</span><span className="value">{data?.packageName || '-'}</span></div>
          <div className="field"><span className="label">Seat</span><span className="value">#{data?.seatNumber || '-'}</span></div>
          <div className="field"><span className="label">Timing</span><span className="value">{data?.timing || '-'}</span></div>
          <div className="field"><span className="label">Status</span><span className="value">{data?.active ? 'Active' : 'Inactive'}</span></div>
        </div>
      )}
    </div>
  )
}
