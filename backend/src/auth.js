import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Student } from './models/Student.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123'

export function verifyToken(req, res, next) {
  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export function requireStudent(req, res, next) {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ message: 'Student access required' })
  }
  next()
}

export async function loginAdmin(username, password) {
  const u = (username || '').trim().toLowerCase()
  const p = String(password || '')
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    return {
      token: jwt.sign({ role: 'admin', username: u }, JWT_SECRET, { expiresIn: JWT_EXPIRES }),
      role: 'admin',
      name: 'Admin',
    }
  }
  return null
}

export async function loginStudent(email, password) {
  const e = (email || '').trim().toLowerCase()
  const student = await Student.findOne({ email: e })
  if (!student) return null
  const ok = await bcrypt.compare(String(password || ''), student.passwordHash || '')
  if (!ok) return null
  return {
    token: jwt.sign({ role: 'student', studentId: student.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES }),
    role: 'student',
    name: student.name,
  }
}
