import mongoose from "mongoose";

const boothSchema = new mongoose.Schema({
  boothId:  { type: String, required: true },
  event:    { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  type:     { type: String, enum: ["Standard","Premium","Corner"], default: "Standard" },
  size:     { type: String },
  status:   { type: String, enum: ["available","occupied","pending"], default: "available" },
  exhibitor:{ type: String },
}, { timestamps: true });

boothSchema.index({ boothId: 1, event: 1 }, { unique: true });

export default mongoose.model("Booth", boothSchema);
