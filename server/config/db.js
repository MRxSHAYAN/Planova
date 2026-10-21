import mongoose from "mongoose";

const cached = global.mongooseConn || { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_ATLAS
      : process.env.MONGO_URI_LOCAL;

  if (!uri) throw new Error("MongoDB URI not set in environment variables");

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }

  cached.conn = await cached.promise;
  global.mongooseConn = cached;
  console.log(`MongoDB connected → ${cached.conn.connection.host}`);
  return cached.conn;
}
