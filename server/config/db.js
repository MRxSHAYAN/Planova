import mongoose from "mongoose";

// Cache on the global object so the connection survives across
// serverless function invocations (Vercel reuses the same Node process).
const cached = global.mongooseConn || { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  // Use local MongoDB in development, Atlas in production (Vercel)
  const uri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_ATLAS
      : process.env.MONGO_URI_LOCAL;

  if (!uri) {
    console.error("❌  No MongoDB URI found. Check your environment variables.");
    throw new Error("MONGO_URI not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    const label =
      process.env.NODE_ENV === "production"
        ? `Atlas  → ${cached.conn.connection.host}`
        : `Local  → ${cached.conn.connection.host}`;
    console.log(`🍃  MongoDB connected (${label})`);
    global.mongooseConn = cached;
    return cached.conn;
  } catch (error) {
    console.error(`❌  MongoDB error: ${error.message}`);
    throw error;
  }
}
