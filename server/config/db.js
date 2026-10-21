import mongoose from "mongoose";

let cached = null;

export default async function connectDB() {
  if (cached) return cached;

  // Use local MongoDB in development, Atlas in production (Vercel)
  const uri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_ATLAS
      : process.env.MONGO_URI_LOCAL;

  if (!uri) {
    console.error("❌  No MongoDB URI found. Check your .env file.");
    process.exit(1);
  }

  try {
    cached = await mongoose.connect(uri);
    const label =
      process.env.NODE_ENV === "production"
        ? `Atlas  → ${cached.connection.host}`
        : `Local  → ${cached.connection.host}`;
    console.log(`🍃  MongoDB connected (${label})`);
    return cached;
  } catch (error) {
    console.error(`❌  MongoDB error: ${error.message}`);
    process.exit(1);
  }
}
