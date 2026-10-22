import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

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

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
  })
);

app.use(express.json());

// Ensure the database is connected before handling API requests.
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// API routes
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

// Health checks
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Planova API running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Centralized error handling
app.use((err, _req, res, _next) => {
  console.error("Planova API error:", err.message);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Planova API running on port ${PORT}`);
  });
}

export default app;