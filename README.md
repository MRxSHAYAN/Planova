# Planova — Expo Management Platform

A full-stack MERN platform for managing expos, trade shows, and conferences in Pakistan.

## What's Built

### Public Website
- Home, Explore Expos, Exhibitors directory, Session Schedule
- About, Contact, Support, Privacy
- Login, Register, Forgot Password, Splash screen

### Attendee Dashboard (`/users/dashboard/attendee/*`)
- Overview, Explore Events, My Events, My Schedule
- Exhibitors, Saved Items, My Profile

### Exhibitor Dashboard (`/users/dashboard/exhibitor/*`)
- Overview, Explore Expos, My Applications, My Booths
- Company Profile, Products & Services, Settings

### Admin Panel (`/admin/*`)
- Admin Login — credentials stored in DB, seeded via `server/seed.js`
- Overview, Expo Management, Exhibitor Applications, Booth & Floor Plan
- Attendees, Schedule & Sessions, Users & Roles, Reports & Analytics, Settings
- Settings page lets admin update their own name, email, and password live via API

### Auth System (complete)
- JWT-based login and registration
- Role-based route protection (attendee, exhibitor, admin)
- `AuthContext` — stores user + token in localStorage, provides `login` / `logout`
- `PrivateRoute` — redirects to `/login` if not authenticated
- `AdminRoute` — redirects to `/admin/login` if not admin
- Admin name/email/password editable from Settings → saved to DB via `PUT /api/auth/profile`

### Backend
- Express server with CORS, JSON middleware
- MongoDB connection — local in dev (`MONGO_URI`), Atlas in prod (`MONGO_URI_ATLAS`)
- `GET /api/health` — returns server + DB status
- JWT auth middleware (`protect`, `requireRole`)
- 7 Mongoose models: User, Event, Session, Exhibitor, Booth, Registration, Bookmark
- Auth routes: register, login, admin/login, profile update

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Routing | React Router 7 |
| Icons | Lucide React |
| Font | Inter |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Deployment | Vercel |

## Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/explore-expos` | Browse expos |
| `/exhibitors` | Exhibitor directory |
| `/schedule` | Session schedule |
| `/about` `/contact` `/support` `/privacy` | Info pages |
| `/login` `/register` `/forgot-password` | Auth pages |
| `/users/dashboard/attendee/*` | Attendee dashboard (protected) |
| `/users/dashboard/exhibitor/*` | Exhibitor dashboard (protected) |
| `/admin/login` | Admin login |
| `/admin/*` | Admin panel (protected — admin role only) |

## API Endpoints

| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/admin/login` | Public |
| PUT | `/api/auth/profile` | Authenticated |
| GET | `/api/health` | Public |

## Getting Started

```bash
npm run install:all   # install client + server deps
npm run dev           # start both concurrently
```

Client → `http://localhost:5173`  
Server → `http://localhost:5000`

## Seed Admin User

Run this once to create the admin account in your local MongoDB:

```bash
cd server && npm run seed
# Creates: admin@planova.com / admin123
```

## Environment Variables

`server/.env` (gitignored):
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/planovaDBTesting
JWT_SECRET=your_secret_here
```

Vercel dashboard (Project Settings → Environment Variables):
```
NODE_ENV=production
MONGO_URI_ATLAS=mongodb+srv://...
JWT_SECRET=your_secret_here
CLIENT_URL=https://your-vercel-url.vercel.app
```

## Project Structure

```
client/src/
├── context/AuthContext.jsx     # Login, logout, user state
├── components/PrivateRoute.jsx # Route protection
├── web/pages/auth/             # Login, Register, ForgotPassword
├── admin/
│   ├── data/adminData.js       # Re-exports shared data for admin pages
│   └── pages/Settings.jsx      # Admin can edit name/email/password
├── users/attendee/
└── users/exhibitor/

server/
├── routes/authRoutes.js        # Auth API routes
├── models/                     # 7 Mongoose models
├── seed.js                     # Creates admin user in DB
└── index.js                    # Entry point
```
