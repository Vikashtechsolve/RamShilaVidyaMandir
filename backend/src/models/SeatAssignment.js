import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  seatId: { type: String, required: true, ref: 'Seat.seatId' },
  studentId: { type: String, required: true, ref: 'Student.id' },
  timing: { type: String, enum: ['Morning', 'Evening', 'Full Day'], required: true },
}, { timestamps: true })

schema.index({ studentId: 1 }, { unique: true })
schema.index({ seatId: 1 }, { unique: true })

export const SeatAssignment = mongoose.model('SeatAssignment', schema)
