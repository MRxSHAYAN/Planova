import { Router } from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { sendOTPEmail, generateOTP } from "../utils/sendEmail.js";

const router = Router();

const OTP_EXPIRY = 10 * 60 * 1000;

// Password: min 7 chars, at least one number, at least one special character
function validatePassword(pw) {
  if (!pw || pw.length < 7)
    return "Password must be at least 7 characters";
  if (!/\d/.test(pw))
    return "Password must contain at least one number";
  if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?~`]/.test(pw))
    return "Password must contain at least one special character (!@#$%^&* etc.)";
  return null;
}

function sendUser(user) {
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
    avatar:      user.avatar      || null,
    isVerified:  user.isVerified,
    token:       generateToken(user._id, user.role),
  };
}

function setOTP(user, purpose) {
  user.otp        = generateOTP();
  user.otpExpiry  = new Date(Date.now() + OTP_EXPIRY);
  user.otpPurpose = purpose;
}

function clearOTP(user) {
  user.otp          = undefined;
  user.otpExpiry    = undefined;
  user.otpPurpose   = undefined;
  user.pendingEmail = undefined;
}

function checkOTP(user, otp) {
  if (!user.otp || user.otp !== otp) return "Incorrect OTP";
  if (new Date() > user.otpExpiry)   return "OTP has expired";
  return null;
}

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email and password are required" });
  if (role === "admin")
    return res.status(400).json({ message: "Cannot register as admin" });

  const pwErr = validatePassword(password);
  if (pwErr) return res.status(400).json({ message: pwErr });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email already in use" });

  const otp = generateOTP();
  await User.create({
    name, email, password,
    role: role || "attendee",
    otp, otpExpiry: new Date(Date.now() + OTP_EXPIRY),
    otpPurpose: "verify",
    isVerified: false,
  });

  try {
    await sendOTPEmail(email, otp, "verify");
  } catch (err) {
    console.error("OTP email error:", err.message);
    await User.deleteOne({ email });
    return res.status(500).json({ message: "Failed to send OTP: " + err.message });
  }

  res.status(201).json({ message: "OTP sent to " + email });
});

// Verify OTP (registration)
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  const user = await User.findOne({ email });
  if (!user)           return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Already verified" });

  const err = checkOTP(user, otp);
  if (err) return res.status(400).json({ message: err });

  user.isVerified = true;
  clearOTP(user);
  await user.save();

  res.json(sendUser(user));
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)           return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Already verified" });

  setOTP(user, "verify");
  await user.save();

  try {
    await sendOTPEmail(email, user.otp, "verify");
  } catch (err) {
    console.error("OTP email error:", err.message);
    return res.status(500).json({ message: "Failed to send OTP: " + err.message });
  }

  res.json({ message: "OTP resent to " + email });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });
  if (!user.isActive)
    return res.status(403).json({ message: "Account is deactivated" });
  if (!user.isVerified)
    return res.status(403).json({ message: "Please verify your email first", needsVerification: true, email });

  res.json(sendUser(user));
});

// Admin login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });
  if (user.role !== "admin")
    return res.status(403).json({ message: "Not an admin account" });

  res.json(sendUser(user));
});

// Get profile
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password -otp -otpExpiry -otpPurpose");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update profile
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, phone, city, company, description, website, category, avatar } = req.body;
  if (name)                       user.name        = name;
  if (phone       !== undefined)  user.phone       = phone;
  if (city        !== undefined)  user.city        = city;
  if (company     !== undefined)  user.company     = company;
  if (description !== undefined)  user.description = description;
  if (website     !== undefined)  user.website     = website;
  if (category    !== undefined)  user.category    = category;
  if (avatar      !== undefined)  user.avatar      = avatar;

  await user.save();
  res.json(sendUser(user));
});

// Email change step 1
router.post("/request-email-change", protect, async (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail) return res.status(400).json({ message: "New email required" });
  if (await User.findOne({ email: newEmail }))
    return res.status(400).json({ message: "Email already in use" });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  setOTP(user, "email-change");
  user.pendingEmail = newEmail;
  await user.save();

  try {
    await sendOTPEmail(newEmail, user.otp, "email-change");
  } catch (err) {
    console.error("OTP email error:", err.message);
    return res.status(500).json({ message: "Failed to send OTP: " + err.message });
  }

  res.json({ message: "OTP sent to " + newEmail });
});

// Email change step 2
router.post("/confirm-email-change", protect, async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user)              return res.status(404).json({ message: "User not found" });
  if (!user.pendingEmail) return res.status(400).json({ message: "No email change pending" });

  const err = checkOTP(user, otp);
  if (err) return res.status(400).json({ message: err });

  user.email = user.pendingEmail;
  clearOTP(user);
  await user.save();

  res.json(sendUser(user));
});

// Password change step 1 (logged in)
router.post("/request-password-change", protect, async (req, res) => {
  const { newPassword } = req.body;
  const pwErr = validatePassword(newPassword);
  if (pwErr) return res.status(400).json({ message: pwErr });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  setOTP(user, "password-change");
  user.pendingPassword = newPassword;
  await user.save();

  try {
    await sendOTPEmail(user.email, user.otp, "password-change");
  } catch (err) {
    console.error("OTP email error:", err.message);
    return res.status(500).json({ message: "Failed to send OTP: " + err.message });
  }

  res.json({ message: "OTP sent to " + user.email });
});

// Password change step 2 (logged in)
router.post("/confirm-password-change", protect, async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user)                return res.status(404).json({ message: "User not found" });
  if (!user.pendingPassword) return res.status(400).json({ message: "No password change pending" });

  const err = checkOTP(user, otp);
  if (err) return res.status(400).json({ message: err });

  user.password        = user.pendingPassword;
  user.pendingPassword = undefined;
  clearOTP(user);
  await user.save();

  res.json(sendUser(user));
});

// Forgot password step 1  send OTP to email (no auth needed)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If that email exists, a code was sent" });

  setOTP(user, "forgot-password");
  await user.save();

  try {
    await sendOTPEmail(email, user.otp, "forgot-password");
  } catch (err) {
    console.error("OTP email error:", err.message);
    return res.status(500).json({ message: "Failed to send reset code: " + err.message });
  }

  res.json({ message: "Reset code sent to " + email });
});

// Forgot password step 2  verify OTP + set new password (no auth needed)
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Email, OTP and new password are required" });

  const pwErr = validatePassword(newPassword);
  if (pwErr) return res.status(400).json({ message: pwErr });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const err = checkOTP(user, otp);
  if (err) return res.status(400).json({ message: err });

  user.password = newPassword;
  clearOTP(user);
  await user.save();

  res.json({ message: "Password reset successfully. You can now log in." });
});

// Admin: list all users
router.get("/users", protect, requireRole("admin"), async (req, res) => {
  const users = await User.find()
    .select("-password -otp -otpExpiry -otpPurpose -pendingEmail -pendingPassword")
    .sort({ createdAt: -1 });
  res.json(users);
});

// Admin: user count stats
router.get("/stats", protect, requireRole("admin"), async (req, res) => {
  const total     = await User.countDocuments();
  const attendees = await User.countDocuments({ role: "attendee" });
  const exhibitors= await User.countDocuments({ role: "exhibitor" });
  const admins    = await User.countDocuments({ role: "admin" });
  const verified  = await User.countDocuments({ isVerified: true });
  const active    = await User.countDocuments({ isActive: true });

  res.json({ total, attendees, exhibitors, admins, verified, active });
});

// Admin: toggle user active/inactive
router.put("/users/:id/status", protect, requireRole("admin"), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin") return res.status(400).json({ message: "Cannot modify admin accounts" });

  user.isActive = !user.isActive;
  await user.save();

  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
});

export default router;
