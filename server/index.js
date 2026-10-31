import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";

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

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const allowedOrigins = [
  "http://localhost:5173",
  "https://planova3747.vercel.app",
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
}));

app.use(express.json());

app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

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

app.use("/uploads", express.static(join(__dirname, "uploads")));

app.get("/", (_req, res) => res.json({ status: "ok", message: "Planova API" }));

app.get("/api/health", (_req, res) => {
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  const conn = mongoose.connection;
  res.json({
    status: conn.readyState === 1 ? "ok" : "error",
    db: states[conn.readyState] || "unknown",
    time: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

export default app;
