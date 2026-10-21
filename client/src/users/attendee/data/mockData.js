// Attendee data — imports shared business data from src/data.js
// User-specific data (profile, notifications) stays here.
// When backend is ready, replace the imports with API calls.

import {
  EXPOS as SHARED_EXPOS,
  SESSIONS as SHARED_SESSIONS,
  EXHIBITORS as SHARED_EXHIBITORS,
} from "../../../data.js";

// ── Current user (attendee profile) ──────────
export const CURRENT_USER = {
  id: "u_001",
  name: "Ayesha Siddiqui",
  email: "ayesha.siddiqui@email.com",
  phone: "+92 300 123 4567",
  city: "Karachi",
  role: "Product Manager",
  company: "TechVentures PK",
  avatar: null,
  initials: "AS",
  joinedDate: "March 2025",
  notificationPrefs: {
    registrationConfirmations: true,
    scheduleUpdates: true,
    announcements: true,
    reminders: true,
    emailDigest: false,
  },
};

// ── Events (mapped from shared EXPOS) ─────────
export const EVENTS = SHARED_EXPOS.map((e, i) => ({
  id: `evt_${String(e.id).padStart(3, "0")}`,
  title: e.title,
  shortTitle: e.title.split(" ").slice(0, 2).join(" ") + " " + (e.startDate || "").slice(0, 4),
  date: e.date,
  dateStart: e.startDate,
  dateEnd: e.endDate,
  location: e.venue,
  venue: e.venue,
  address: e.city,
  category: e.category,
  status: e.status === "Published" ? "Registered" : "Browse",
  registrationStatus: e.status === "Published" ? "Confirmed" : null,
  image: e.image,
  exhibitors: e.exhibitors,
  attendees: e.attendees,
  description: e.description,
  tags: [e.category],
  featured: i < 2,
  saved: i < 3,
  upcoming: e.status === "Published",
}));

// ── Sessions (mapped from shared SESSIONS) ────
export const SESSIONS = SHARED_SESSIONS.map((s, i) => ({
  id: `ses_${String(i + 1).padStart(3, "0")}`,
  eventId: `evt_00${s.id}`,
  eventTitle: s.expo,
  title: s.title,
  speaker: s.speaker,
  speakerRole: s.speakerRole,
  date: s.date,
  dateLabel: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  timeStart: s.time,
  timeEnd: s.time,
  room: s.room,
  category: s.type,
  saved: i < 3,
  description: s.title,
}));

// ── Exhibitors (mapped from shared EXHIBITORS) ─
export const EXHIBITORS = SHARED_EXHIBITORS.filter(e => e.status === "Approved").map((e, i) => ({
  id: `exh_${String(i + 1).padStart(3, "0")}`,
  company: e.company,
  category: e.category,
  booth: e.booth,
  hall: e.booth.split("-")[0] === "A" ? "Hall A" : e.booth.split("-")[0] === "B" ? "Hall B" : "Main Hall",
  eventId: `evt_00${e.id}`,
  eventTitle: e.expo.split(" ").slice(0, 3).join(" "),
  description: e.description,
  website: e.website,
  saved: i < 3,
  logo: null,
  initials: e.company.substring(0, 2).toUpperCase(),
  color: ["#3478F6", "#16804A", "#946200", "#6D28D9", "#DC2626", "#0891B2"][i % 6],
}));

// ── Attendee notifications (local) ───────────
export const NOTIFICATIONS = [
  {
    id: "ntf_001",
    type: "confirmation",
    title: "Registration Confirmed",
    message: "You're registered for Karachi Technology Expo 2026. Check your schedule.",
    timestamp: "2026-10-10T09:15:00",
    timeLabel: "2 days ago",
    read: false,
    eventId: "evt_001",
  },
  {
    id: "ntf_002",
    type: "update",
    title: "Session Time Changed",
    message: "\"AI in Pakistani Industry\" has moved to 11:00 AM on Nov 15. Update your schedule.",
    timestamp: "2026-10-09T14:30:00",
    timeLabel: "3 days ago",
    read: false,
    eventId: "evt_001",
  },
  {
    id: "ntf_003",
    type: "reminder",
    title: "Event in 36 Days",
    message: "Karachi Technology Expo starts Nov 15. Download the agenda and review exhibitors.",
    timestamp: "2026-10-09T08:00:00",
    timeLabel: "3 days ago",
    read: false,
    eventId: "evt_001",
  },
  {
    id: "ntf_004",
    type: "announcement",
    title: "New Exhibitor Added",
    message: "Systems Limited has joined KTE 2026. View their profile and visit Booth A-09.",
    timestamp: "2026-10-07T11:00:00",
    timeLabel: "5 days ago",
    read: true,
    eventId: "evt_001",
  },
  {
    id: "ntf_005",
    type: "confirmation",
    title: "Registration Pending",
    message: "Your registration for Pakistan Health & Pharma Summit is under review.",
    timestamp: "2026-10-05T16:45:00",
    timeLabel: "7 days ago",
    read: true,
    eventId: "evt_002",
  },
  {
    id: "ntf_006",
    type: "reminder",
    title: "Complete Your Profile",
    message: "Add your professional details to get personalized event recommendations.",
    timestamp: "2026-10-01T10:00:00",
    timeLabel: "11 days ago",
    read: true,
    eventId: null,
  },
];

// ── Category colors (local style map) ────────
export const CATEGORY_COLORS = {
  Technology:   { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:   { bg: "#DDF7E7", text: "#16804A" },
  Energy:       { bg: "#FEF3C7", text: "#92620A" },
  Fashion:      { bg: "#FCE7F3", text: "#9D174D" },
  Agriculture:  { bg: "#ECFDF5", text: "#065F46" },
  Food:         { bg: "#FEF3C7", text: "#92620A" },
  Keynote:      { bg: "#09152E", text: "#FFFFFF" },
  Panel:        { bg: "#E5EEFF", text: "#09152E" },
  Workshop:     { bg: "#FEF3C7", text: "#92620A" },
  Talk:         { bg: "#DDF7E7", text: "#16804A" },
};
