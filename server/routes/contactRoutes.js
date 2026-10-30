import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Public: submit a contact message
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: "All fields are required" });

  const msg = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ message: "Message sent" });
});

// Admin: list all messages
router.get("/", protect, requireRole("admin"), async (req, res) => {
  const msgs = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(msgs);
});

// Admin: mark as read
router.put("/:id/read", protect, requireRole("admin"), async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: "read" }, { new: true });
  if (!msg) return res.status(404).json({ message: "Message not found" });
  res.json(msg);
});

// Admin: mark as replied
router.put("/:id/replied", protect, requireRole("admin"), async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: "replied" }, { new: true });
  if (!msg) return res.status(404).json({ message: "Message not found" });
  res.json(msg);
});

// Admin: delete message
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.json({ message: "Message deleted" });
});

export default router;
