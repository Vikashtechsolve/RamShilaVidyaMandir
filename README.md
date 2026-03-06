# RamShila VidyaMandir Library Management System

A full-stack library management system with separate **Admin Panel**, **Student Panel**, and **Backend API**.

## Project Structure

```
/
├── admin-panel/     # Admin dashboard (React + Vite)
├── student-panel/   # Student portal (React + Vite + Framer Motion)
├── backend/         # Express + MongoDB API server
├── package.json     # Root scripts for running each app
├── vercel.json      # Vercel deployment (student-panel)
└── README.md
```

## Running the Project

Each part can run **independently**:

### Backend (API Server)
```bash
cd backend
npm install
npm run dev    # Development with --watch
# or
npm start      # Production
```
Runs on `http://localhost:4000` (or `PORT` from `.env`)

### Admin Panel
```bash
cd admin-panel
npm install
npm run dev
```
Runs on `http://localhost:5173`

### Student Panel
```bash
cd student-panel
npm install
npm run dev
```
Runs on `http://localhost:5174` (or next available port)

### From Root
```bash
npm run dev:backend    # Start backend
npm run dev:admin      # Start admin panel
npm run dev:student    # Start student panel
npm run build          # Build student-panel (for Vercel)
```

## Environment Variables

- **Backend** (`backend/.env`): See `backend/.env.example`  
  - `MONGODB_URI`, `PORT`, `JWT_SECRET`, etc.
- **Admin Panel**: Uses proxy to backend (see `admin-panel/vite.config.js`)
- **Student Panel**: Set `VITE_API_BASE_URL` for production API URL

## Deployment

- **Vercel**: Deploys `student-panel` (configured in `vercel.json`)
- **Backend**: Deploy to Railway, Render, or similar
- **Admin Panel**: Deploy to Vercel or Netlify with API proxy
