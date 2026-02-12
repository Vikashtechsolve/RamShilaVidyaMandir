import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { Student } from '../models/Student.js'

const r = Router()

r.get('/', async (req, res) => {
  try {
    const list = await Student.find({}).select('-passwordHash').sort({ createdAt: -1 })
    res.json(list.map(doc => doc.toObject()))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim()
    if (!q) {
      const list = await Student.find({}).select('-passwordHash').sort({ createdAt: -1 })
      return res.json(list.map(doc => doc.toObject()))
    }
    const regex = new RegExp(q, 'i')
    const list = await Student.find({
      $or: [
        { name: regex },
        { mobile: regex },
        { email: regex },
      ]
    }).select('-passwordHash')
    res.json(list.map(doc => doc.toObject()))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.post('/', async (req, res) => {
  try {
    const { name, mobile, email } = req.body || {}
    if (!name || !mobile) return res.status(400).json({ message: 'Name and mobile required' })
    const id = `S${Math.floor(1000 + Math.random() * 9000)}`
    const em = (email || `${id.toLowerCase()}@library.local`).trim().toLowerCase()
    const existing = await Student.findOne({ email: em })
    if (existing) return res.status(400).json({ message: 'Email already exists' })
    const passwordHash = await bcrypt.hash('student123', 10)
    const student = await Student.create({ id, name, mobile, email: em, passwordHash, status: 'active' })
    res.status(201).json({ id: student.id, name: student.name, mobile: student.mobile, email: student.email, status: student.status })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const student = await Student.findOne({ id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    const { name, mobile, email } = req.body || {}
    if (name !== undefined) student.name = name
    if (mobile !== undefined) student.mobile = mobile
    if (email !== undefined) student.email = email.trim().toLowerCase()
    await student.save()
    const { passwordHash, ...out } = student.toObject()
    res.json(out)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await Student.deleteOne({ id })
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Student not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.patch('/:id/toggle-status', async (req, res) => {
  try {
    const id = req.params.id
    const student = await Student.findOne({ id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    student.status = student.status === 'active' ? 'inactive' : 'active'
    await student.save()
    const { passwordHash, ...out } = student.toObject()
    res.json(out)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export const studentsRouter = r
