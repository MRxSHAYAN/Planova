import { Router } from "express";
import Registration from "../models/Registration.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Attendee: register for an expo
router.post("/", protect, requireRole("attendee"), async (req, res) => {
  const { event } = req.body;
  if (!event) return res.status(400).json({ message: "event is required" });

  const exists = await Registration.findOne({ user: req.user.userId, event });
  if (exists) return res.status(400).json({ message: "Already registered" });

  const reg = await Registration.create({ user: req.user.userId, event });
  res.status(201).json(reg);
});

// Attendee: get own registrations
router.get("/mine", protect, requireRole("attendee"), async (req, res) => {
  const regs = await Registration.find({ user: req.user.userId })
    .populate("event", "title city venue dateStart dateEnd image category description")
    .sort({ registeredAt: -1 });
  res.json(regs);
});

// Attendee: cancel registration
router.delete("/:id", protect, requireRole("attendee"), async (req, res) => {
  const reg = await Registration.findOne({ _id: req.params.id, user: req.user.userId });
  if (!reg) return res.status(404).json({ message: "Registration not found" });
  await reg.deleteOne();
  res.json({ message: "Registration cancelled" });
});

// Admin: get all registrations for an expo
router.get("/", protect, requireRole("admin"), async (req, res) => {
  const filter = {};
  if (req.query.event) filter.event = req.query.event;
  const regs = await Registration.find(filter)
    .populate("user", "name email city")
    .populate("event", "title dateStart")
    .sort({ registeredAt: -1 });
  res.json(regs);
});

export default router;
