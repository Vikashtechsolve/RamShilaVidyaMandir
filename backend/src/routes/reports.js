import { Router } from 'express'
import { Student } from '../models/Student.js'
import { Fee } from '../models/Fee.js'

const r = Router()

r.get('/summary', async (req, res) => {
  try {
    const students = await Student.find({})
    const fees = await Fee.find({})
    const total = students.length
    const active = students.filter(s => s.status === 'active').length
    const inactive = total - active
    const pendingFees = fees.filter(f => f.status === 'pending').length
    const dueSoon = fees.filter(f => f.status === 'due').length
    const monthlyCollection = fees.filter(f => f.status === 'paid').length
    res.json({ total, active, inactive, pendingFees, dueSoon, monthlyCollection })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.get('/rows', async (req, res) => {
  try {
    const students = await Student.find({})
    const fees = await Fee.find({})
    const rows = students.map(s => {
      const f = fees.find(x => x.studentId === s.id)
      return {
        id: s.id,
        name: s.name,
        mobile: s.mobile,
        status: s.status,
        feeStatus: f ? f.status : 'pending',
        dueDate: f?.dueDate ? f.dueDate.toISOString().slice(0, 10) : null,
      }
    })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export const reportsRouter = r
