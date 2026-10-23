import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const SEED_USERS = [
  {
    name: "Admin",
    email: "admin@planova.com",
    password: "admin123",
    role: "admin",
  },
  // Fake exhibitor user — used for exhibitor dashboard demo
  {
    name: "Raza Ahmed",
    email: "raza.ahmed@techbridge.pk",
    password: "exhibitor123",
    role: "exhibitor",
    phone: "+92 321 456 7890",
    city: "Karachi",
    company: "TechBridge Solutions",
  },
  // Fake attendee user — used for attendee dashboard demo
  {
    name: "Ayesha Siddiqui",
    email: "ayesha.siddiqui@email.com",
    password: "attendee123",
    role: "attendee",
    phone: "+92 300 123 4567",
    city: "Karachi",
    company: "TechVentures PK",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URI_LOCAL);
  console.log("Connected to MongoDB");

  for (const u of SEED_USERS) {
    await User.deleteOne({ email: u.email });
    await User.create(u);
    console.log(`Created user: ${u.email} / ${u.password}  [${u.role}]`);
  }

  console.log("\nSeed complete.");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
