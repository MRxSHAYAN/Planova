// Exhibitor data — imports shared business data from src/data.js
// Company-specific data (profile, applications, booths, products) stays here.
// When backend is ready, replace the imports with API calls.

import {
  EXPOS as SHARED_EXPOS,
} from "../../../data.js";

// ── Current company (exhibitor profile) ──────
export const CURRENT_COMPANY = {
  id: "co_001",
  name: "TechBridge Solutions",
  contactPerson: "Raza Ahmed",
  email: "raza.ahmed@techbridge.pk",
  phone: "+92 321 456 7890",
  website: "https://techbridge.pk",
  address: "Plot 14, SITE Industrial Area, Karachi",
  city: "Karachi",
  category: "Software & IT",
  description:
    "TechBridge Solutions delivers enterprise software, cloud infrastructure, and AI-driven analytics tools to businesses across Pakistan. Founded in 2018, we serve 120+ clients in manufacturing, retail, and financial services.",
  logo: null,
  initials: "TB",
  logoColor: "#3478F6",
  linkedin: "https://linkedin.com/company/techbridge-pk",
  twitter: "",
  profileComplete: 72,
  memberSince: "January 2025",
};

// ── Expos (mapped from shared EXPOS) ──────────
// Adds exhibitor-specific fields like availableBooths, applicationOpen, boothPriceFrom
export const EXPOS = SHARED_EXPOS.map((e) => ({
  id: `exp_${String(e.id).padStart(3, "0")}`,
  title: e.title,
  shortTitle: e.title.split(" ").slice(0, 2).join(" ") + " " + (e.startDate || "").slice(0, 4),
  date: e.date,
  dateStart: e.startDate,
  dateEnd: e.endDate,
  location: e.venue,
  venue: e.venue,
  city: e.city,
  category: e.category,
  description: e.description,
  image: e.image,
  totalBooths: e.totalBooths,
  availableBooths: e.totalBooths - e.occupiedBooths,
  attendees: e.attendees,
  applicationDeadline: e.status === "Published" ? "2026-10-25" : "2026-12-01",
  applicationOpen: e.status === "Published",
  featured: e.id <= 2,
  boothPriceFrom: [45000, 38000, 30000, 28000, 22000, 25000][e.id - 1] || 30000,
}));

// ── Applications (company-specific, kept local) ─
export const APPLICATIONS = [
  {
    id: "app_001",
    expoId: "exp_001",
    expoTitle: "Karachi Technology Expo 2026",
    expoDate: "Nov 15–17, 2026",
    expoImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=75",
    expoCity: "Karachi",
    appliedDate: "2026-10-02",
    appliedDateLabel: "Oct 2, 2026",
    boothPreference: "Corner booth, Hall A or B",
    category: "Software & IT",
    status: "approved",
    organiserNote: "Welcome! Your booth is confirmed. Please review the setup guidelines.",
    reviewedDate: "2026-10-08",
    reviewedDateLabel: "Oct 8, 2026",
  },
  {
    id: "app_002",
    expoId: "exp_002",
    expoTitle: "Pakistan Health & Pharma Summit",
    expoDate: "Dec 3–5, 2026",
    expoImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=75",
    expoCity: "Lahore",
    appliedDate: "2026-10-05",
    appliedDateLabel: "Oct 5, 2026",
    boothPreference: "Standard 3×3m booth",
    category: "Software & IT",
    status: "pending",
    organiserNote: null,
    reviewedDate: null,
    reviewedDateLabel: null,
  },
  {
    id: "app_003",
    expoId: "exp_004",
    expoTitle: "Agri-Tech Pakistan 2026",
    expoDate: "Dec 10–12, 2026",
    expoImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=75",
    expoCity: "Faisalabad",
    appliedDate: "2026-08-01",
    appliedDateLabel: "Aug 1, 2026",
    boothPreference: "Any available",
    category: "Software & IT",
    status: "rejected",
    organiserNote: "We prioritise exhibitors in the agriculture and farming technology sector for this expo.",
    reviewedDate: "2026-08-10",
    reviewedDateLabel: "Aug 10, 2026",
  },
];

// ── Booths (company-specific, kept local) ─────
export const BOOTHS = [
  {
    id: "bth_001",
    applicationId: "app_001",
    expoId: "exp_001",
    expoTitle: "Karachi Technology Expo 2026",
    expoDate: "Nov 15–17, 2026",
    expoImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=75",
    boothNumber: "A-14",
    hall: "Hall A",
    type: "Corner",
    size: "4 × 4 m",
    level: "Ground Floor",
    setupDeadline: "Nov 14, 2026, 6:00 PM",
    dismantleDeadline: "Nov 17, 2026, 8:00 PM",
    organiserContact: "events@kteexpo.pk",
    instructions:
      "Setup begins Nov 14 from 9:00 AM. All materials must be cleared by 6:00 PM. Power outlets (2×16A) are included. Wi-Fi credentials will be distributed at the registration desk. No open flames or liquids near electrical equipment.",
    status: "confirmed",
  },
];

// ── Products (company-specific, kept local) ───
export const PRODUCTS = [
  {
    id: "prd_001",
    name: "TechBridge ERP Suite",
    category: "Enterprise Software",
    description:
      "An end-to-end ERP platform covering inventory, HR, payroll, procurement, and reporting — built for Pakistani SMEs.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70",
    tags: ["ERP", "SaaS", "SME"],
    showcasing: true,
  },
  {
    id: "prd_002",
    name: "CloudSync Analytics",
    category: "Business Intelligence",
    description:
      "Real-time dashboards and predictive analytics engine that integrates with existing databases and spreadsheets.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=70",
    tags: ["Analytics", "BI", "Cloud"],
    showcasing: true,
  },
  {
    id: "prd_003",
    name: "SecureVault ID",
    category: "Cybersecurity",
    description:
      "Identity and access management solution with multi-factor authentication and audit logging for compliance.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=70",
    tags: ["IAM", "Security", "Compliance"],
    showcasing: false,
  },
];

// ── Exhibitor notifications (local) ───────────

// ── Style maps (local) ────────────────────────
export const CATEGORY_COLORS = {
  Technology:       { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:       { bg: "#DDF7E7", text: "#16804A" },
  Energy:           { bg: "#FEF3C7", text: "#92620A" },
  Agriculture:      { bg: "#ECFDF5", text: "#065F46" },
  "Software & IT":  { bg: "#DCE8FF", text: "#1D4ED8" },
  Fintech:          { bg: "#DDF7E7", text: "#16804A" },
  "Enterprise Software": { bg: "#EDE9FE", text: "#5B21B6" },
  "Business Intelligence": { bg: "#CFFAFE", text: "#155E75" },
  Cloud:            { bg: "#DBEAFE", text: "#1E40AF" },
};

export const STATUS_META = {
  approved:  { bg: "#E6F9F1", text: "#12875A", label: "Approved" },
  pending:   { bg: "#FFF4DE", text: "#A16207", label: "Pending" },
  rejected:  { bg: "#FEE2E2", text: "#B91C1C", label: "Not Accepted" },
  confirmed: { bg: "#E6F9F1", text: "#12875A", label: "Confirmed" },
  withdrawn: { bg: "#F1F5F9", text: "#64748B", label: "Withdrawn" },
};
