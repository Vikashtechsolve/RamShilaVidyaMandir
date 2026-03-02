import { useEffect, useState } from 'react'
import { getReportRows, getReportSummary } from '../lib/api'

function feeStatusBadge(status) {
  const map = { paid: 'badge-green', pending: 'badge-yellow', due: 'badge-red', overdue: 'badge-red' }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status || 'N/A'}</span>
}

export default function Reports() {
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [feeFilter, setFeeFilter] = useState('all')

  useEffect(() => {
    Promise.all([getReportRows(), getReportSummary()])
      .then(([r, s]) => { setRows(r); setSummary(s) })
      .catch(e => setError(e.response?.data?.message || 'Failed to load report'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = rows.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.mobile.includes(search) || r.id.toLowerCase().includes(search.toLowerCase())
    const matchFee = feeFilter === 'all' || r.feeStatus === feeFilter
    return matchSearch && matchFee
  })

  function exportCSV() {
    const headers = ['ID', 'Name', 'Mobile', 'Status', 'Fee Status', 'Due Date']
    const csvRows = [headers.join(',')]
    filtered.forEach(r => {
      csvRows.push([r.id, `"${r.name}"`, r.mobile, r.status, r.feeStatus, r.dueDate || ''].join(','))
    })
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `library-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="page-header">
        <h3>Reports</h3>
        <button className="btn btn-success" onClick={exportCSV} disabled={loading || filtered.length === 0}>
          ⬇️ Export CSV
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {summary && (
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card blue"><span className="stat-icon">🎓</span><span className="stat-label">Total Students</span><span className="stat-value">{summary.total}</span></div>
          <div className="stat-card green"><span className="stat-icon">✅</span><span className="stat-label">Active</span><span className="stat-value">{summary.active}</span></div>
          <div className="stat-card red"><span className="stat-icon">🚫</span><span className="stat-label">Inactive</span><span className="stat-value">{summary.inactive}</span></div>
          <div className="stat-card yellow"><span className="stat-icon">⏳</span><span className="stat-label">Pending Fees</span><span className="stat-value">{summary.pendingFees}</span></div>
          <div className="stat-card green"><span className="stat-icon">💰</span><span className="stat-label">Paid Fees</span><span className="stat-value">{summary.monthlyCollection}</span></div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="search-input"
          placeholder="🔍 Search by name, ID or mobile..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <select
          className="form-control"
          style={{ width: 160 }}
          value={feeFilter}
          onChange={e => setFeeFilter(e.target.value)}
        >
          <option value="all">All Fee Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="due">Due</option>
          <option value="overdue">Overdue</option>
        </select>
        <span style={{ fontSize: 12, color: 'var(--text-light)' }}>
          Showing {filtered.length} of {rows.length} students
        </span>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading">⏳ Generating report...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>No records match your filters.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Student Status</th>
                  <th>Fee Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td><code style={{ fontSize: 12, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>{r.id}</code></td>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td>{r.mobile}</td>
                    <td>
                      <span className={`badge ${r.status === 'active' ? 'badge-green' : 'badge-red'}`}>{r.status}</span>
                    </td>
                    <td>{feeStatusBadge(r.feeStatus)}</td>
                    <td style={{ color: r.dueDate ? 'var(--text)' : 'var(--text-light)', fontSize: 13 }}>
                      {r.dueDate || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
