import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemType: { type: String, enum: ["session","exhibitor","event"], required: true },
  itemId:   { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

bookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
