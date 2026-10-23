import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URI_LOCAL);
  console.log("Connected to MongoDB");

  // Remove existing admin
  await User.deleteOne({ email: "admin@planova.com" });

  // Create admin user (password gets hashed by the model's pre-save hook)
  await User.create({
    name: "Admin",
    email: "admin@planova.com",
    password: "admin123",
    role: "admin",
  });

  console.log("Admin user created: admin@planova.com / admin123");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
