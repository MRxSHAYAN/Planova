# Planova — Event Management Platform

A full-stack MERN event management platform supporting attendees, exhibitors, and organizers.

## Live URLs

| Layer    | URL                                                              |
| -------- | ---------------------------------------------------------------- |
| Frontend | [planovaclientside.vercel.app](https://planovaclientside.vercel.app) |
| Backend  | _TBD (deploy to Railway / Render / etc.)_                        |

## Tech Stack

- **Frontend** — React 18 + Vite, deployed on Vercel
- **Backend** — Node.js / Express (planned), MongoDB + Mongoose
- **Auth** — JWT-based authentication

## Project Structure

```
E-Project plainova/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── web/     # Public-facing pages & components
│   │   └── users/   # Role-specific dashboards (attendee, exhibitor, organizer)
│   └── index.html
└── server/          # Express API (in progress)
```

## Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

## Deployment

The frontend is deployed on **Vercel** and auto-deploys from the `main` branch.  
Push to `main` → Vercel picks up the change automatically.

## Git Workflow

- `main` — production-ready code
- `dev` — active development branch
- Feature branches: `feature/<name>`
