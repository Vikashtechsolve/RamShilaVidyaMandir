# RamShila VidyaMandir Library Management System

A full-stack library management system with separate **Admin Panel**, **Student Panel**, and **Backend API**.

## Project Structure

```
├── backend/         # Express + MongoDB API server
├── admin-panel/     # Admin dashboard (React + Vite)
├── student-panel/   # Student portal (React + Vite + Framer Motion)
├── package.json     # Root dev scripts (optional)
└── README.md
```

Each folder is an **independent project** with its own `package.json` and can be deployed separately.

---

## Local Development

### 1. Backend (API Server)

```bash
cd backend
cp .env.example .env   # Edit with your MongoDB URI
npm install
npm run dev             # http://localhost:4000
```

### 2. Admin Panel

```bash
cd admin-panel
npm install
npm run dev             # http://localhost:5173 (proxies API to localhost:4000)
```

### 3. Student Panel

```bash
cd student-panel
npm install
npm run dev             # http://localhost:5174
```

### From Root (convenience)

```bash
npm run dev:backend
npm run dev:admin
npm run dev:student
```

---

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/library_management` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key-change-in-production` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |

### Admin Panel (`admin-panel/.env`)

Copy `admin-panel/.env.example` to `admin-panel/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL (required for production) | _(empty, uses Vite proxy in dev)_ |

### Student Panel (`student-panel/.env`)

Copy `student-panel/.env.example` to `student-panel/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:4000` |

---

## Deployment

Each part deploys independently. Select the respective folder as the root directory on your hosting platform.

### Backend (Render / Railway)

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:** Set `MONGO_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`

### Admin Panel (Vercel / Netlify)

- **Root Directory:** `admin-panel`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** Set `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com`)

### Student Panel (Vercel / Netlify)

- **Root Directory:** `student-panel`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** Set `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com`)

> Both frontend panels have `vercel.json` with SPA rewrites pre-configured.

---

## Test Credentials

**Admin:** `admin` / `admin123` (or values from backend `.env`)

**Students:** (default password: `student123`)
- `s1001@library.local`
- `s1002@library.local`
- `s1003@library.local`

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | None | Login (admin or student) |
| GET | `/health` | None | Health check |
| **Admin Routes** | `/admin/*` | Admin token | |
| GET | `/admin/students` | Admin | List students |
| POST | `/admin/students` | Admin | Create student |
| PUT | `/admin/students/:id` | Admin | Update student |
| DELETE | `/admin/students/:id` | Admin | Delete student |
| GET | `/admin/packages` | Admin | List packages |
| POST | `/admin/packages` | Admin | Create package |
| GET | `/admin/fees` | Admin | List fees |
| POST | `/admin/fees/assign` | Admin | Assign package to student |
| GET | `/admin/issues` | Admin | List issues |
| GET | `/admin/seating` | Admin | Get seating grid |
| GET | `/admin/reports/summary` | Admin | Dashboard stats |
| **Student Routes** | `/student/me/*` | Student token | |
| GET | `/student/me/summary` | Student | Dashboard summary |
| GET | `/student/me/profile` | Student | Profile details |
| PATCH | `/student/me/profile` | Student | Update profile |
| GET | `/student/me/fees` | Student | Fee details |
| GET | `/student/me/seat` | Student | Seat info |
| GET | `/student/me/issues` | Student | List issues |
| POST | `/student/me/issues` | Student | Submit issue |
