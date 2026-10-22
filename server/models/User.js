import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["attendee", "exhibitor", "admin"], default: "attendee" },
  phone:    { type: String },
  city:     { type: String },
  company:  { type: String },
  avatar:   { type: String },
  notificationPrefs: {
    registrationConfirmations: { type: Boolean, default: true },
    scheduleUpdates:            { type: Boolean, default: true },
    announcements:              { type: Boolean, default: true },
    reminders:                  { type: Boolean, default: true },
  },
  isActive:         { type: Boolean, default: true },
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
