import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  seatId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'occupied', 'dual'], default: 'available' },
}, { timestamps: true })

export const Seat = mongoose.model('Seat', schema)
