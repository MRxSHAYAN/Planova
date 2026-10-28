import { Router } from "express";
import Booth from "../models/Booth.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Public: available booths for an expo (used in apply form)
router.get("/expo/:expoId", async (req, res) => {
  const booths = await Booth.find({ event: req.params.expoId, status: "available" }).sort({ boothId: 1 });
  res.json(booths);
});

// Exhibitor: booths assigned to them (must come before /:id to avoid conflict)
router.get("/mine", protect, requireRole("exhibitor"), async (req, res) => {
  const Exhibitor = (await import("../models/Exhibitor.js")).default;
  const apps = await Exhibitor.find({ user: req.user.userId, status: "approved" });
  const companyNames = apps.map(a => a.company);
  const booths = await Booth.find({ exhibitor: { $in: companyNames } })
    .populate("event", "title city dateStart dateEnd")
    .sort({ boothId: 1 });
  res.json(booths);
});

// List booths (admin/protected, filter by ?event=id)
router.get("/", protect, async (req, res) => {
  const filter = {};
  if (req.query.event) filter.event = req.query.event;
  const booths = await Booth.find(filter)
    .populate("event", "title")
    .sort({ boothId: 1 });
  res.json(booths);
});

// Create booth
router.post("/", protect, requireRole("admin"), async (req, res) => {
  const { boothId, event, type, size } = req.body;
  if (!boothId || !event) return res.status(400).json({ message: "boothId and event are required" });

  const existing = await Booth.findOne({ boothId, event });
  if (existing) return res.status(400).json({ message: "Booth already exists for this expo" });

  const booth = await Booth.create({ boothId, event, type: type || "Standard", size: size || "3x3m" });
  res.status(201).json(booth);
});

// Assign exhibitor
router.put("/:id/assign", protect, requireRole("admin"), async (req, res) => {
  const booth = await Booth.findById(req.params.id);
  if (!booth) return res.status(404).json({ message: "Booth not found" });
  booth.status    = "occupied";
  booth.exhibitor = req.body.exhibitor;
  await booth.save();
  res.json(booth);
});

// Clear assignment
router.put("/:id/clear", protect, requireRole("admin"), async (req, res) => {
  const booth = await Booth.findById(req.params.id);
  if (!booth) return res.status(404).json({ message: "Booth not found" });
  booth.status    = "available";
  booth.exhibitor = null;
  await booth.save();
  res.json(booth);
});

// Delete booth
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  await Booth.findByIdAndDelete(req.params.id);
  res.json({ message: "Booth deleted" });
});

export default router;
