 import { Router } from "express";
import Event from "../models/Event.js";
import Session from "../models/Session.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Public: list published expos
router.get("/", async (req, res) => {
  const filter = { status: "published" };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.city)     filter.city     = new RegExp(req.query.city, "i");

  const expos = await Event.find(filter).sort({ dateStart: 1 });
  res.json(expos);
});

// Admin: list all expos (any status)
router.get("/all", protect, requireRole("admin"), async (req, res) => {
  const expos = await Event.find().sort({ createdAt: -1 });
  res.json(expos);
});

// Public: single expo
router.get("/:id", async (req, res) => {
  const expo = await Event.findById(req.params.id);
  if (!expo) return res.status(404).json({ message: "Expo not found" });
  res.json(expo);
});

// Admin: create
router.post("/", protect, requireRole("admin"), async (req, res) => {
  const { title, description, category, dateStart, dateEnd, venue, city, image, status, totalBooths } = req.body;

  if (!title || !description || !category || !dateStart || !dateEnd || !venue || !city)
    return res.status(400).json({ message: "Title, description, category, dates, venue, and city are required" });

  const expo = await Event.create({
    organizer: req.user.userId,
    title, description, category,
    dateStart, dateEnd,
    venue, city,
    image: image || "",
    status: status || "draft",
    totalBooths: totalBooths || 0,
  });

  res.status(201).json(expo);
});

// Admin: update
router.put("/:id", protect, requireRole("admin"), async (req, res) => {
  const expo = await Event.findById(req.params.id);
  if (!expo) return res.status(404).json({ message: "Expo not found" });

  const fields = ["title", "description", "category", "dateStart", "dateEnd", "venue", "city", "image", "status", "totalBooths"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) expo[f] = req.body[f];
  });

  await expo.save();
  res.json(expo);
});

// Admin: delete — also removes all sessions for that expo
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  const expo = await Event.findById(req.params.id);
  if (!expo) return res.status(404).json({ message: "Expo not found" });
  await Session.deleteMany({ event: req.params.id });
  await expo.deleteOne();
  res.json({ message: "Expo and its sessions deleted" });
});

export default router;
