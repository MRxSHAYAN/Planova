import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  organizer:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, required: true,
                 enum: ["Technology","Healthcare","Energy","Agriculture","Fashion","Food","Other"] },
  dateStart:   { type: Date, required: true },
  dateEnd:     { type: Date, required: true },
  venue:       { type: String, required: true },
  city:        { type: String, required: true },
  image:       { type: String },
  status:      { type: String, enum: ["draft","published","archived"], default: "draft" },
  totalBooths: { type: Number, default: 0 },
  maxAttendees:{ type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
