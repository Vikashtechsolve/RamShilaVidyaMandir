import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('admin_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then(r => r.data)

export const getStudents = () => api.get('/admin/students').then(r => r.data)
export const searchStudents = (q) => api.get(`/admin/students/search?q=${encodeURIComponent(q)}`).then(r => r.data)
export const createStudent = (data) => api.post('/admin/students', data).then(r => r.data)
export const updateStudent = (id, data) => api.put(`/admin/students/${id}`, data).then(r => r.data)
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`).then(r => r.data)
export const toggleStudentStatus = (id) => api.patch(`/admin/students/${id}/toggle-status`).then(r => r.data)
export const setStudentPassword = (id, password) => api.patch(`/admin/students/${id}/set-password`, { password }).then(r => r.data)

export const getFees = () => api.get('/admin/fees').then(r => r.data)
export const assignFee = (studentId, packageId) => api.post('/admin/fees/assign', { studentId, packageId }).then(r => r.data)
export const markFeePaid = (studentId) => api.post(`/admin/fees/${studentId}/mark-paid`).then(r => r.data)

export const getPackages = () => api.get('/admin/packages').then(r => r.data)
export const createPackage = (data) => api.post('/admin/packages', data).then(r => r.data)

export const getIssues = () => api.get('/admin/issues').then(r => r.data)
export const respondIssue = (id, response) => api.patch(`/admin/issues/${id}/respond`, { response }).then(r => r.data)
export const toggleIssueStatus = (id) => api.patch(`/admin/issues/${id}/toggle-status`).then(r => r.data)

export const getSeating = () => api.get('/admin/seating').then(r => r.data)
export const toggleSeat = (id) => api.patch(`/admin/seating/${id}/toggle`).then(r => r.data)
export const setSeatStatus = (id, status) => api.patch(`/admin/seating/${id}/status`, { status }).then(r => r.data)

export const getReportSummary = () => api.get('/admin/reports/summary').then(r => r.data)
export const getReportRows = () => api.get('/admin/reports/rows').then(r => r.data)
