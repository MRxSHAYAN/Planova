# Planova — Expo Management Platform

A full-stack MERN platform for managing expos, trade shows, and conferences in Pakistan.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19 + Vite 8 + Tailwind CSS v4     |
| Routing    | React Router v7                         |
| Icons      | Lucide React                            |
| Backend    | Node.js + Express                       |
| Database   | MongoDB + Mongoose                      |
| Auth       | JWT + bcryptjs                          |
| Email      | Nodemailer (SMTP)                       |

## Features

**Public Website**
- Home with live stats (expos, approved exhibitors, attendees) fetched from DB
- Explore Expos — browse and filter all upcoming expos
- Exhibitors Directory — view exhibitor profiles and their products
- Public Schedule — all sessions across all expos
- About, Contact, Newsletter signup

**Auth System**
- Register with OTP email verification (attendee or exhibitor)
- Same email can register as both attendee and exhibitor (separate accounts)
- Login with role selector — picks the correct account
- Forgot password with role selector + OTP reset
- Change email (OTP to new address)
- Change password (OTP to current email)

**Password Rules:** minimum 7 characters + at least one number + at least one special character

**Attendee Dashboard**
- Overview with registered expos and upcoming sessions
- Explore Events — browse and register for expos
- My Events — all registered expos, cancel registration
- My Schedule — sessions only for registered expos (filtered server-side)
- Exhibitors — browse exhibitor profiles with products
- Profile Settings — edit name, city, phone, avatar

**Exhibitor Dashboard**
- Overview with application and booth status
- Apply to Expos — select expo and booth during application
- My Applications — track status, request booth change
- My Booth — manage booth details
- My Products — add, edit, delete products shown to attendees
- Profile Settings

**Admin Panel**
- Login at `/admin`
- Overview — fully live: user stats, expo list, applications, registrations, sessions, booth occupancy, newsletter subscribers
- Expo Management — create, edit, publish, archive expos
- Applications — approve or reject exhibitor applications
- Booths — manage booth assignments
- Schedule — create and manage sessions per expo
- Attendees — view all registrations per expo
- Users — list all users, toggle active/inactive
- Reports — full analytics: application status, booth occupancy, registrations by expo, sessions by type, registration trend over 6 months
- Notifications

## Quick Start

```bash
# 1. Install server dependencies
cd server && npm install

# 2. Install client dependencies
cd ../client && npm install

# 3. Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and SMTP credentials

# 4. Start the server (port 5000)
cd server && npm run dev

# 5. Start the client (port 5173)
cd client && npm run dev
```

## Environment Variables

Create `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/planovaDB
JWT_SECRET=your_jwt_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=Planova <your_email@gmail.com>
```

## Demo Credentials

| Role      | Email                          | Password        |
|-----------|--------------------------------|-----------------|
| Admin     | admin@planova.com              | planovaAdmin123 |
| Exhibitor | raza.ahmed@techbridge.pk       | exhibitor123    |
| Attendee  | ayesha.siddiqui@email.com      | attendee123     |

**Note:** existing seed accounts use the old single-role email constraint. New registrations support the same email for both roles.

## Project Structure

```
├── client/                  React + Vite frontend
│   └── src/
│       ├── admin/           Admin panel pages and components
│       ├── users/
│       │   ├── attendee/    Attendee dashboard
│       │   └── exhibitor/   Exhibitor dashboard
│       ├── web/             Public website pages
│       └── context/         AuthContext (JWT state)
└── server/                  Express + MongoDB backend
    ├── models/              Mongoose schemas
    ├── routes/              API route handlers
    ├── middleware/          Auth middleware
    └── utils/               JWT, OTP, email helpers
```

## API Summary

| Method | Endpoint                              | Access    | Description                            |
|--------|---------------------------------------|-----------|----------------------------------------|
| POST   | /api/auth/register                    | Public    | Register + send OTP                    |
| POST   | /api/auth/verify-otp                  | Public    | Verify OTP, create account             |
| POST   | /api/auth/login                       | Public    | Login (role-aware)                     |
| POST   | /api/auth/forgot-password             | Public    | Send password reset OTP                |
| POST   | /api/auth/reset-password              | Public    | Reset password with OTP                |
| GET    | /api/auth/profile                     | Protected | Get own profile                        |
| PUT    | /api/auth/profile                     | Protected | Update own profile                     |
| GET    | /api/expos                            | Public    | List active expos                      |
| GET    | /api/expos/all                        | Admin     | List all expos                         |
| GET    | /api/sessions                         | Public    | List all sessions                      |
| GET    | /api/sessions/mine                    | Attendee  | Sessions for registered expos only     |
| POST   | /api/registrations                    | Attendee  | Register for an expo                   |
| GET    | /api/registrations/mine               | Attendee  | Own registrations                      |
| GET    | /api/registrations                    | Admin     | All registrations                      |
| GET    | /api/applications                     | Admin     | All exhibitor applications             |
| PUT    | /api/applications/:id                 | Admin     | Approve / reject application           |
| GET    | /api/booths                           | Admin     | All booths                             |
| GET    | /api/products                         | Public    | All products                           |

## Repo

[github.com/MRxSHAYAN/Planova](https://github.com/MRxSHAYAN/Planova)
