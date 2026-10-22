// Admin credentials stay in the admin folder
export const ADMIN_CREDENTIALS = {
  email: "admin@planova.com",
  password: "admin123",
};

export const ADMIN_USER = {
  name: "Admin",
  email: "admin@planova.com",
  initials: "AD",
  role: "Super Admin",
};

// Re-export shared data from src/data.js so admin pages use the same data as the website
import {
  EXPOS, EXHIBITORS, SESSIONS, BOOTHS, ATTENDEES, USERS,
  ADMIN_ACTIVITY,
} from "../../data.js";

// Admin pages call them APPLICATIONS, so re-export with that name
export { EXPOS, EXHIBITORS as APPLICATIONS, SESSIONS, BOOTHS, ATTENDEES, USERS };
export { ADMIN_ACTIVITY as ACTIVITY };
