# Planova — Expo Management Platform

A full-stack MERN platform for managing expos, trade shows, and conferences in Pakistan. Built with React, Express, MongoDB, JWT auth, and OTP email verification.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (G SMTP) |
| Deployment | Vercel |

## Features

- **Public website** — Home, Explore Expos, Exhibitors, Schedule, About, Contact
- **Attendee dashboard** — overview, explore events, my schedule, saved items, profile
- **Exhibitor dashboard** — overview, applications, booths, company profile, products, settings
- **Admin panel** — users, applications, booths, expo management, reports, settings
- **Auth** — JWT login, role-based routing, OTP email verification on register, OTP for email change
- **Dynamic profiles** — all profile pages fetch from the database, sidebar and navbar show the real logged-in user name

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Install

```bash
cd server && npm install
cd client && npm install
```

### Environment Variables

Create `server/.env`:

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/planovaDBTesting
JWT_SECRET=your_long_random_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

For Gmail, use an App Password (Google Account → Security → 2-Step Verification → App Passwords).

### Seed Demo Users

```bash
cd server && node seed.js
```

Creates three pre-verified accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@planova.com | admin123 |
| Exhibitor | raza.ahmed@techbridge.pk | exhibitor123 |
| Attendee | ayesha.siddiqui@email.com | attendee123 |

### Run

```bash
cd server && npm run dev    # http://localhost:5000
cd client && npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000` automatically.

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Create account, send OTP |
| POST | `/api/auth/verify-otp` | Public | Verify OTP, activate account |
| POST | `/api/auth/resend-otp` | Public | Resend registration OTP |
| POST | `/api/auth/login` | Public | Login (blocks unverified) |
| POST | `/api/auth/admin/login` | Public | Admin-only login |
| GET | `/api/auth/profile` | Bearer token | Fetch current user |
| PUT | `/api/auth/profile` | Bearer token | Update name, phone, city, company, etc. |
| POST | `/api/auth/request-email-change` | Bearer token | Send OTP to new email |
| POST | `/api/auth/confirm-email-change` | Bearer token | Verify OTP, swap email |
| GET | `/api/health` | Public | Server + DB health check |

## Frontend Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/explore-expos` | Browse expos |
| `/exhibitors` | Exhibitor directory |
| `/schedule` | Session schedule |
| `/about` `/contact` | Info pages |
| `/login` `/register` | Auth pages |
| `/users/dashboard/attendee/*` | Attendee dashboard (protected) |
| `/users/dashboard/exhibitor/*` | Exhibitor dashboard (protected) |
| `/admin/login` | Admin login |
| `/admin/*` | Admin panel (admin role only) |

## Project Structure

```
client/src/
├── context/AuthContext.jsx       # Auth state: user, login, logout, updateUser
├── hooks/useProfile.js            # Fetch & update profile from API
├── web/                           # Public website
│   ├── pages/                     # Home, About, ExploreExpos, etc.
│   │   └── auth/                  # Login, Register (with OTP step)
│   └── components/               # Navbar, Footer, AuthNavbar
├── users/
│   ├── attendee/                  # Attendee dashboard
│   │   ├── pages/MyProfile.jsx    # Dynamic — fetch & save from DB
│   │   └── data/mockData.js       # Events, sessions (still mock)
│   └── exhibitor/                 # Exhibitor dashboard
│       ├── pages/CompanyProfile.jsx  # Dynamic — fetch & save from DB
│       ├── pages/Settings.jsx        # Dynamic — fetch & save from DB
│       └── data/mockData.js          # Applications, booths (still mock)
└── admin/                        # Admin panel
    ├── pages/Settings.jsx        # Dynamic — fetch & save from DB
    └── data/adminData.js         # Admin stats (still mock)

server/
├── index.js                      # Express app entry
├── seed.js                       # Creates demo users
├── config/db.js                  # MongoDB connection
├── middleware/authMiddleware.js  # JWT protect + requireRole
├── models/                       # User, Event, Session, Exhibitor, etc.
├── routes/authRoutes.js          # All auth + profile + OTP endpoints
└── utils/
    ├── generateToken.js          # JWT token creation
    └── sendEmail.js              # Nodemailer OTP email sender
```

## What's Dynamic vs Mock

**Dynamic (live from database):**
- User profiles (name, email, phone, city, company, category, description, website)
- Login, register, logout
- OTP email verification
- Password change
- Email change with OTP
- Sidebar and navbar display real user name

**Still mock data (local arrays, not from DB):**
- Events, sessions, exhibitors (public site + dashboards)
- Exhibitor applications and booths
- Admin overview stats and reports

## Deployment (Vercel)

Set these environment variables in the Vercel dashboard:

```
NODE_ENV=production
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<your secret>
EMAIL_USER=<your Gmail>
EMAIL_PASS=<your Gmail App Password>
CLIENT_URL=https://your-domain.vercel.app
```

## License

This project is for educational/demo purposes.
