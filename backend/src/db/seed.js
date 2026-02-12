import bcrypt from 'bcryptjs'
import { Student } from '../models/Student.js'
import { Package } from '../models/Package.js'
import { Fee } from '../models/Fee.js'
import { Issue } from '../models/Issue.js'
import { Seat } from '../models/Seat.js'
import { SeatAssignment } from '../models/SeatAssignment.js'

async function seed() {
  const studentCount = await Student.countDocuments()
  if (studentCount > 0) {
    console.log('Database already seeded, skipping')
    return
  }

  const passwordHash = await bcrypt.hash('student123', 10)

  await Student.insertMany([
    { id: 'S1001', name: 'Aarav Sharma', mobile: '9990012345', email: 's1001@library.local', passwordHash, status: 'active' },
    { id: 'S1002', name: 'Isha Verma', mobile: '9990012346', email: 's1002@library.local', passwordHash, status: 'inactive' },
    { id: 'S1003', name: 'Rohan Gupta', mobile: '9990012347', email: 's1003@library.local', passwordHash, status: 'active' },
  ])

  await Package.insertMany([
    { id: 'P001', name: 'Monthly', amount: 1200, duration: 30 },
    { id: 'P002', name: 'Quarterly', amount: 3200, duration: 90 },
    { id: 'P003', name: 'Half-Yearly', amount: 6000, duration: 180 },
  ])

  await Fee.insertMany([
    { studentId: 'S1001', packageId: 'P001', status: 'paid', dueDate: null },
    { studentId: 'S1002', packageId: 'P001', status: 'pending', dueDate: new Date('2026-02-20') },
    { studentId: 'S1003', packageId: 'P002', status: 'due', dueDate: new Date('2026-02-12') },
  ])

  await Issue.insertMany([
    { id: 'I001', studentId: 'S1002', title: 'Noise complaint', message: 'Too loud near window', status: 'open', response: '' },
    { id: 'I002', studentId: 'S1003', title: 'Seat broken', message: 'Seat R2C5 loose', status: 'open', response: '' },
    { id: 'I003', studentId: 'S1001', title: 'Timing change', message: 'Request evening slot', status: 'solved', response: 'Approved' },
  ])

  const seats = []
  for (let r = 1; r <= 6; r++) {
    for (let c = 1; c <= 8; c++) {
      const seatId = `R${r}C${c}`
      let status = 'available'
      if ((r + c - 2) % 7 === 0) status = 'dual'
      else if ((r + c - 2) % 3 === 0) status = 'occupied'
      seats.push({ seatId, status })
    }
  }
  await Seat.insertMany(seats)

  await SeatAssignment.insertMany([
    { seatId: 'R1C1', studentId: 'S1001', timing: 'Morning' },
    { seatId: 'R2C3', studentId: 'S1002', timing: 'Evening' },
    { seatId: 'R2C5', studentId: 'S1003', timing: 'Full Day' },
  ])

  await Seat.updateOne({ seatId: 'R1C1' }, { status: 'occupied' })
  await Seat.updateOne({ seatId: 'R2C3' }, { status: 'occupied' })
  await Seat.updateOne({ seatId: 'R2C5' }, { status: 'occupied' })

  console.log('Seed completed')
}

export { seed }
