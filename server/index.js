import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

app.get("/", (_req, res) => res.json({ status: "ok", message: "Planova API" }));
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Planova API is responding",
  });
});
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`\n  Planova API → http://localhost:${PORT}\n`));
}

export default app;
