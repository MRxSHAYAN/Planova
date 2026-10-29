# Planova

A MERN stack platform for managing expos, trade shows, and conferences in Pakistan. Connects organizers, exhibitors, and attendees in one place.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router v7 |
| Backend  | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth     | JWT, bcryptjs, OTP via email |
| Email    | Nodemailer (SMTP) |

## Features

**Public site** — home with live stats, expo listings, exhibitor directory, session schedule, contact, newsletter

**Auth** — register/login as attendee or exhibitor (same email can hold both roles), OTP email verification, forgot password, change email/password with OTP

**Attendee dashboard** — explore and register for expos, view registered expos, session schedule filtered to registered expos, exhibitor directory, profile

**Exhibitor dashboard** — apply to expos with booth selection, track applications, manage booth and products, profile

**Admin panel** — manage expos, approve/reject applications, assign booths, manage sessions, view registrations and users, reports and analytics

## Getting started

```bash
# server
cd server && npm install && npm run dev

# client (separate terminal)
cd client && npm install && npm run dev
```

Server runs on `http://localhost:5000`, client on `http://localhost:5173`.

## Environment variables

Create `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/planovaDB
JWT_SECRET=your_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=Planova <you@gmail.com>
```

## Seed data

```bash
cd server && npm run seed
```

Seeds 7 expos, 8 exhibitors, 6 attendees, booths, sessions, and applications.

## Demo credentials

| Role      | Email                       | Password      |
|-----------|-----------------------------|---------------|
| Admin     | admin@planova.com           | Admin@123     |
| Exhibitor | raza@techbridge.pk          | Exhibitor@1   |
| Attendee  | hamza@gmail.com             | Attendee@1    |

## Project structure

```
client/src/
  admin/        admin panel
  users/
    attendee/   attendee dashboard
    exhibitor/  exhibitor dashboard
  web/          public website
  context/      auth state

server/
  models/       mongoose schemas
  routes/       api routes
  middleware/   auth middleware
  utils/        jwt, otp, email
  seed.js       seed script
```

## Password rules

7+ characters, at least one number, at least one special character.

## API routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | public | register + send OTP |
| POST | /api/auth/verify-otp | public | verify OTP |
| POST | /api/auth/login | public | login (role-aware) |
| POST | /api/auth/forgot-password | public | send reset OTP |
| POST | /api/auth/reset-password | public | reset password |
| GET | /api/auth/profile | auth | get own profile |
| PUT | /api/auth/profile | auth | update profile |
| GET | /api/expos | public | active expos |
| GET | /api/expos/all | admin | all expos |
| POST | /api/expos | admin | create expo |
| GET | /api/sessions | public | all sessions |
| GET | /api/sessions/mine | attendee | sessions for registered expos |
| POST | /api/registrations | attendee | register for expo |
| GET | /api/registrations/mine | attendee | own registrations |
| GET | /api/registrations | admin | all registrations |
| POST | /api/applications | exhibitor | apply to expo |
| GET | /api/applications/mine | exhibitor | own applications |
| GET | /api/applications | admin | all applications |
| PUT | /api/applications/:id/approve | admin | approve application |
| PUT | /api/applications/:id/reject | admin | reject application |
| GET | /api/booths/expo/:id | public | available booths for expo |
| GET | /api/booths | admin | all booths |
| PUT | /api/booths/:id/assign | admin | assign exhibitor to booth |
| GET | /api/products | public | all products |
| GET | /api/products/mine | exhibitor | own products |

---

[github.com/MRxSHAYAN/Planova](https://github.com/MRxSHAYAN/Planova)
