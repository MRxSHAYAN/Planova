import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:        { type: String, required: true },
  category:    { type: String, default: "Other" },
  description: { type: String, required: true },
  image:       { type: String },
  tags:        { type: [String], default: [] },
  showcasing:  { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
