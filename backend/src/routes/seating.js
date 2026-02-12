import { Router } from 'express'
import { Seat } from '../models/Seat.js'

function buildGrid(seats) {
  const sorted = [...seats].sort((a, b) => {
    const ma = a.seatId.match(/R(\d+)C(\d+)/)
    const mb = b.seatId.match(/R(\d+)C(\d+)/)
    if (!ma || !mb) return 0
    const ra = parseInt(ma[1], 10)
    const ca = parseInt(ma[2], 10)
    const rb = parseInt(mb[1], 10)
    const cb = parseInt(mb[2], 10)
    return ra !== rb ? ra - rb : ca - cb
  })
  const grid = []
  for (let i = 0; i < sorted.length; i += 8) {
    grid.push(sorted.slice(i, i + 8).map(s => ({ id: s.seatId, status: s.status })))
  }
  return grid
}

const r = Router()

r.get('/', async (req, res) => {
  try {
    const seats = await Seat.find({})
    const grid = buildGrid(seats)
    res.json(grid)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.patch('/:id/toggle', async (req, res) => {
  try {
    const seatId = req.params.id
    const seat = await Seat.findOne({ seatId })
    if (!seat) return res.status(404).json({ message: 'Seat not found' })
    seat.status = seat.status === 'occupied' ? 'available' : 'occupied'
    await seat.save()
    const seats = await Seat.find({})
    res.json(buildGrid(seats))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

r.patch('/:id/status', async (req, res) => {
  try {
    const seatId = req.params.id
    const { status } = req.body || {}
    if (!['available', 'occupied', 'dual'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const seat = await Seat.findOne({ seatId })
    if (!seat) return res.status(404).json({ message: 'Seat not found' })
    seat.status = status
    await seat.save()
    const seats = await Seat.find({})
    res.json(buildGrid(seats))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export const seatingRouter = r
