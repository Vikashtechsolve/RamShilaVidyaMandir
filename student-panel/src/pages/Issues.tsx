import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { listIssues, submitIssue, Issue } from '../lib/api'

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    listIssues().then(setIssues).catch((err: unknown) => {
      const msg = isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ?? err.message)
        : 'Failed to load issues'
      setError(msg)
    })
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const created = await submitIssue({ subject, description })
      setIssues([created, ...issues])
      setSubject(''); setDescription('')
    } catch (err: unknown) {
      const msg = isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ?? err.message)
        : 'Failed to submit issue'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Submit Issue / Complaint</h3>
        <p className="muted">Share problems or feedback with admin</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
          <label>
            <div className="label">Subject</div>
            <input value={subject} onChange={e => setSubject(e.target.value)} required
                   style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          </label>
          <label>
            <div className="label">Description</div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4}
                      style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          </label>
          <button disabled={loading} type="submit" style={{ padding: 10, borderRadius: 8 }}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>My Issues</h3>
        <div className="issue-list">
          {issues.map(x => (
            <div className="issue-item" key={x.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.subject}</strong>
                <span className="status badge" style={{ background: x.status === 'Solved' ? 'var(--green)' : 'var(--blue)' }}>
                  {x.status}
                </span>
              </div>
              <div className="muted" style={{ marginTop: 6 }}>{x.description}</div>
              {x.adminResponse && <div style={{ marginTop: 8 }}>
                <div className="label">Admin Response</div>
                <div>{x.adminResponse}</div>
              </div>}
              <div className="muted" style={{ marginTop: 6 }}>{new Date(x.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {issues.length === 0 && <div className="muted">No issues yet.</div>}
        </div>
      </div>
    </div>
  )
}
