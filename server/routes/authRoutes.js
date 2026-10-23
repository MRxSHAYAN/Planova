import { Router } from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Register a new user
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
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company || null,
    phone: user.phone || null,
    city: user.city || null,
    token: generateToken(user._id, user.role),
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  if (!user.isActive)
    return res.status(403).json({ message: "Account is deactivated" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    phone: user.phone,
    city: user.city,
    token: generateToken(user._id, user.role),
  });
});

// Admin login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  if (user.role !== "admin")
    return res.status(403).json({ message: "Not an admin account" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// Get my profile
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update my profile (name, email, password, phone, city, company)
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, password, phone, city, company } = req.body;

  if (name)     user.name     = name;
  if (email)    user.email    = email;
  if (password) user.password = password;
  if (phone  !== undefined) user.phone   = phone;
  if (city   !== undefined) user.city    = city;
  if (company !== undefined) user.company = company;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    phone: user.phone,
    city: user.city,
    token: generateToken(user._id, user.role),
  });
});

export default router;
