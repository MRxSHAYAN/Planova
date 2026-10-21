# Planova — Expo Management Platform

A full-stack MERN platform for managing expos, trade shows, and conferences in Pakistan. Public website, role-based dashboards, and an admin panel — all built out. Backend skeleton is wired up with MongoDB connection and health route; API routes are scaffolded for implementation.

## What's Built

### Public Website
- Home, Explore Expos, Exhibitors directory, Session Schedule
- About, Contact, Support, Privacy pages
- Login and Register pages
- Splash screen animation

### Attendee Dashboard (`/users/dashboard/attendee`)
- Overview, Explore Events, My Events, My Schedule
- Exhibitors, Saved Items, Notifications, My Profile

### Exhibitor Dashboard (`/users/dashboard/exhibitor`)
- Overview, Explore Expos, My Applications, My Booths
- Company Profile, Products & Services, Messages, Settings

### Admin Panel (`/admin`)
- Admin login (separate from public login)
- Overview with metrics and activity feed
- Expo Management (create, edit, publish, archive)
- Exhibitor Applications (approve, reject with reason)
- Booth & Floor Plan (grid + table view, assign exhibitors)
- Attendees & Registrations (search, filter, paginate)
- Schedule & Sessions (create, edit, delete)
- Users & Roles (view all users, role-based access)
- Reports & Analytics (charts from real data)
- Notifications, Settings

### Backend (`/server`)
- Express server with CORS, JSON parsing
- MongoDB connection (local in dev, Atlas in production)
- JWT auth middleware + role-based access control
- All 8 Mongoose models defined (User, Event, Session, Exhibitor, Booth, Registration, Bookmark, Notification)
- 10 route files scaffolded (auth, events, sessions, exhibitors, booths, registrations, bookmarks, notifications, users, admin)
- `GET /api/health` endpoint for DB connection status
- Clean startup log showing API URL, frontend URL, mode, and DB target

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Routing | React Router 7 |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Deployment | Vercel |

## Project Structure

```
E-Project plainova/
├── client/                    # React frontend
│   ├── src/
│   │   ├── data.js            # Shared data (all pages import from here)
│   │   ├── App.jsx            # Routes
│   │   ├── ScrollToTop.jsx    # Scrolls to top on page change
│   │   ├── index.css          # Global styles + Tailwind + CSS variables
│   │   ├── assets/            # Icon.png logo
│   │   ├── web/               # Public website
│   │   │   ├── components/    # Navbar, Footer, Layout, AuthNavbar
│   │   │   ├── pages/         # Home, ExploreExpos, Exhibitors, Schedule, About, Contact, Support, Privacy
│   │   │   └── pages/auth/    # Login, Register
│   │   ├── users/             # Role dashboards
│   │   │   ├── attendee/      # Attendee dashboard (8 pages)
│   │   │   └── exhibitor/     # Exhibitor dashboard (9 pages)
│   │   └── admin/             # Admin panel (11 pages + login)
│   │       ├── components/    # AdminSidebar, AdminTopbar, StatusBadge
│   │       ├── layouts/       # AdminLayout
│   │       ├── pages/         # Overview, ExpoManagement, Applications, Booths, Attendees, Schedule, Users, Reports, Notifications, Settings
│   │       └── data/          # Admin credentials + re-exports from data.js
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── config/db.js           # MongoDB connection (local/Atlas switching)
│   ├── middleware/            # authMiddleware (JWT protect + requireRole)
│   ├── models/                # 8 Mongoose models
│   ├── routes/                # 10 route files (scaffolded)
│   ├── utils/generateToken.js # JWT token generator
│   ├── .env                   # Environment variables (gitignored)
│   └── server.js              # Entry point
├── vercel.json                # Vercel deployment config
└── README.md                  # This file
```

## Getting Started

### Frontend
```bash
cd client
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend
```bash
cd server
npm install
node server.js
# Runs at http://localhost:5000
```

### Run both together (from root)
```bash
npm install
npm run dev
# Starts both client and server concurrently
```

### Admin Panel Access
- Go to `http://localhost:5173/admin/login`
- Email: `admin@planova.com`
- Password: `admin123`

## Environment Variables

The server reads from `server/.env` (gitignored). In development it uses local MongoDB, in production it uses Atlas. Set these on Vercel under Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI_ATLAS` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string |
| `CLIENT_URL` | Your Vercel deployment URL |
| `PORT` | `5000` |

## API Health Check

Once the server is running, verify the database connection:

```
GET http://localhost:5000/api/health
```

Returns:
```json
{
  "status": "ok",
  "api": "running",
  "database": {
    "state": "connected",
    "name": "planovaDBTesting",
    "host": "localhost",
    "mode": "Local MongoDB"
  }
}
```

## Data Architecture

All frontend data lives in `src/data.js`. Every page imports from this file:

```
src/data.js  (single source of truth)
    │
    ├──► Website pages (direct import)
    ├──► admin/data/adminData.js  (re-exports)  ──►  Admin pages
    ├──► attendee/data/mockData.js  (maps)  ──►  Attendee pages
    └──► exhibitor/data/mockData.js  (maps)  ──►  Exhibitor pages
```

When the backend routes are implemented, replace the static arrays in `data.js` with API `fetch()` calls. Every page updates automatically.

## Build Commands

```bash
# Frontend
cd client
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build

# Backend
cd server
npm run dev      # Nodemon dev server
npm start        # Production server

# Root
npm run dev      # Both client + server concurrently
```

## Deployment (Vercel)

The `vercel.json` is configured for monorepo deployment:
- Client (Vite) built with `@vercel/static-build`
- Server (Express) served via `@vercel/node`
- `/api/*` routes rewrite to the server, everything else hits the client build

Make sure environment variables are set in the Vercel dashboard before deploying.
