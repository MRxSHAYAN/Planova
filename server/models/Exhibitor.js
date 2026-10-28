import mongoose from "mongoose";

const exhibitorSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  event:        { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  company:      { type: String, required: true },
  contact:      { type: String, required: true },
  phone:        { type: String },
  email:        { type: String },
  category:     { type: String, required: true },
  city:         { type: String },
  employees:    { type: String },
  founded:      { type: String },
  website:      { type: String },
  description:  { type: String, required: true },
  booth:        { type: String },
  assignedBooth:{ type: String },
  status:       { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  rejectReason: { type: String },
  appliedAt:    { type: Date, default: Date.now },
  reviewedAt:   { type: Date },
}, { timestamps: true });

exhibitorSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Exhibitor", exhibitorSchema);
