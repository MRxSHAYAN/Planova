import nodemailer from "nodemailer";

// Creates a transporter using credentials from .env
// Replace EMAIL_USER and EMAIL_PASS in .env with your real Gmail credentials
// For Gmail you need to use an App Password (not your real password):
// Google Account → Security → 2-Step Verification → App Passwords
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Send a 6-digit OTP email
export async function sendOTPEmail(toEmail, otp, purpose = "verify") {
  const transporter = createTransporter();

  const subject =
    purpose === "email-change"
      ? "Planova — Confirm your new email"
      : "Planova — Verify your email";

  const heading =
    purpose === "email-change"
      ? "Confirm your new email address"
      : "Verify your email address";

  const body = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
      <h2 style="color: #09152E; margin-bottom: 8px;">${heading}</h2>
      <p style="color: #64748B; font-size: 14px; margin-bottom: 24px;">
        Use the code below. It expires in <strong>10 minutes</strong>.
      </p>
      <div style="background: #fff; border: 1.5px solid #DCEAFF; border-radius: 10px; padding: 24px; text-align: center;">
        <span style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #3478F6;">${otp}</span>
      </div>
      <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">
        If you didn't request this, ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Planova" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: body,
  });
}

// Generate a random 6-digit OTP string
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
