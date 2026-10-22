# Planova — Expo Management Platform

A full-stack MERN platform for managing expos, trade shows, and conferences in Pakistan.

## What's Built

### Public Website
- Home, Explore Expos, Exhibitors directory, Session Schedule
- About, Contact, Support, Privacy
- Login, Register, Forgot Password
- Splash screen animation

### Attendee Dashboard (`/users/dashboard/attendee/*`)
- Overview, Explore Events, My Events, My Schedule
- Exhibitors, Saved Items, My Profile

### Exhibitor Dashboard (`/users/dashboard/exhibitor/*`)
- Overview, Explore Expos, My Applications, My Booths
- Company Profile, Products & Services, Settings

### Admin Panel (`/admin/*`)
- Admin Login (separate page — `admin@planova.com` / `admin123`)
- Overview, Expo Management, Exhibitor Applications, Booth & Floor Plan
- Attendees, Schedule & Sessions, Users & Roles, Reports & Analytics, Settings

### Backend (`/server`)
- Express server, CORS, MongoDB connection (local in dev, Atlas in prod)
- JWT auth middleware + role-based access control
- 7 Mongoose models: User, Event, Session, Exhibitor, Booth, Registration, Bookmark
- Route folders scaffolded and ready for implementation
- `GET /api/health` — shows DB connection state + server info

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
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Forgot password |
| `/users/dashboard/attendee/*` | Attendee dashboard |
| `/users/dashboard/exhibitor/*` | Exhibitor dashboard |
| `/admin/login` | Admin login |
| `/admin/*` | Admin panel |

## Project Structure

```
E-Project plainova/
├── client/
│   └── src/
│       ├── data.js              # Shared mock data (replace with API calls)
│       ├── App.jsx              # All routes
│       ├── index.css            # Global styles + Tailwind + CSS variables
│       ├── web/                 # Public website
│       │   ├── components/      # Navbar, Footer, Layout, AuthNavbar
│       │   ├── pages/           # All website pages + auth/
│       │   └── assets/          # Images
│       ├── users/
│       │   ├── attendee/        # Attendee dashboard
│       │   └── exhibitor/       # Exhibitor dashboard
│       └── admin/               # Admin panel
│           ├── components/      # AdminSidebar, AdminTopbar, StatusBadge
│           ├── layouts/         # AdminLayout
│           ├── pages/           # All admin pages
│           └── data/            # Admin credentials + data re-exports
├── server/
│   ├── config/db.js             # MongoDB connection
│   ├── middleware/authMiddleware.js
│   ├── models/                  # 7 Mongoose models
│   ├── routes/                  # Empty, ready for implementation
│   ├── utils/generateToken.js
│   ├── index.js                 # Entry point
│   └── .env                     # Environment variables (gitignored)
├── vercel.json
└── README.md
```

## Getting Started

```bash
# Install everything
npm run install:all

# Run both client + server
npm run dev

# Client only → http://localhost:5173
# Server only → http://localhost:5000
```

## Environment Variables

Create `server/.env` (already done locally, gitignored):

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/planovaDBTesting
JWT_SECRET=your_secret_here
```

On Vercel, add these in Project Settings → Environment Variables:

```
NODE_ENV=production
MONGO_URI_ATLAS=mongodb+srv://...
JWT_SECRET=your_secret_here
CLIENT_URL=https://your-vercel-url.vercel.app
```

## API Health Check

```
GET http://localhost:5000/api/health
```

Returns server status and DB connection info.

## What's Next (Backend)

1. Build auth routes: register, login, admin login
2. Build event/session/exhibitor/booth API routes
3. Connect frontend — create `src/lib/api.js` helper
4. Replace `src/data.js` static arrays with API calls
5. Add React auth context for protected routes
