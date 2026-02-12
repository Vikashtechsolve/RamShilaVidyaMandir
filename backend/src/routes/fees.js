import { Router } from 'express'
import { Fee } from '../models/Fee.js'
import { Package } from '../models/Package.js'
import { Student } from '../models/Student.js'

const r = Router()

r.get('/', async (req, res) => {
  try {
    const list = await Fee.find({})
    const out = list.map(f => {
      const o = f.toObject()
      o.dueDate = o.dueDate ? o.dueDate.toISOString().slice(0, 10) : null
      return o
    })
    res.json(out)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.post('/assign', async (req, res) => {
  try {
    const { studentId, packageId } = req.body || {}
    if (!studentId || !packageId) return res.status(400).json({ message: 'studentId and packageId required' })
    const pkg = await Package.findOne({ id: packageId })
    if (!pkg) return res.status(404).json({ message: 'Package not found' })
    const student = await Student.findOne({ id: studentId })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const dueDate = new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000)
    const existing = await Fee.findOne({ studentId })
    if (existing) {
      existing.packageId = packageId
      existing.status = 'pending'
      existing.dueDate = dueDate
      await existing.save()
      const o = existing.toObject()
      o.dueDate = o.dueDate ? o.dueDate.toISOString().slice(0, 10) : null
      return res.json(o)
    }
    const fee = await Fee.create({ studentId, packageId, status: 'pending', dueDate })
    const o = fee.toObject()
    o.dueDate = o.dueDate ? o.dueDate.toISOString().slice(0, 10) : null
    res.status(201).json(o)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.post('/:studentId/mark-paid', async (req, res) => {
  try {
    const { studentId } = req.params
    const f = await Fee.findOne({ studentId })
    if (!f) return res.status(404).json({ message: 'Fee record not found' })
    f.status = 'paid'
    f.dueDate = null
    await f.save()
    const o = f.toObject()
    o.dueDate = null
    res.json(o)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export const feesRouter = r
