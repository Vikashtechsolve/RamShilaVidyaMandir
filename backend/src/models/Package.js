import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  duration: { type: Number, required: true },
}, { timestamps: true })

export const Package = mongoose.model('Package', schema)
