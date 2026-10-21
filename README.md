# Planova — Expo Management Platform

A full-stack MERN platform for managing expos, trade shows, and conferences in Pakistan.

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

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Routing | React Router 7 |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
| Backend | Node.js + Express (planned) |
| Database | MongoDB + Mongoose (planned) |
| Auth | JWT (planned) |

## Project Structure

```
E-Project plainova/
├── client/                    # React frontend
│   ├── src/
│   │   ├── data.js            # Shared data (all pages import from here)
│   │   ├── App.jsx            # Routes
│   │   ├── ScrollToTop.jsx    # Scrolls to top on page change
│   │   ├── index.css          # Global styles + Tailwind + CSS variables
│   │   ├── web/               # Public website
│   │   │   ├── components/    # Navbar, Footer, Layout
│   │   │   ├── pages/         # Home, ExploreExpos, Exhibitors, Schedule...
│   │   │   └── assets/        # Images
│   │   ├── users/             # Role dashboards
│   │   │   ├── attendee/      # Attendee dashboard (8 pages)
│   │   │   └── exhibitor/     # Exhibitor dashboard (9 pages)
│   │   └── admin/             # Admin panel (9 pages + login)
│   │       ├── components/    # AdminSidebar, AdminTopbar, StatusBadge
│   │       ├── layouts/       # AdminLayout
│   │       ├── pages/         # Overview, ExpoManagement, Applications...
│   │       └── data/          # Admin credentials + re-exports from data.js
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend (planned — see BACKEND_PLAN.txt)
├── BACKEND_PLAN.txt           # Full backend architecture plan
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

### Admin Panel Access
- Go to `http://localhost:5173/admin/login`
- Email: `admin@planova.com`
- Password: `admin123`

### Backend (planned)
See `BACKEND_PLAN.txt` for the full backend setup guide.

## Data Architecture

All data lives in `src/data.js`. Every page imports from this file:

```
src/data.js  (single source of truth)
    │
    ├──► Website pages (direct import)
    ├──► admin/data/adminData.js  (re-exports)  ──►  Admin pages
    ├──► attendee/data/mockData.js  (maps)  ──►  Attendee pages
    └──► exhibitor/data/mockData.js  (maps)  ──►  Exhibitor pages
```

When the backend is ready, replace the static arrays in `data.js` with API `fetch()` calls. Every page updates automatically.

## Build Commands

```bash
cd client
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run Oxlint
```
