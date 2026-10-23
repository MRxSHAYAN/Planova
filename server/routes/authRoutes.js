import { Router } from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email and password are required" });

  if (role === "admin")
    return res.status(400).json({ message: "Cannot register as admin" });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password, role: role || "attendee" });

  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  if (!user.isActive)
    return res.status(403).json({ message: "Account is deactivated" });

  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// POST /api/auth/admin/login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  if (user.role !== "admin")
    return res.status(403).json({ message: "Not an admin account" });

  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// GET /api/auth/profile  — fetch current user's profile
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password -resetToken -resetTokenExpiry");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT /api/auth/profile  — update own name, email, or password
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.name)     user.name     = req.body.name;
  if (req.body.email)    user.email    = req.body.email;
  if (req.body.password) user.password = req.body.password;
  if (req.body.phone     !== undefined) user.phone   = req.body.phone;
  if (req.body.city      !== undefined) user.city    = req.body.city;
  if (req.body.company   !== undefined) user.company = req.body.company;

  await user.save();

  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id, user.role),
  });
});

export default router;
