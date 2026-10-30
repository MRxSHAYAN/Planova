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

**Public site**
- Home with live stats from DB (expos, exhibitors, attendees)
- Expo listings with category and city filters
- Exhibitor directory with product modals
- Public session schedule
- Newsletter signup, contact form

**Auth**
- Register as attendee or exhibitor with OTP email verification
- Same email can hold both roles as separate accounts
- Login with role selector (picks the correct account)
- Forgot password with role selector and OTP reset
- Change email and password with OTP confirmation

**Attendee dashboard** (all live from DB)
- Overview — registered expos, upcoming sessions, recommended expos
- Explore Events — browse and register for expos
- My Events — registered expos with cancel option
- My Schedule — sessions filtered to registered expos, bookmark sessions (persisted to DB)
- Saved Items — bookmarked sessions fetched from DB, remove with one click
- Exhibitors — directory with product profiles
- Profile settings with email/password change

**Exhibitor dashboard** (all live from DB)
- Overview — application status and booth info
- Explore Expos — browse and apply with booth selection
- My Applications — track status, request booth change
- My Booths — assigned booth details
- Products — add, edit, delete products visible to attendees
- Profile and settings

**Admin panel** (all live from DB)
- Overview — user stats, expo list, applications, registrations, sessions, booth occupancy, newsletter subscribers
- Expo Management — create, edit, publish, archive expos
- Applications — approve or reject with reason; email notification sent to exhibitor on status change; approve or decline booth change requests from exhibitors
- Booths — create single or bulk booths, assign exhibitors, clear assignments
- Schedule — create and manage sessions per expo
- Attendees — all registrations, filter by expo
- Users — list all users, toggle active/inactive
- Reports — application status, booth occupancy, registrations by expo, sessions by type, 6-month trend chart
- Messages — contact form submissions with reply (opens Gmail) and delete
- Email Broadcast — send a bulk email to all registered attendees of any expo

## Getting started

```bash
# server (port 5000)
cd server && npm install && npm run dev

# client (port 5173) — in a separate terminal
cd client && npm install && npm run dev
```

## Seed data

The seed script populates your database with demo data for testing:

```bash
cd server && npm run seed
```

This creates demo users, expos, booths, sessions, and products so you can explore the platform immediately. However, we recommend you sign up with your own email and create your own expos to fully test the flow — register at `/register`, pick a role, and go through the OTP verification yourself.

Seeds 7 expos, 4 exhibitors (with 9 products), 4 attendees, 32 booths, 14 sessions, 8 registrations, and 10 newsletter subscribers. Wipes existing data first.

## Demo credentials

All exhibitors and attendees use `Planova@1` as password.

**Admin** (login at `/admin/login`)

| Email | Password |
|---|---|
| admin@planova.com | Admin@123 |

**Exhibitors** (login at `/login`, pick Exhibitor card)

| Name | Email | Company |
|---|---|---|
| Shayan | shayan@techbridge.pk | TechBridge Solutions |
| Hadi | hadi@mediplus.pk | MediPlus Pakistan |
| Moeed | moeed@greenenergy.pk | Green Energy PK |
| Meekail | meekail@agrosolutions.pk | Agro Solutions PK |

**Attendees** (login at `/login`, pick Attendee card)

| Name | Email |
|---|---|
| Hamza | hamza@gmail.com |
| Uzair | uzair@gmail.com |
| Fakir | fakir@gmail.com |
| Haseeb | haseeb@gmail.com |

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

For Gmail, enable 2-factor auth and use an App Password as `SMTP_PASS`.

## Password rules

7+ characters · at least one number · at least one special character

## Project structure

```
client/src/
  admin/          admin panel (pages, components, layout)
  users/
    attendee/     attendee dashboard
    exhibitor/    exhibitor dashboard
  web/            public website
  context/        AuthContext — JWT token state

server/
  models/         Mongoose schemas
  routes/         API route handlers
  middleware/     auth middleware (protect, requireRole)
  utils/          generateToken, sendEmail (OTP)
  seed.js         seed script
```

**Image upload** — avatars and product images support direct file upload (up to 5 MB, stored in `server/uploads/`). URL paste still works as a fallback.



## API reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | public | register + send OTP |
| POST | /api/auth/verify-otp | public | verify OTP |
| POST | /api/auth/login | public | login (role-aware) |
| POST | /api/auth/forgot-password | public | send reset OTP |
| POST | /api/auth/reset-password | public | reset password with OTP |
| GET/PUT | /api/auth/profile | auth | get / update own profile |
| POST | /api/auth/request-email-change | auth | OTP to new email |
| POST | /api/auth/confirm-email-change | auth | confirm new email |
| POST | /api/auth/request-password-change | auth | OTP for password change |
| POST | /api/auth/confirm-password-change | auth | confirm new password |
| GET | /api/expos | public | published expos |
| GET | /api/expos/all | admin | all expos |
| POST | /api/expos | admin | create expo |
| PUT | /api/expos/:id | admin | update expo |
| PUT | /api/expos/:id/close | admin | archive expo |
| GET | /api/sessions | public | all sessions |
| GET | /api/sessions/mine | attendee | sessions for registered expos |
| POST | /api/sessions | admin | create session |
| PUT/DELETE | /api/sessions/:id | admin | update / delete session |
| POST | /api/registrations | attendee | register for expo |
| GET | /api/registrations/mine | attendee | own registrations |
| DELETE | /api/registrations/:id | attendee | cancel registration |
| GET | /api/registrations | admin | all registrations |
| POST | /api/applications | exhibitor | apply to expo |
| GET | /api/applications/mine | exhibitor | own applications |
| PUT | /api/applications/:id/booth-change | exhibitor | request booth change |
| GET | /api/applications | admin | all applications |
| PUT | /api/applications/:id/approve | admin | approve |
| PUT | /api/applications/:id/reject | admin | reject |
| GET | /api/booths/expo/:id | public | available booths for expo |
| GET | /api/booths/mine | exhibitor | own assigned booth |
| GET | /api/booths | admin | all booths |
| POST | /api/booths | admin | create booth |
| PUT | /api/booths/:id/assign | admin | assign exhibitor |
| PUT | /api/booths/:id/clear | admin | clear assignment |
| DELETE | /api/booths/:id | admin | delete booth |
| GET | /api/products | public | all products |
| GET | /api/products/mine | exhibitor | own products |
| POST | /api/products | exhibitor | add product |
| PUT/DELETE | /api/products/:id | exhibitor | update / delete product |
| POST | /api/newsletter/subscribe | public | subscribe |
| GET | /api/newsletter/subscribers | admin | all subscribers |
| GET | /api/auth/stats | admin | user count stats |
| GET | /api/auth/users | admin | all users |
| PUT | /api/auth/users/:id/status | admin | toggle active/inactive |
| GET | /api/saved-sessions | attendee | get saved sessions |
| POST | /api/saved-sessions | attendee | save a session |
| DELETE | /api/saved-sessions/:sessionId | attendee | unsave a session |
| POST | /api/contacts | public | submit contact message |
| GET | /api/contacts | admin | all contact messages |
| PUT | /api/contacts/:id/read | admin | mark as read |
| PUT | /api/contacts/:id/replied | admin | mark as replied |
| DELETE | /api/contacts/:id | admin | delete message |
| GET | /api/broadcast/expos | admin | expos with attendee counts |
| POST | /api/broadcast/send | admin | send bulk email to expo attendees |
| POST | /api/upload | auth | upload image file, returns URL |
| PUT | /api/applications/:id/booth-change-approve | admin | approve booth change |
| PUT | /api/applications/:id/booth-change-decline | admin | decline booth change |

---

[github.com/MRxSHAYAN/Planova](https://github.com/MRxSHAYAN/Planova)
