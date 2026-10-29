import mongoose from "mongoose";

const savedSessionSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
}, { timestamps: true });

savedSessionSchema.index({ user: 1, session: 1 }, { unique: true });

export default mongoose.model("SavedSession", savedSessionSchema);
