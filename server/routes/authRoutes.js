import { Router } from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";
import { sendOTPEmail, generateOTP } from "../utils/sendEmail.js";

const router = Router();

// Helper — build the user response object
function userResponse(user) {
  return {
    _id:         user._id,
    name:        user.name,
    email:       user.email,
    role:        user.role,
    company:     user.company     || null,
    phone:       user.phone       || null,
    city:        user.city        || null,
    description: user.description || null,
    website:     user.website     || null,
    category:    user.category    || null,
    isVerified:  user.isVerified,
    token:       generateToken(user._id, user.role),
  };
}

// ─────────────────────────────────────────────
// STEP 1 of register: validate fields, save user
// as unverified, send OTP to email
// POST /api/auth/register
// ─────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email and password are required" });

  if (role === "admin")
    return res.status(400).json({ message: "Cannot register as admin" });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email already in use" });

  // Generate OTP
  const otp       = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save user as unverified
  await User.create({
    name, email, password,
    role: role || "attendee",
    otp, otpExpiry,
    isVerified: false,
  });

  // Send the OTP email
  try {
    await sendOTPEmail(email, otp, "verify");
  } catch (err) {
    // If email fails, delete the user so they can retry
    await User.deleteOne({ email });
    return res.status(500).json({ message: "Failed to send OTP email. Check your email address." });
  }

  res.status(201).json({ message: "OTP sent to " + email });
});

// ─────────────────────────────────────────────
// STEP 2 of register: verify OTP → activate account
// POST /api/auth/verify-otp
// body: { email, otp }
// ─────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (user.isVerified)
    return res.status(400).json({ message: "Email already verified" });

  if (!user.otp || user.otp !== otp)
    return res.status(400).json({ message: "Incorrect OTP" });

  if (new Date() > user.otpExpiry)
    return res.status(400).json({ message: "OTP has expired. Register again." });

  // Mark verified, clear OTP
  user.isVerified = true;
  user.otp        = undefined;
  user.otpExpiry  = undefined;
  await user.save();

  res.json(userResponse(user));
});

// ─────────────────────────────────────────────
// Resend OTP during registration
// POST /api/auth/resend-otp
// body: { email }
// ─────────────────────────────────────────────
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (user.isVerified)
    return res.status(400).json({ message: "Email already verified" });

  const otp       = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  user.otp        = otp;
  user.otpExpiry  = otpExpiry;
  await user.save();

  try {
    await sendOTPEmail(email, otp, "verify");
  } catch {
    return res.status(500).json({ message: "Failed to send OTP email" });
  }

  res.json({ message: "OTP resent to " + email });
});

// ─────────────────────────────────────────────
// Login — blocks unverified accounts
// POST /api/auth/login
// ─────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  if (!user.isActive)
    return res.status(403).json({ message: "Account is deactivated" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Please verify your email first", needsVerification: true, email });

  res.json(userResponse(user));
});

// ─────────────────────────────────────────────
// Admin login (admins skip verification)
// POST /api/auth/admin/login
// ─────────────────────────────────────────────
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  if (user.role !== "admin")
    return res.status(403).json({ message: "Not an admin account" });

  res.json(userResponse(user));
});

// ─────────────────────────────────────────────
// Get my profile
// GET /api/auth/profile
// ─────────────────────────────────────────────
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password -otp -otpExpiry");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// ─────────────────────────────────────────────
// Update profile (name, password, phone, city, etc.)
// Email change requires OTP — handled separately below
// PUT /api/auth/profile
// ─────────────────────────────────────────────
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, password, phone, city, company, description, website, category } = req.body;

  // Note: email is NOT accepted here — use /request-email-change instead
  if (name)                       user.name        = name;
  if (password)                   user.password    = password;
  if (phone       !== undefined)  user.phone       = phone;
  if (city        !== undefined)  user.city        = city;
  if (company     !== undefined)  user.company     = company;
  if (description !== undefined)  user.description = description;
  if (website     !== undefined)  user.website     = website;
  if (category    !== undefined)  user.category    = category;

  await user.save();
  res.json(userResponse(user));
});

// ─────────────────────────────────────────────
// STEP 1 of email change: send OTP to new email
// POST /api/auth/request-email-change
// body: { newEmail }
// ─────────────────────────────────────────────
router.post("/request-email-change", protect, async (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail)
    return res.status(400).json({ message: "New email is required" });

  if (await User.findOne({ email: newEmail }))
    return res.status(400).json({ message: "That email is already in use" });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp       = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp          = otp;
  user.otpExpiry    = otpExpiry;
  user.pendingEmail = newEmail;
  await user.save();

  try {
    await sendOTPEmail(newEmail, otp, "email-change");
  } catch {
    return res.status(500).json({ message: "Failed to send OTP to new email" });
  }

  res.json({ message: "OTP sent to " + newEmail });
});

// ─────────────────────────────────────────────
// STEP 2 of email change: verify OTP → swap email
// POST /api/auth/confirm-email-change
// body: { otp }
// ─────────────────────────────────────────────
router.post("/confirm-email-change", protect, async (req, res) => {
  const { otp } = req.body;
  if (!otp)
    return res.status(400).json({ message: "OTP is required" });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.pendingEmail)
    return res.status(400).json({ message: "No email change pending" });

  if (!user.otp || user.otp !== otp)
    return res.status(400).json({ message: "Incorrect OTP" });

  if (new Date() > user.otpExpiry)
    return res.status(400).json({ message: "OTP has expired. Request again." });

  // Swap the email
  user.email        = user.pendingEmail;
  user.pendingEmail = undefined;
  user.otp          = undefined;
  user.otpExpiry    = undefined;
  await user.save();

  res.json(userResponse(user));
});

export default router;
