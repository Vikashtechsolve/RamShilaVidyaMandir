import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student.id' },
  packageId: { type: String, required: true, ref: 'Package.id' },
  status: { type: String, enum: ['pending', 'paid', 'due'], default: 'pending' },
  dueDate: { type: Date, default: null },
}, { timestamps: true })

schema.index({ studentId: 1 }, { unique: true })

export const Fee = mongoose.model('Fee', schema)
