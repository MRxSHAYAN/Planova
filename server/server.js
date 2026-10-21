  import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

// Health check
app.get("/", (req, res) => res.json({ message: "Planova API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
