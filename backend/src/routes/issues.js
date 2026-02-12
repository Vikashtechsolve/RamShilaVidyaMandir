import { Router } from 'express'
import { Issue } from '../models/Issue.js'

const r = Router()

r.get('/', async (req, res) => {
  try {
    const list = await Issue.find({}).sort({ createdAt: -1 })
    const out = list.map(i => {
      const o = i.toObject()
      o.createdAt = o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
      return o
    })
    res.json(out)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.post('/', async (req, res) => {
  try {
    const { studentId, title, message } = req.body || {}
    if (!studentId || !title || !message) return res.status(400).json({ message: 'studentId, title and message required' })
    const id = `I${Math.floor(100 + Math.random() * 900)}`
    const issue = await Issue.create({ id, studentId, title, message, status: 'open', response: '' })
    const o = issue.toObject()
    o.createdAt = o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
    res.status(201).json(o)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.patch('/:id/respond', async (req, res) => {
  try {
    const id = req.params.id
    const { response } = req.body || {}
    const issue = await Issue.findOne({ id })
    if (!issue) return res.status(404).json({ message: 'Issue not found' })
    issue.response = response || ''
    issue.status = 'solved'
    await issue.save()
    const o = issue.toObject()
    o.createdAt = o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
    res.json(o)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.patch('/:id/toggle-status', async (req, res) => {
  try {
    const id = req.params.id
    const issue = await Issue.findOne({ id })
    if (!issue) return res.status(404).json({ message: 'Issue not found' })
    issue.status = issue.status === 'open' ? 'solved' : 'open'
    await issue.save()
    const o = issue.toObject()
    o.createdAt = o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
    res.json(o)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export const issuesRouter = r
