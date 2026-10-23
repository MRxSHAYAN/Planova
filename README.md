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
- Attendee dashboard — overview, explore events, schedule, saved items, profile
- Exhibitor dashboard — overview, applications, booths, company profile, settings
- Admin panel — users (live from DB), overview stats, subscribers, settings
- Auth — JWT login, OTP email verification on register, OTP for email change, OTP for password change
- Forgot password — OTP sent to email, reset password flow
- Password requirements — 7+ characters, one letter, one special character
- Profile picture upload — stored as base64 in MongoDB
- Newsletter subscription — saves to DB, sends welcome email, visible in admin
- Demo credentials removed from all login pages

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
| POST | `/api/newsletter/subscribe` | Public | Subscribe to expo alerts |
| GET | `/api/newsletter/subscribers` | Admin | List all subscribers |
| DELETE | `/api/newsletter/subscribers/:id` | Admin | Remove subscriber |
| GET | `/api/health` | Public | Server + DB status |

## Project Structure

```
client/src/
├── context/AuthContext.jsx       # Auth state: user, login, logout, updateUser
├── hooks/useProfile.js           # Fetch and update profile from API
├── web/                          # Public website
│   ├── pages/                    # Home, About, ExploreExpos, etc.
│   │   └── auth/                 # Login, Register (2-step OTP), ForgotPassword
│   └── components/               # Navbar, Footer, AuthNavbar
├── users/
│   ├── attendee/
│   │   ├── pages/MyProfile.jsx   # Dynamic — name, photo, email (OTP), password (OTP)
│   │   └── data/mockData.js      # Events, sessions (mock)
│   └── exhibitor/
│       ├── pages/CompanyProfile.jsx  # Dynamic — company info
│       ├── pages/Settings.jsx        # Dynamic — name, email (OTP), password (OTP)
│       └── data/mockData.js          # Applications, booths (mock)
└── admin/
    ├── pages/Settings.jsx        # Dynamic — photo, name, email (OTP), password (OTP)
    ├── pages/Users.jsx           # Dynamic — real users from DB
    ├── pages/Overview.jsx        # Dynamic — user counts + newsletter subscribers
    └── data/adminData.js         # Expo/booth stats (mock)

server/
├── routes/authRoutes.js          # All auth + profile + OTP + admin endpoints
├── routes/newsletterRoutes.js    # Subscribe, list, delete subscribers
├── models/User.js                # User model with OTP fields
├── models/Subscriber.js          # Newsletter subscriber model
├── utils/sendEmail.js            # Nodemailer with logo in emails
├── utils/generateToken.js        # JWT token creation
└── seed.js                       # Creates demo users
```

## What is Dynamic vs Mock

**Dynamic (from database):**
- User profiles, avatars, names, emails
- OTP flows (register, email change, password change, forgot password)
- Admin user list, counts, activate/deactivate
- Admin overview user stats
- Newsletter subscribers
- Admin settings (photo, name, email, password)

**Still mock (local arrays, not from DB):**
- Expos, sessions, exhibitors on public site
- Attendee events and schedule
- Exhibitor applications and booths
- Admin expo/booth/application stats

## Deployment (Vercel)

Set these in Vercel dashboard:

```
NODE_ENV=production
MONGO_URI=<Atlas connection string>
JWT_SECRET=<your secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your Gmail>
SMTP_PASS=<your App Password>
CLIENT_URL=https://your-domain.vercel.app
```
