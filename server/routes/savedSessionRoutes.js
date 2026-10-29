import { Router } from "express";
import SavedSession from "../models/SavedSession.js";
import Session from "../models/Session.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// GET /api/saved-sessions — attendee's saved sessions
router.get("/", protect, requireRole("attendee"), async (req, res) => {
  const saved = await SavedSession.find({ user: req.user.userId })
    .populate({ path: "session", populate: { path: "event", select: "title" } })
    .sort({ createdAt: -1 });
  res.json(saved);
});

// POST /api/saved-sessions — save a session
router.post("/", protect, requireRole("attendee"), async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: "sessionId required" });

  const exists = await SavedSession.findOne({ user: req.user.userId, session: sessionId });
  if (exists) return res.status(400).json({ message: "Already saved" });

  const saved = await SavedSession.create({ user: req.user.userId, session: sessionId });
  res.status(201).json(saved);
});

// DELETE /api/saved-sessions/:sessionId — unsave
router.delete("/:sessionId", protect, requireRole("attendee"), async (req, res) => {
  await SavedSession.findOneAndDelete({ user: req.user.userId, session: req.params.sessionId });
  res.json({ message: "Removed" });
});

export default router;
