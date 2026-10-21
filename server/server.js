import express  from "express";
import cors     from "cors";
import dotenv   from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
import authRoutes         from "./routes/authRoutes.js";
import eventRoutes        from "./routes/eventRoutes.js";
import sessionRoutes      from "./routes/sessionRoutes.js";
import exhibitorRoutes    from "./routes/exhibitorRoutes.js";
import boothRoutes        from "./routes/boothRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import bookmarkRoutes     from "./routes/bookmarkRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes         from "./routes/userRoutes.js";
import adminRoutes        from "./routes/adminRoutes.js";

app.use("/api/auth",          authRoutes);
app.use("/api/events",        eventRoutes);
app.use("/api/sessions",      sessionRoutes);
app.use("/api/exhibitors",    exhibitorRoutes);
app.use("/api/booths",        boothRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/bookmarks",     bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/admin",         adminRoutes);

// ── Health check ────────────────────────────────────────────────────────────
// GET /            → simple ping
// GET /api/health  → full DB status + route list
app.get("/", (_req, res) => res.json({ message: "Planova API running" }));

app.get("/api/health", (_req, res) => {
  const DB_STATES = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  const dbState   = mongoose.connection.readyState;

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "ok" : "error",
    api:    "running",
    database: {
      state: DB_STATES[dbState] ?? "unknown",
      name:  mongoose.connection.name  || "—",
      host:  mongoose.connection.host  || "—",
      mode:  process.env.NODE_ENV === "production" ? "Atlas (cloud)" : "Local MongoDB",
    },
    routes: {
      auth:          ["POST /api/auth/register", "POST /api/auth/login", "POST /api/auth/admin/login", "GET /api/auth/me"],
      events:        ["GET /api/events", "GET /api/events/:id"],
      sessions:      ["GET /api/sessions"],
      exhibitors:    ["GET /api/exhibitors", "GET /api/exhibitors/:id"],
      booths:        ["GET /api/booths"],
      registrations: ["POST /api/registrations", "GET /api/registrations/my"],
      bookmarks:     ["GET /api/bookmarks", "POST /api/bookmarks"],
      notifications: ["GET /api/notifications"],
      users:         ["GET /api/users/profile"],
      admin:         ["GET /api/admin/users", "GET /api/admin/reports"],
    },
    timestamp: new Date().toISOString(),
  });
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT   = process.env.PORT   || 5000;
const ENV    = process.env.NODE_ENV || "development";
const CLIENT = process.env.CLIENT_URL || "http://localhost:5173";

// Only listen on a port in local development.
// On Vercel (production), the serverless runtime imports this file
// and serves requests via the exported app — app.listen() must NOT run.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("");
    console.log("  🚀  Planova API");
    console.log("");
    console.log(`  ➜  API:        http://localhost:${PORT}`);
    console.log(`  ➜  Health:     http://localhost:${PORT}/api/health`);
    console.log(`  ➜  Frontend:   ${CLIENT}`);
    console.log(`  ➜  Mode:       ${ENV}`);
    console.log(`  ➜  DB:         Local MongoDB`);
    console.log("");
  });
}

// Export the app so Vercel's @vercel/node can serve it as a serverless function
export default app;
