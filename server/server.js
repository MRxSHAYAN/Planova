 import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import exhibitorRoutes from "./routes/exhibitorRoutes.js";
import boothRoutes from "./routes/boothRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/exhibitors", exhibitorRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => res.json({ message: "Planova API running" }));

app.get("/api/health", (_req, res) => {
  const STATES = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  const state = mongoose.connection.readyState;

  res.status(state === 1 ? 200 : 503).json({
    status: state === 1 ? "ok" : "error",
    database: {
      state: STATES[state] || "unknown",
      name: mongoose.connection.name || "—",
      host: mongoose.connection.host || "—",
      mode: process.env.NODE_ENV === "production" ? "Atlas" : "Local",
    },
    timestamp: new Date().toISOString(),
  });
});

// Local dev only — Vercel serves via the exported app
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n  Planova API → http://localhost:${PORT}`);
    console.log(`  Health     → http://localhost:${PORT}/api/health\n`);
  });
}

export default app;
