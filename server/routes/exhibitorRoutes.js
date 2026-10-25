import { Router } from "express";
import Exhibitor from "../models/Exhibitor.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Public: get approved exhibitors (for attendee dashboard)
router.get("/approved", async (req, res) => {
  const filter = { status: "approved" };
  if (req.query.event) filter.event = req.query.event;
  const exhibitors = await Exhibitor.find(filter)
    .populate("event", "title city dateStart")
    .sort({ company: 1 });
  res.json(exhibitors);
});

// Exhibitor: submit application
router.post("/", protect, requireRole("exhibitor"), async (req, res) => {
  const { event, company, contact, phone, email, category, city, description, boothPreference } = req.body;

  if (!event || !company || !contact || !category || !description)
    return res.status(400).json({ message: "event, company, contact, category and description are required" });

  const existing = await Exhibitor.findOne({ user: req.user.userId, event });
  if (existing)
    return res.status(400).json({ message: "You already applied to this expo" });

  const app = await Exhibitor.create({
    user: req.user.userId,
    event, company, contact, phone, email, category, city, description,
    booth: boothPreference || "",
  });

  res.status(201).json(app);
});

// Exhibitor: get own applications
router.get("/mine", protect, requireRole("exhibitor"), async (req, res) => {
  const apps = await Exhibitor.find({ user: req.user.userId })
    .populate("event", "title city dateStart dateEnd image")
    .sort({ appliedAt: -1 });
  res.json(apps);
});

// Admin: get all applications
router.get("/", protect, requireRole("admin"), async (req, res) => {
  const apps = await Exhibitor.find()
    .populate("event", "title city dateStart dateEnd")
    .populate("user", "name email")
    .sort({ appliedAt: -1 });
  res.json(apps);
});

// Admin: approve
router.put("/:id/approve", protect, requireRole("admin"), async (req, res) => {
  const app = await Exhibitor.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });

  app.status     = "approved";
  app.reviewedAt = new Date();
  await app.save();
  res.json(app);
});

// Admin: reject
router.put("/:id/reject", protect, requireRole("admin"), async (req, res) => {
  const app = await Exhibitor.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });

  app.status       = "rejected";
  app.rejectReason = req.body.reason || "";
  app.reviewedAt   = new Date();
  await app.save();
  res.json(app);
});

export default router;
