import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconPath = path.join(__dirname, "../../client/src/assets/Icon.png");
const hasIcon = fs.existsSync(iconPath);

function makeTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildEmail(heading, bodyHtml) {
  const logoTag = hasIcon
    ? `<img src="cid:planova-logo" alt="Planova" width="30" height="30" style="border-radius:6px;vertical-align:middle;margin-right:8px" />`
    : "";

  return {
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden">
        <div style="background:#09152E;padding:20px 28px">
          ${logoTag}
          <span style="color:#fff;font-weight:900;font-size:18px;vertical-align:middle">Planova</span>
        </div>
        <div style="padding:28px">
          <h2 style="color:#09152E;margin:0 0 10px">${heading}</h2>
          ${bodyHtml}
          <p style="color:#94A3B8;font-size:12px;margin-top:24px">If you did not request this, ignore this email.</p>
        </div>
        <div style="background:#F0F3FA;padding:12px 28px;text-align:center">
          <p style="color:#94A3B8;font-size:11px;margin:0">2026 Planova - Pakistan's Expo Platform</p>
        </div>
      </div>
    `,
    attachments: hasIcon
      ? [{ filename: "icon.png", path: iconPath, cid: "planova-logo" }]
      : [],
  };
}

export async function sendOTPEmail(to, otp, purpose = "verify") {
  const subjects = {
    verify:            "Planova - Verify your email",
    "email-change":    "Planova - Confirm your new email",
    "password-change": "Planova - Confirm password change",
    "forgot-password": "Planova - Reset your password",
  };

  const headings = {
    verify:            "Verify your email",
    "email-change":    "Confirm your new email",
    "password-change": "Confirm password change",
    "forgot-password": "Reset your password",
  };

  const body = `
    <p style="color:#64748B;font-size:14px;margin:0 0 18px">Use this code. It expires in 10 minutes.</p>
    <div style="background:#fff;border:1.5px solid #DCEAFF;border-radius:10px;padding:22px;text-align:center">
      <span style="font-size:34px;font-weight:900;letter-spacing:10px;color:#3478F6">${otp}</span>
    </div>
  `;

  const { html, attachments } = buildEmail(headings[purpose] || "Planova", body);

  await makeTransporter().sendMail({
    from: `"Planova" <${process.env.SMTP_USER}>`,
    to,
    subject: subjects[purpose] || subjects.verify,
    html,
    attachments,
  });
}

export async function sendWelcomeEmail(to) {
  const body = `
    <p style="color:#64748B;font-size:14px;margin:0 0 12px">
      You are subscribed to expo alerts for Karachi, Lahore, and Islamabad.
    </p>
    <p style="color:#64748B;font-size:14px;margin:0">
      We will let you know when new expos open for registration in your city.
    </p>
  `;

  const { html, attachments } = buildEmail("You are subscribed", body);

  await makeTransporter().sendMail({
    from: `"Planova" <${process.env.SMTP_USER}>`,
    to,
    subject: "Planova - Subscribed to expo alerts",
    html,
    attachments,
  });
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
