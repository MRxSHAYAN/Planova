# Planova — Expo Management Platform

A full-stack MERN platform for managing expos, trade shows, and conferences in Pakistan.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (SMTP) |

## Features

- Public website — Home, Explore Expos, Exhibitors, Schedule, About, Contact
- Attendee dashboard — overview, explore events, register for expos, my events, my schedule, exhibitors directory, profile
- Exhibitor dashboard — overview, explore expos, my applications, my booths, company profile, settings
- Admin panel — users, expos (CRUD + close/archive), applications, booths (create/bulk/assign/clear), schedule, newsletter, settings
- Auth — JWT login, OTP email verification on register, OTP for email change, OTP for password change
- Forgot password — OTP sent to email, reset password flow
- Password requirements — 7+ characters, one letter, one special character
- Profile picture upload — stored as base64 in MongoDB
- Newsletter subscription — saves to DB, sends welcome email, visible in admin
- Attendee registration for expos — saved to DB, visible in My Events
- Sessions linked to expos — deleting an expo auto-deletes its sessions

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
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
```

For Gmail App Password: Google Account > Security > 2-Step Verification > App Passwords. Remove all spaces from the 16-character password.

### Run

```bash
cd server && npm run dev    # http://localhost:5000
cd client && npm run dev    # http://localhost:5173
```

### SMTP Setup (required for OTP emails)

All OTP emails (register, forgot password, email change, password change) are sent via Gmail SMTP.

**How to get a Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security > 2-Step Verification (must be ON)
3. Search for "App Passwords"
4. Create one — name it anything (e.g. "Planova")
5. Copy the 16-character password, **remove all spaces**
6. Put it in `server/.env` as `SMTP_PASS=yourpasswordwithoutspaces`

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your16charapppassword
```

### Seed Test Data

The database needs at least one admin user and some expos to test properly.

**Create admin:**
```bash
# Run this once — creates admin@planova.com / planovaAdmin123
cd server
node -e "
import('./utils/adminSetup.mjs').catch(() => {})
" 
```

Or log into your MongoDB and insert manually, or just register via the admin login page after creating the admin through a helper script.

**Faster option — use the admin panel:**
1. Log in at `http://localhost:5173/admin` with `admin@planova.com` / `planovaAdmin123`
2. Go to Expo Management > New Expo, create an expo and set status to Published
3. Go to Booth & Floor Plan > New Booth, select that expo and create some booths
4. Register as an exhibitor at `/register`, then apply to the expo from the exhibitor dashboard

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Create account, send OTP |
| POST | `/api/auth/verify-otp` | Public | Verify OTP, activate account |
| POST | `/api/auth/resend-otp` | Public | Resend registration OTP |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/admin/login` | Public | Admin login |
| POST | `/api/auth/forgot-password` | Public | Send reset OTP to email |
| POST | `/api/auth/reset-password` | Public | Verify OTP, set new password |
| GET | `/api/auth/profile` | Bearer token | Get current user |
| PUT | `/api/auth/profile` | Bearer token | Update name, phone, city, company, avatar, etc. |
| POST | `/api/auth/request-email-change` | Bearer token | Send OTP to new email |
| POST | `/api/auth/confirm-email-change` | Bearer token | Verify OTP, update email |
| POST | `/api/auth/request-password-change` | Bearer token | Send OTP to current email |
| POST | `/api/auth/confirm-password-change` | Bearer token | Verify OTP, update password |
| GET | `/api/auth/stats` | Admin | User count stats |
| GET | `/api/auth/users` | Admin | All users from database |
| PUT | `/api/auth/users/:id/status` | Admin | Activate/deactivate user |
| GET | `/api/expos` | Public | List published expos |
| GET | `/api/expos/all` | Admin | List all expos (any status) |
| GET | `/api/expos/:id` | Public | Single expo |
| POST | `/api/expos` | Admin | Create expo |
| PUT | `/api/expos/:id` | Admin | Edit expo |
| DELETE | `/api/expos/:id` | Admin | Delete expo (auto-deletes sessions) |
| PUT | `/api/expos/:id/close` | Admin | Close/archive expo (keeps data, removes from public) |
| GET | `/api/sessions` | Public | List sessions (filter by ?event=id) |
| POST | `/api/sessions` | Admin | Create session |
| PUT | `/api/sessions/:id` | Admin | Edit session |
| DELETE | `/api/sessions/:id` | Admin | Delete session |
| GET | `/api/applications/approved` | Public | List approved exhibitor profiles |
| GET | `/api/applications` | Admin | All exhibitor applications |
| GET | `/api/applications/mine` | Exhibitor | Own applications |
| POST | `/api/applications` | Exhibitor | Submit application |
| PUT | `/api/applications/:id/approve` | Admin | Approve application |
| PUT | `/api/applications/:id/reject` | Admin | Reject with reason |
| PUT | `/api/applications/:id/booth-change` | Exhibitor | Request booth change |
| GET | `/api/booths/expo/:expoId` | Public | List available booths for an expo |
| GET | `/api/booths` | Protected | List booths (filter by ?event=id) |
| POST | `/api/booths` | Admin | Create booth |
| PUT | `/api/booths/:id/assign` | Admin | Assign exhibitor to booth |
| PUT | `/api/booths/:id/clear` | Admin | Clear booth assignment |
| DELETE | `/api/booths/:id` | Admin | Delete booth |
| POST | `/api/registrations` | Attendee | Register for an expo |
| GET | `/api/registrations/mine` | Attendee | Own registrations |
| DELETE | `/api/registrations/:id` | Attendee | Cancel registration |
| GET | `/api/registrations` | Admin | All registrations |
| POST | `/api/newsletter/subscribe` | Public | Subscribe to expo alerts |
| GET | `/api/newsletter/subscribers` | Admin | List all subscribers |
| DELETE | `/api/newsletter/subscribers/:id` | Admin | Remove subscriber |
| GET | `/api/health` | Public | Server + DB status |

## What is Dynamic vs Mock

**Dynamic (from database):**
- User profiles, avatars, names, emails
- OTP flows (register, email change, password change, forgot password)
- Admin: users, stats, activate/deactivate, reports (all live data)
- Admin: expo CRUD (auto-deletes sessions on delete, close/archive keeps all data)
- Admin: booth management — create single or bulk per expo, assign approved exhibitor, clear, delete
- Admin: applications (approve/reject, view booth change requests), booths, sessions (CRUD)
- Admin: attendees list (real registrations), newsletter subscribers
- Exhibitor: apply to expos — sees available booths, picks preferred booth
- Exhibitor: own applications with status, request booth change
- Exhibitor: my booths, products & services from DB
- Exhibitor: overview shows real application counts
- Attendee: register for expos, my events (upcoming/past), cancel
- Attendee: schedule (sessions from DB, date picker, bookmarks)
- Attendee: exhibitors directory with products & services from DB
- Public website: expos, schedule, exhibitor directory — all from DB

**Still mock (partial):**
- Admin overview recent activity feed

## Test Credentials

Before testing, seed the database once:
```bash
cd server && node seed.js
```

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@planova.com | planovaAdmin123 |
| Exhibitor | raza.ahmed@techbridge.pk | exhibitor123 |
| Attendee | ayesha.siddiqui@email.com | attendee123 |
| Test Attendee | test@test.com | Test@1234 |
| Test Exhibitor | testexhibitor@test.com | Test@1234 |

The seed also creates 7 expos (6 published, 1 draft), 10 sessions, 1 approved application, and 8 booths.

## Deployment (Vercel)

Set these in Vercel dashboard:

```
NODE_ENV=production
MONGO_URI=<Atlas connection string>
JWT_SECRET=<your secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your Gmail>
SMTP_PASS=<your App Password, no spaces>
CLIENT_URL=https://your-domain.vercel.app
```
