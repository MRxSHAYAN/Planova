import { Router } from "express";
import Exhibitor from "../models/Exhibitor.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { sendApplicationStatusEmail } from "../utils/sendEmail.js";

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

  try {
    const expo = await (await import("../models/Event.js")).default.findById(app.event);
    await sendApplicationStatusEmail(app.email, app.company, expo?.title || "the expo", "approved");
  } catch { /* email is non-critical */ }

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

  try {
    const expo = await (await import("../models/Event.js")).default.findById(app.event);
    await sendApplicationStatusEmail(app.email, app.company, expo?.title || "the expo", "rejected", app.rejectReason);
  } catch { /* email is non-critical */ }

  res.json(app);
});

// Admin: approve booth change request
router.put("/:id/booth-change-approve", protect, requireRole("admin"), async (req, res) => {
  const app = await Exhibitor.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (!app.boothChangeRequest) return res.status(400).json({ message: "No booth change request pending" });

  const Booth = (await import("../models/Booth.js")).default;

  // free the old booth
  if (app.assignedBooth) {
    await Booth.findOneAndUpdate({ boothId: app.assignedBooth, event: app.event }, { status: "available", exhibitor: null });
  }

  // occupy the new booth
  await Booth.findOneAndUpdate({ boothId: app.boothChangeRequest, event: app.event }, { status: "occupied", exhibitor: app.company });

  app.assignedBooth      = app.boothChangeRequest;
  app.booth              = app.boothChangeRequest;
  app.boothChangeRequest = "";
  await app.save();

  res.json({ message: "Booth change approved", app });
});

// Admin: decline booth change request
router.put("/:id/booth-change-decline", protect, requireRole("admin"), async (req, res) => {
  const app = await Exhibitor.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });

  app.boothChangeRequest = "";
  await app.save();

  res.json({ message: "Booth change declined", app });
});
router.put("/:id/booth-change", protect, requireRole("exhibitor"), async (req, res) => {
  const app = await Exhibitor.findOne({ _id: req.params.id, user: req.user.userId });
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (app.status !== "approved") return res.status(400).json({ message: "Only approved applications can request booth change" });

  app.booth = req.body.boothPreference || app.booth;
  app.boothChangeRequest = req.body.boothPreference || "";
  await app.save();
  res.json({ message: "Booth change request sent", app });
});

export default router;
