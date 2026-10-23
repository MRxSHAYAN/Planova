// Re-export shared data from src/data.js for admin pages
import {
  EXPOS, EXHIBITORS, SESSIONS, BOOTHS, ATTENDEES, USERS,
  ADMIN_ACTIVITY,
} from "../../data.js";

export { EXPOS, EXHIBITORS as APPLICATIONS, SESSIONS, BOOTHS, ATTENDEES, USERS };
export { ADMIN_ACTIVITY as ACTIVITY };
