import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, lowercase: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ["attendee", "exhibitor", "admin"], default: "attendee" },
  phone:       { type: String },
  city:        { type: String },
  company:     { type: String },
  category:    { type: String },
  description: { type: String },
  website:     { type: String },
  avatar:      { type: String },
  isActive:    { type: Boolean, default: true },

  // Email verification
  isVerified:  { type: Boolean, default: false },

  // OTP
  otp:             { type: String },
  otpExpiry:       { type: Date },
  otpPurpose:      { type: String },
  pendingEmail:    { type: String },
  pendingPassword: { type: String },
}, { timestamps: true });

// One account per email+role combo (same email can exist as attendee AND exhibitor)
userSchema.index({ email: 1, role: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
