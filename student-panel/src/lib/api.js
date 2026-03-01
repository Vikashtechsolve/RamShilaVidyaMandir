import axios from 'axios'
import { getSession } from './session'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const s = getSession()
  if (s?.token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${s.token}`
  }
  return config
})

export async function checkHealth() {
  try {
    const { data } = await api.get('/health')
    return data?.ok === true
  } catch {
    return false
  }
}

export async function fetchSummary() {
  const { data } = await api.get('/student/me/summary')
  return data
}

export async function fetchProfile() {
  const { data } = await api.get('/student/me/profile')
  return data
}

export async function fetchFees() {
  const { data } = await api.get('/student/me/fees')
  return data
}

export async function fetchSeat() {
  const { data } = await api.get('/student/me/seat')
  return data
}

export async function listIssues() {
  const { data } = await api.get('/student/me/issues')
  return data
}

export async function submitIssue(payload) {
  const { data } = await api.post('/student/me/issues', payload)
  return data
}

export async function loginStudent(payload) {
  const { data } = await api.post('/auth/login', { ...payload, role: 'student' })
  return data
}
