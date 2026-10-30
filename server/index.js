import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

import authRoutes from "./routes/authRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import expoRoutes from "./routes/expoRoutes.js";
import exhibitorRoutes from "./routes/exhibitorRoutes.js";
import boothRoutes from "./routes/boothRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import savedSessionRoutes from "./routes/savedSessionRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import broadcastRoutes from "./routes/broadcastRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/expos", expoRoutes);
app.use("/api/applications", exhibitorRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/saved-sessions", savedSessionRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/broadcast", broadcastRoutes);
app.use("/api/upload", uploadRoutes);

import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/uploads", (await import("express")).default.static(join(__dirname, "uploads")));

app.get("/", (_req, res) => res.json({ status: "ok", message: "Planova API" }));

app.get("/api/health", (_req, res) => {
  const STATES = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  const conn = mongoose.connection;

  res.json({
    status: conn.readyState === 1 ? "ok" : "error",
    server: {
      port: process.env.PORT || 5000,
      env: process.env.NODE_ENV || "development",
    },
    database: {
      state: STATES[conn.readyState] || "unknown",
      name: conn.name || "",
      host: conn.host || "",
    },
    time: new Date().toISOString(),
  });
});
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`\n  Planova API  http://localhost:${PORT}\n`));
}

export default app;
