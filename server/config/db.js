import mongoose from "mongoose";

// Cache the connection — important for serverless (Vercel) so it
// doesn't reconnect to MongoDB on every single API request.
let cached = null;

export default async function connectDB() {
  if (cached) return cached;
  try {
    cached = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${cached.connection.host}`);
    return cached;
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`);
    process.exit(1);
  }
}
