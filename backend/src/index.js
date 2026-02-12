import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db/connect.js'
import { seed } from './db/seed.js'
import { verifyToken, requireAdmin, requireStudent, loginAdmin, loginStudent } from './auth.js'
import { studentsRouter } from './routes/students.js'
import { packagesRouter } from './routes/packages.js'
import { feesRouter } from './routes/fees.js'
import { issuesRouter } from './routes/issues.js'
import { seatingRouter } from './routes/seating.js'
import { reportsRouter } from './routes/reports.js'
import { studentRouter } from './routes/student.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Auth
app.post('/auth/login', async (req, res) => {
  const { username, password, email, role } = req.body || {}
  try {
    if (role === 'student') {
      const result = await loginStudent(email, password)
      if (result) return res.json(result)
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const result = await loginAdmin(username, password)
    if (result) return res.json(result)
    return res.status(401).json({ message: 'Invalid credentials' })
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' })
  }
})

// Admin routes
app.use('/admin/students', verifyToken, requireAdmin, studentsRouter)
app.use('/admin/packages', verifyToken, requireAdmin, packagesRouter)
app.use('/admin/fees', verifyToken, requireAdmin, feesRouter)
app.use('/admin/issues', verifyToken, requireAdmin, issuesRouter)
app.use('/admin/seating', verifyToken, requireAdmin, seatingRouter)
app.use('/admin/reports', verifyToken, requireAdmin, reportsRouter)

// Student routes (student panel)
app.use('/student/me', verifyToken, requireStudent, studentRouter())

app.get('/health', (_, res) => res.json({ ok: true }))

async function start() {
  await connectDB()
  await seed()
  app.listen(PORT, () => {
    console.log(`Library backend running on http://localhost:${PORT}`)
  })
}

start().catch(err => {
  console.error('Failed to start:', err)
  process.exit(1)
})
