import { Router } from "express";
import Subscriber from "../models/Subscriber.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Subscribe — public
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const exists = await Subscriber.findOne({ email });
  if (exists) return res.status(400).json({ message: "Already subscribed" });

  await Subscriber.create({ email });

  try {
    await sendWelcomeEmail(email);
  } catch (err) {
    console.error("Welcome email error:", err.message);
  }

  res.status(201).json({ message: "Subscribed successfully" });
});

// Get all subscribers — admin only
router.get("/subscribers", protect, requireRole("admin"), async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json(subscribers);
});

// Delete a subscriber — admin only
router.delete("/subscribers/:id", protect, requireRole("admin"), async (req, res) => {
  await Subscriber.findByIdAndDelete(req.params.id);
  res.json({ message: "Removed" });
});

export default router;
