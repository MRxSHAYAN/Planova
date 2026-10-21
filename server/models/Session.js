import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  event:       { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  title:       { type: String, required: true },
  description: { type: String },
  speaker:     { type: String, required: true },
  speakerRole: { type: String },
  type:        { type: String, enum: ["Keynote","Talk","Workshop","Panel"] },
  date:        { type: Date, required: true },
  time:        { type: String, required: true },
  duration:    { type: String },
  room:        { type: String, required: true },
  attendees:   { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);
