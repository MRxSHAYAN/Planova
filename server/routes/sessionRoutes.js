import { Router } from "express";
import Session from "../models/Session.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Public: get sessions (filter by ?event=id)
router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.event) filter.event = req.query.event;
  const sessions = await Session.find(filter)
    .populate("event", "title city dateStart dateEnd")
    .sort({ date: 1, time: 1 });
  res.json(sessions);
});

// Admin: create session
router.post("/", protect, requireRole("admin"), async (req, res) => {
  const { event, title, speaker, speakerRole, type, date, time, duration, room, description } = req.body;
  if (!event || !title || !speaker || !date || !time || !room)
    return res.status(400).json({ message: "event, title, speaker, date, time and room are required" });

  const session = await Session.create({ event, title, speaker, speakerRole, type, date, time, duration, room, description });
  res.status(201).json(session);
});

// Admin: update session
router.put("/:id", protect, requireRole("admin"), async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const fields = ["title", "speaker", "speakerRole", "type", "date", "time", "duration", "room", "description", "event"];
  fields.forEach(f => { if (req.body[f] !== undefined) session[f] = req.body[f]; });

  await session.save();
  res.json(session);
});

// Admin: delete session
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  await Session.findByIdAndDelete(req.params.id);
  res.json({ message: "Session deleted" });
});

export default router;
