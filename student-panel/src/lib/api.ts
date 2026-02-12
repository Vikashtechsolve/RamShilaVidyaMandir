import axios from 'axios'
import { getSession } from './session'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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

export type StudentSummary = {
  id: string
  name: string
  packageName: string
  packageDuration: string
  feeStatus: 'Paid' | 'Pending'
  dueDate: string
  seatNumber: string
  timing: 'Morning' | 'Evening' | 'Full Day'
  active: boolean
}

export type FeeInfo = {
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  dueDate: string
  status: 'Paid' | 'Pending' | 'Due Soon'
}

export type StudentProfile = {
  name: string
  joiningDate: string
  packageName: string
  seatNumber: string
  timing: 'Morning' | 'Evening' | 'Full Day'
  active: boolean
}

export type SeatInfo = {
  seatNumber: string
  timing: 'Morning' | 'Evening' | 'Full Day'
  status: 'Active' | 'Inactive'
}

export type Issue = {
  id: string
  subject: string
  description: string
  status: 'Open' | 'Solved'
  adminResponse?: string
  createdAt: string
}

export async function fetchSummary(): Promise<StudentSummary> {
  const { data } = await api.get('/student/me/summary')
  return data
}
export async function fetchProfile(): Promise<StudentProfile> {
  const { data } = await api.get('/student/me/profile')
  return data
}
export async function fetchFees(): Promise<FeeInfo> {
  const { data } = await api.get('/student/me/fees')
  return data
}
export async function fetchSeat(): Promise<SeatInfo> {
  const { data } = await api.get('/student/me/seat')
  return data
}
export async function listIssues(): Promise<Issue[]> {
  const { data } = await api.get('/student/me/issues')
  return data
}
export async function submitIssue(payload: { subject: string, description: string }): Promise<Issue> {
  const { data } = await api.post('/student/me/issues', payload)
  return data
}
export async function loginStudent(payload: { email: string, password: string }): Promise<{ token: string, role: 'student', name?: string }> {
  const { data } = await api.post('/auth/login', { ...payload, role: 'student' })
  return data
}
