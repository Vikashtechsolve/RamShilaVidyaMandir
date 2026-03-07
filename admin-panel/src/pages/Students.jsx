import { useEffect, useState, useCallback } from 'react'
import { getStudents, searchStudents, createStudent, updateStudent, deleteStudent, toggleStudentStatus, setStudentPassword } from '../lib/api'

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

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} title="Copy" style={{
      background: 'none', border: 'none', cursor: 'pointer',
      fontSize: 13, color: copied ? 'var(--success)' : 'var(--text-light)',
      padding: '0 4px'
    }}>
      {copied ? '✅' : '📋'}
    </button>
  )
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')

  // modals
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(null)
  const [showDelete, setShowDelete] = useState(null)
  const [showPassword, setShowPassword] = useState(null)
  const [showLoginInfo, setShowLoginInfo] = useState(null)

  const [form, setForm] = useState({ name: '', mobile: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [saving, setSaving] = useState(false)

  // track plain-text passwords set by admin (stored in memory per session)
  const [knownPasswords, setKnownPasswords] = useState({})

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
    if (isError) { setError(msg); setTimeout(() => setError(''), 4000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 4000) }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const student = await createStudent(form)
      // default password is student123
      setKnownPasswords(prev => ({ ...prev, [student.id]: 'student123' }))
      flash(`Student added! Login: ${student.email} / student123`)
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

  async function handleSetPassword(e) {
    e.preventDefault()
    if (passwordForm.password !== passwordForm.confirm) {
      flash('Passwords do not match', true)
      return
    }
    if (passwordForm.password.length < 4) {
      flash('Password must be at least 4 characters', true)
      return
    }
    setSaving(true)
    try {
      await setStudentPassword(showPassword.id, passwordForm.password)
      setKnownPasswords(prev => ({ ...prev, [showPassword.id]: passwordForm.password }))
      flash(`Password updated for ${showPassword.name}!`)
      setShowPassword(null)
      setPasswordForm({ password: '', confirm: '' })
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to set password', true)
    } finally { setSaving(false) }
  }

  function openEdit(s) {
    setForm({ name: s.name, mobile: s.mobile, email: s.email })
    setShowEdit(s)
  }

  function openAdd() {
    setForm({ name: '', mobile: '', email: '' })
    setShowAdd(true)
  }

  function openPassword(s) {
    setPasswordForm({ password: '', confirm: '' })
    setShowPwd(false)
    setShowPassword(s)
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
                  <th>Login Email</th>
                  <th>Password</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>
                      <code style={{ fontSize: 12, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>{s.id}</code>
                    </td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.mobile}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 13, color: 'var(--accent)' }}>{s.email}</span>
                        <CopyBtn text={s.email} />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {knownPasswords[s.id] ? (
                          <>
                            <code style={{ fontSize: 12, background: '#F0FDF4', color: '#065F46', padding: '2px 8px', borderRadius: 4, border: '1px solid #BBF7D0' }}>
                              {knownPasswords[s.id]}
                            </code>
                            <CopyBtn text={knownPasswords[s.id]} />
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--text-light)' }}>••••••••</span>
                        )}
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openPassword(s)}
                          title="Set Password"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                        >
                          🔑 Set
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowLoginInfo(s)}>👁️ Login Info</button>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                        <button
                          className={`btn btn-sm ${s.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggle(s.id)}
                        >
                          {s.status === 'active' ? '🚫' : '✅'}
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

      {/* ── Add Modal ── */}
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
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>
              🔑 Default password will be: <strong>student123</strong><br />
              <span style={{ color: 'var(--text-light)', fontSize: 12 }}>You can change it after adding the student.</span>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Student'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
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

      {/* ── Set Password Modal ── */}
      {showPassword && (
        <Modal title={`Set Password — ${showPassword.name}`} onClose={() => setShowPassword(null)}>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
            📧 Login Email: <strong style={{ color: 'var(--accent)' }}>{showPassword.email}</strong>
            <CopyBtn text={showPassword.email} />
          </div>
          <form onSubmit={handleSetPassword}>
            <div className="form-group">
              <label>New Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  type={showPwd ? 'text' : 'password'}
                  value={passwordForm.password}
                  onChange={e => setPasswordForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 4 characters"
                  required
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                className="form-control"
                type={showPwd ? 'text' : 'password'}
                value={passwordForm.confirm}
                onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Re-enter password"
                required
              />
              {passwordForm.confirm && passwordForm.password !== passwordForm.confirm && (
                <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4, display: 'block' }}>Passwords do not match</span>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setShowPassword(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving || passwordForm.password !== passwordForm.confirm}>
                {saving ? 'Saving...' : '🔑 Set Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Login Info Modal ── */}
      {showLoginInfo && (
        <Modal title={`Login Details — ${showLoginInfo.name}`} onClose={() => setShowLoginInfo(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student ID</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <code style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{showLoginInfo.id}</code>
                <CopyBtn text={showLoginInfo.id} />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Login Email</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{showLoginInfo.email}</span>
                <CopyBtn text={showLoginInfo.email} />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</div>
              {knownPasswords[showLoginInfo.id] ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <code style={{ fontSize: 15, fontWeight: 700, color: '#065F46', background: '#D1FAE5', padding: '3px 10px', borderRadius: 6 }}>
                    {knownPasswords[showLoginInfo.id]}
                  </code>
                  <CopyBtn text={knownPasswords[showLoginInfo.id]} />
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>
                    Password not visible — it was set before this session.<br />
                    Default is <code style={{ background: '#F1F5F9', padding: '1px 6px', borderRadius: 4 }}>student123</code> unless changed.
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => { setShowLoginInfo(null); openPassword(showLoginInfo) }}>
                    🔑 Set New Password
                  </button>
                </div>
              )}
            </div>

            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: 14, fontSize: 13 }}>
              <strong>Student Panel Login:</strong><br />
              <span style={{ color: 'var(--text-light)', fontSize: 12 }}>Students can log in at the Student Panel with the email and password above.</span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setShowLoginInfo(null)}>Close</button>
            <button className="btn btn-primary" onClick={() => { setShowLoginInfo(null); openPassword(showLoginInfo) }}>🔑 Change Password</button>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
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
