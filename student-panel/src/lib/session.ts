export type Session = {
  token: string
  role: 'student' | 'admin' | string
  name?: string
}

const KEY = 'student_session'

export function getSession(): Session | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as Session } catch { return null }
}

export function setSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

export function logout() {
  localStorage.removeItem(KEY)
}
