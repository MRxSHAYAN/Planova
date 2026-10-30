import { Router } from "express";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { buildBroadcastEmail } from "../utils/sendEmail.js";
import nodemailer from "nodemailer";

const router = Router();

function makeTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// GET /api/broadcast/expos — list expos with registration counts
router.get("/expos", protect, requireRole("admin"), async (req, res) => {
  const expos = await Event.find({ status: { $ne: "archived" } }).sort({ dateStart: 1 });
  const result = await Promise.all(expos.map(async (e) => ({
    _id:   e._id,
    title: e.title,
    city:  e.city,
    dateStart: e.dateStart,
    count: await Registration.countDocuments({ event: e._id }),
  })));
  res.json(result);
});

// POST /api/broadcast/send — send bulk email to all attendees of an expo
router.post("/send", protect, requireRole("admin"), async (req, res) => {
  const { expoId, subject, message } = req.body;
  if (!expoId || !subject || !message)
    return res.status(400).json({ message: "expoId, subject and message are required" });

  const expo = await Event.findById(expoId);
  if (!expo) return res.status(404).json({ message: "Expo not found" });

  const regs = await Registration.find({ event: expoId }).populate("user", "email name");
  if (regs.length === 0) return res.status(400).json({ message: "No registered attendees for this expo" });

  const emails = regs.map(r => ({ email: r.user?.email, name: r.user?.name })).filter(r => r.email);

  const transporter = makeTransporter();
  let sent = 0, failed = 0;

  for (const recipient of emails) {
    try {
      const { html, attachments } = buildBroadcastEmail(expo.title, recipient.name, subject, message);
      await transporter.sendMail({
        from: `"Planova" <${process.env.SMTP_USER}>`,
        to: recipient.email,
        subject: `[${expo.title}] ${subject}`,
        html,
        attachments,
      });
      sent++;
    } catch { failed++; }
  }

  res.json({ sent, failed, total: emails.length });
});

export default router;
