import { Router } from 'express'
import { Student } from '../models/Student.js'
import { Fee } from '../models/Fee.js'
import { Package } from '../models/Package.js'
import { Issue } from '../models/Issue.js'
import { SeatAssignment } from '../models/SeatAssignment.js'

function seatIdToDisplay(id) {
  if (!id) return id
  const m = id.match(/R(\d+)C(\d+)/)
  if (!m) return id
  const row = parseInt(m[1], 10)
  const col = parseInt(m[2], 10)
  const n = (row - 1) * 8 + col
  return `S${String(n).padStart(2, '0')}`
}

export function studentRouter() {
  const r = Router()

  r.get('/summary', async (req, res) => {
    try {
      const studentId = req.user?.studentId
      if (!studentId) return res.status(401).json({ message: 'Unauthorized' })
      const student = await Student.findOne({ id: studentId })
      if (!student) return res.status(404).json({ message: 'Student not found' })
      const fee = await Fee.findOne({ studentId })
      const pkg = fee ? await Package.findOne({ id: fee.packageId }) : null
      const assignment = await SeatAssignment.findOne({ studentId })
      const feeStatus = !fee ? 'Pending' : fee.status === 'paid' ? 'Paid' : 'Pending'
      const packageName = pkg ? pkg.name : '-'
      const packageDuration = pkg ? `${pkg.duration} days` : '-'
      res.json({
        id: student.id,
        name: student.name.split(' ')[0],
        packageName,
        packageDuration,
        feeStatus,
        dueDate: fee?.dueDate ? fee.dueDate.toISOString().slice(0, 10) : null,
        seatNumber: assignment ? seatIdToDisplay(assignment.seatId) : '-',
        timing: assignment?.timing || '-',
        active: student.status === 'active',
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  r.get('/profile', async (req, res) => {
    try {
      const studentId = req.user?.studentId
      if (!studentId) return res.status(401).json({ message: 'Unauthorized' })
      const student = await Student.findOne({ id: studentId })
      if (!student) return res.status(404).json({ message: 'Student not found' })
      const assignment = await SeatAssignment.findOne({ studentId })
      const fee = await Fee.findOne({ studentId })
      const pkg = fee ? await Package.findOne({ id: fee.packageId }) : null
      const createdAt = student.createdAt ? student.createdAt.toISOString().slice(0, 10) : '2024-01-15'
      res.json({
        name: student.name,
        joiningDate: createdAt,
        packageName: pkg?.name || '-',
        seatNumber: assignment ? seatIdToDisplay(assignment.seatId) : '-',
        timing: assignment?.timing || '-',
        active: student.status === 'active',
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  r.get('/fees', async (req, res) => {
    try {
      const studentId = req.user?.studentId
      if (!studentId) return res.status(401).json({ message: 'Unauthorized' })
      const fee = await Fee.findOne({ studentId })
      const pkg = fee ? await Package.findOne({ id: fee.packageId }) : null
      const totalAmount = pkg?.amount ?? 0
      const paidAmount = fee?.status === 'paid' ? totalAmount : 0
      const pendingAmount = fee?.status !== 'paid' ? totalAmount : 0
      const dueDate = fee?.dueDate ? fee.dueDate.toISOString().slice(0, 10) : null
      let status = 'Pending'
      if (fee?.status === 'paid') status = 'Paid'
      else if (fee?.dueDate) {
        const days = Math.ceil((new Date(fee.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
        if (days <= 7) status = 'Due Soon'
      }
      res.json({
        totalAmount,
        paidAmount,
        pendingAmount,
        dueDate,
        status,
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  r.get('/seat', async (req, res) => {
    try {
      const studentId = req.user?.studentId
      if (!studentId) return res.status(401).json({ message: 'Unauthorized' })
      const assignment = await SeatAssignment.findOne({ studentId })
      if (!assignment) return res.json({ seatNumber: '-', timing: '-', status: 'Inactive' })
      res.json({
        seatNumber: seatIdToDisplay(assignment.seatId),
        timing: assignment.timing || '-',
        status: 'Active',
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  r.get('/issues', async (req, res) => {
    try {
      const studentId = req.user?.studentId
      if (!studentId) return res.status(401).json({ message: 'Unauthorized' })
      const list = await Issue.find({ studentId }).sort({ createdAt: -1 })
      const out = list.map(i => ({
        id: i.id,
        subject: i.title,
        description: i.message,
        status: i.status === 'solved' ? 'Solved' : 'Open',
        adminResponse: i.response || undefined,
        createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : new Date().toISOString(),
      }))
      res.json(out)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  r.post('/issues', async (req, res) => {
    try {
      const studentId = req.user?.studentId
      if (!studentId) return res.status(401).json({ message: 'Unauthorized' })
      const { subject, description } = req.body || {}
      if (!subject || !description) return res.status(400).json({ message: 'subject and description required' })
      const id = `I${Math.floor(100 + Math.random() * 900)}`
      const issue = await Issue.create({
        id,
        studentId,
        title: subject,
        message: description,
        status: 'open',
        response: '',
      })
      res.status(201).json({
        id: issue.id,
        subject: issue.title,
        description: issue.message,
        status: 'Open',
        adminResponse: undefined,
        createdAt: issue.createdAt ? new Date(issue.createdAt).toISOString() : new Date().toISOString(),
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  return r
}
