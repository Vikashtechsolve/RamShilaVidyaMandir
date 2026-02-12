# Library Management Backend

Node.js/Express backend with MongoDB for the Library Management System (admin + student panels).

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Copy `.env.example` to `.env` and set your MongoDB URL:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

   For MongoDB Atlas: `MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/library_management`

## Run

```bash
npm run dev    # Development with auto-reload
npm start      # Production
```

Server runs at `http://localhost:4000`.

## Test Credentials

**Admin:** `admin` / `admin123` (or values from `.env`)

**Students:** (default password: `student123`)
- `s1001@library.local`
- `s1002@library.local`
- `s1003@library.local`

## API Overview

- `POST /auth/login` - Login (admin: username/password, student: email/password + role: "student")
- Admin routes (require Bearer token, role: admin):
  - `/admin/students` - CRUD, search, toggle status
  - `/admin/packages` - List, create
  - `/admin/fees` - List, assign, mark paid
  - `/admin/issues` - List, add, respond, toggle
  - `/admin/seating` - Get grid, toggle seat, set status
  - `/admin/reports/summary` - Dashboard stats
  - `/admin/reports/rows` - Report rows
- Student routes (require Bearer token, role: student):
  - `/student/me/summary` - Dashboard
  - `/student/me/profile` - Profile
  - `/student/me/fees` - Fee details
  - `/student/me/seat` - Seat info
  - `/student/me/issues` - List, submit
