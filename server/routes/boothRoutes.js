import { Router } from "express";
import Booth from "../models/Booth.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Get booths for an expo
router.get("/", protect, async (req, res) => {
  const filter = {};
  if (req.query.event) filter.event = req.query.event;
  const booths = await Booth.find(filter).sort({ boothId: 1 });
  res.json(booths);
});

// Admin: create booth
router.post("/", protect, requireRole("admin"), async (req, res) => {
  const { boothId, event, type, size } = req.body;
  if (!boothId || !event) return res.status(400).json({ message: "boothId and event are required" });

  const existing = await Booth.findOne({ boothId, event });
  if (existing) return res.status(400).json({ message: "Booth already exists for this expo" });

  const booth = await Booth.create({ boothId, event, type: type || "Standard", size: size || "3x3m" });
  res.status(201).json(booth);
});

// Admin: assign exhibitor to booth
router.put("/:id/assign", protect, requireRole("admin"), async (req, res) => {
  const booth = await Booth.findById(req.params.id);
  if (!booth) return res.status(404).json({ message: "Booth not found" });

  booth.status    = "occupied";
  booth.exhibitor = req.body.exhibitor;
  await booth.save();
  res.json(booth);
});

// Admin: clear booth assignment
router.put("/:id/clear", protect, requireRole("admin"), async (req, res) => {
  const booth = await Booth.findById(req.params.id);
  if (!booth) return res.status(404).json({ message: "Booth not found" });

  booth.status    = "available";
  booth.exhibitor = null;
  await booth.save();
  res.json(booth);
});

// Admin: delete booth
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  await Booth.findByIdAndDelete(req.params.id);
  res.json({ message: "Booth deleted" });
});

export default router;
