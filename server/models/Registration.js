import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  event:        { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status:       { type: String, enum: ["confirmed","pending","cancelled"], default: "confirmed" },
  sessions:     { type: Number, default: 0 },
  registeredAt: { type: Date, default: Date.now },
}, { timestamps: true });

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);
