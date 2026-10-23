import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
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

  // OTP — used for registration verify and email change
  otp:         { type: String },
  otpExpiry:   { type: Date },
  pendingEmail: { type: String }, // stores new email while waiting for OTP confirm
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
