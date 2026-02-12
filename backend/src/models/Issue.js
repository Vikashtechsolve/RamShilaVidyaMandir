import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, ref: 'Student.id' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'solved'], default: 'open' },
  response: { type: String, default: '' },
}, { timestamps: true })

export const Issue = mongoose.model('Issue', schema)
