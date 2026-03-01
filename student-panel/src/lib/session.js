const KEY = 'student_session'

export function getSession() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function setSession(s) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

export function logout() {
  localStorage.removeItem(KEY)
}
