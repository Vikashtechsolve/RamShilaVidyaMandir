import { Router } from 'express'
import { Package } from '../models/Package.js'

const r = Router()

r.get('/', async (req, res) => {
  try {
    const list = await Package.find({}).sort({ createdAt: -1 })
    res.json(list.map(doc => doc.toObject()))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.post('/', async (req, res) => {
  try {
    const { name, amount, duration } = req.body || {}
    if (!name || amount == null || duration == null) {
      return res.status(400).json({ message: 'Name, amount and duration required' })
    }
    const amt = Number(amount)
    const dur = Number(duration)
    if (amt < 1 || amt > 100000) return res.status(400).json({ message: 'Amount out of range' })
    if (dur < 1 || dur > 365) return res.status(400).json({ message: 'Duration out of range' })
    const id = `P${Math.floor(100 + Math.random() * 900)}`
    const pkg = await Package.create({ id, name, amount: amt, duration: dur })
    res.status(201).json(pkg.toObject())
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export const packagesRouter = r
