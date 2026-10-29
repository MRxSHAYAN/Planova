import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Event from "./models/Event.js";
import Session from "./models/Session.js";
import Booth from "./models/Booth.js";
import Exhibitor from "./models/Exhibitor.js";
import Registration from "./models/Registration.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // wipe existing data
  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Session.deleteMany({}),
    Booth.deleteMany({}),
    Exhibitor.deleteMany({}),
    Registration.deleteMany({}),
  ]);
  console.log("Cleared old data");

  const hash = (pw) => bcrypt.hash(pw, 10);

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminUser = await User.create({
    name: "Admin",
    email: "admin@planova.com",
    password: await hash("Admin@123"),
    role: "admin",
    isVerified: true,
    isActive: true,
  });

  const exhibitorUsers = await Promise.all([
    User.create({ name: "Raza Ahmed",     email: "raza@techbridge.pk",      password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "TechBridge Solutions", city: "Karachi",   category: "Technology" }),
    User.create({ name: "Sara Khan",      email: "sara@mediplus.pk",         password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "MediPlus Pakistan",     city: "Lahore",    category: "Healthcare" }),
    User.create({ name: "Usman Tariq",    email: "usman@greenenergy.pk",     password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "Green Energy PK",       city: "Islamabad", category: "Energy" }),
    User.create({ name: "Ayesha Malik",   email: "ayesha@agrosolutions.pk",  password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "Agro Solutions PK",     city: "Multan",    category: "Agriculture" }),
    User.create({ name: "Bilal Chaudhry", email: "bilal@threadcraft.pk",     password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "ThreadCraft",           city: "Faisalabad",category: "Fashion" }),
    User.create({ name: "Hina Qureshi",   email: "hina@zaiqafoods.pk",       password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "Zaiqa Foods",           city: "Karachi",   category: "Food" }),
    User.create({ name: "Tariq Mehmood",  email: "tariq@nexustech.pk",       password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "Nexus Tech",            city: "Lahore",    category: "Technology" }),
    User.create({ name: "Fatima Zaidi",   email: "fatima@purehealth.pk",     password: await hash("Exhibitor@1"), role: "exhibitor", isVerified: true, isActive: true, company: "Pure Health",           city: "Karachi",   category: "Healthcare" }),
  ]);

  const attendeeUsers = await Promise.all([
    User.create({ name: "Hamza Siddiqui",  email: "hamza@gmail.com",   password: await hash("Attendee@1"), role: "attendee", isVerified: true, isActive: true, city: "Karachi" }),
    User.create({ name: "Nadia Ali",       email: "nadia@gmail.com",   password: await hash("Attendee@1"), role: "attendee", isVerified: true, isActive: true, city: "Lahore" }),
    User.create({ name: "Omar Sheikh",     email: "omar@gmail.com",    password: await hash("Attendee@1"), role: "attendee", isVerified: true, isActive: true, city: "Islamabad" }),
    User.create({ name: "Zara Hussain",    email: "zara@gmail.com",    password: await hash("Attendee@1"), role: "attendee", isVerified: true, isActive: true, city: "Peshawar" }),
    User.create({ name: "Ali Raza",        email: "ali@gmail.com",     password: await hash("Attendee@1"), role: "attendee", isVerified: true, isActive: true, city: "Multan" }),
    User.create({ name: "Sana Mirza",      email: "sana@gmail.com",    password: await hash("Attendee@1"), role: "attendee", isVerified: true, isActive: true, city: "Quetta" }),
  ]);

  console.log(`Created ${1 + exhibitorUsers.length + attendeeUsers.length} users`);

  // ── Expos ──────────────────────────────────────────────────────────────────
  const expoData = [
    {
      title: "TechBridge Pakistan 2026",
      description: "Pakistan's largest tech expo connecting software companies, hardware manufacturers, and startups under one roof. Features product demos, investor meetups, and live coding competitions.",
      category: "Technology",
      dateStart: new Date("2026-03-15"),
      dateEnd:   new Date("2026-03-17"),
      venue: "Expo Centre Karachi",
      city: "Karachi",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      status: "published",
      totalBooths: 8,
      maxAttendees: 5000,
    },
    {
      title: "MediPak Health Expo 2026",
      description: "A dedicated platform for healthcare professionals, pharmaceutical companies, and medical device manufacturers to showcase innovations in Pakistani healthcare.",
      category: "Healthcare",
      dateStart: new Date("2026-04-10"),
      dateEnd:   new Date("2026-04-12"),
      venue: "Lahore Expo Centre",
      city: "Lahore",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
      status: "published",
      totalBooths: 6,
      maxAttendees: 3000,
    },
    {
      title: "GreenPower Energy Summit 2026",
      description: "Renewable energy companies, solar panel manufacturers, and climate tech startups gather to accelerate Pakistan's clean energy transition.",
      category: "Energy",
      dateStart: new Date("2026-05-20"),
      dateEnd:   new Date("2026-05-21"),
      venue: "PNCA Convention Hall",
      city: "Islamabad",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      status: "published",
      totalBooths: 6,
      maxAttendees: 2000,
    },
    {
      title: "AgriPak Expo 2026",
      description: "Bringing together agricultural businesses, farming cooperatives, and agri-tech companies to drive modern farming practices across Pakistan.",
      category: "Agriculture",
      dateStart: new Date("2026-06-05"),
      dateEnd:   new Date("2026-06-07"),
      venue: "Multan Dry Port Expo Ground",
      city: "Multan",
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
      status: "published",
      totalBooths: 6,
      maxAttendees: 4000,
    },
    {
      title: "PakFashion Week Trade Show 2026",
      description: "Fashion designers, textile exporters, and retail brands from across Pakistan showcase their latest collections and form new trade partnerships.",
      category: "Fashion",
      dateStart: new Date("2026-07-18"),
      dateEnd:   new Date("2026-07-19"),
      venue: "Serena Hotel Convention Centre",
      city: "Faisalabad",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
      status: "published",
      totalBooths: 4,
      maxAttendees: 1500,
    },
    {
      title: "FoodExpo Pakistan 2026",
      description: "Food manufacturers, FMCG brands, and restaurant chains connect with buyers, distributors, and investors at this national food industry expo.",
      category: "Food",
      dateStart: new Date("2026-08-22"),
      dateEnd:   new Date("2026-08-24"),
      venue: "Expo Centre Karachi Hall 2",
      city: "Karachi",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      status: "published",
      totalBooths: 4,
      maxAttendees: 3500,
    },
    {
      title: "StartupPak Summit 2025",
      description: "The premier startup event in Pakistan. Early-stage founders pitched to investors, showcased MVPs, and connected with mentors from across the ecosystem.",
      category: "Technology",
      dateStart: new Date("2025-11-10"),
      dateEnd:   new Date("2025-11-11"),
      venue: "Lahore Expo Centre Hall A",
      city: "Lahore",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
      status: "archived",
      totalBooths: 4,
      maxAttendees: 2000,
    },
  ];

  const expos = await Promise.all(
    expoData.map(d => Event.create({ ...d, organizer: adminUser._id }))
  );
  console.log(`Created ${expos.length} expos`);

  const [techExpo, mediExpo, energyExpo, agriExpo, fashionExpo, foodExpo] = expos;

  // ── Booths ─────────────────────────────────────────────────────────────────
  async function createBooths(expo, prefix, count, type = "Standard") {
    const list = [];
    for (let i = 1; i <= count; i++) {
      list.push({ boothId: `${prefix}-${String(i).padStart(2,"0")}`, event: expo._id, type, size: "3x3m" });
    }
    return Booth.insertMany(list);
  }

  const techBooths    = await createBooths(techExpo,    "T", 8);
  const mediBooths    = await createBooths(mediExpo,    "M", 6);
  const energyBooths  = await createBooths(energyExpo,  "E", 6);
  const agriBooths    = await createBooths(agriExpo,    "A", 6);
  const fashionBooths = await createBooths(fashionExpo, "F", 4);
  const foodBooths    = await createBooths(foodExpo,    "FD",4);
  console.log("Created booths");

  // ── Exhibitor Applications ─────────────────────────────────────────────────
  // Approved applications — assign a booth to each
  const approvedApps = [
    { user: exhibitorUsers[0], expo: techExpo,   company: "TechBridge Solutions", booth: techBooths[0],    category: "Technology", city: "Karachi",    contact: "Raza Ahmed",     description: "Enterprise software and cloud solutions for Pakistani businesses." },
    { user: exhibitorUsers[6], expo: techExpo,   company: "Nexus Tech",           booth: techBooths[1],    category: "Technology", city: "Lahore",     contact: "Tariq Mehmood",  description: "IoT devices and smart building automation systems." },
    { user: exhibitorUsers[1], expo: mediExpo,   company: "MediPlus Pakistan",    booth: mediBooths[0],    category: "Healthcare", city: "Lahore",     contact: "Sara Khan",      description: "Medical equipment and diagnostics for hospitals across Pakistan." },
    { user: exhibitorUsers[7], expo: mediExpo,   company: "Pure Health",          booth: mediBooths[1],    category: "Healthcare", city: "Karachi",    contact: "Fatima Zaidi",   description: "Pharmaceutical products and health supplements." },
    { user: exhibitorUsers[2], expo: energyExpo, company: "Green Energy PK",      booth: energyBooths[0],  category: "Energy",     city: "Islamabad",  contact: "Usman Tariq",    description: "Solar panels, inverters, and off-grid energy solutions." },
    { user: exhibitorUsers[3], expo: agriExpo,   company: "Agro Solutions PK",    booth: agriBooths[0],    category: "Agriculture",city: "Multan",     contact: "Ayesha Malik",   description: "Smart irrigation systems and crop monitoring technology." },
    { user: exhibitorUsers[4], expo: fashionExpo,company: "ThreadCraft",           booth: fashionBooths[0], category: "Fashion",    city: "Faisalabad", contact: "Bilal Chaudhry", description: "Premium Pakistani fabric and ready-to-wear collections." },
    { user: exhibitorUsers[5], expo: foodExpo,   company: "Zaiqa Foods",          booth: foodBooths[0],    category: "Food",       city: "Karachi",    contact: "Hina Qureshi",   description: "Traditional Pakistani spices, sauces, and packaged food." },
  ];

  for (const a of approvedApps) {
    const app = await Exhibitor.create({
      user: a.user._id, event: a.expo._id,
      company: a.company, contact: a.contact,
      email: a.user.email, category: a.category,
      city: a.city, description: a.description,
      booth: a.booth.boothId, assignedBooth: a.booth.boothId,
      status: "approved", reviewedAt: new Date(),
    });
    await Booth.findByIdAndUpdate(a.booth._id, { status: "occupied", exhibitor: a.company });
  }

  // Pending applications
  await Exhibitor.create({
    user: exhibitorUsers[0]._id, event: mediExpo._id,
    company: "TechBridge Solutions", contact: "Raza Ahmed",
    email: exhibitorUsers[0].email, category: "Technology",
    city: "Karachi", description: "Health tech solutions and hospital management software.",
    status: "pending",
  });
  await Exhibitor.create({
    user: exhibitorUsers[2]._id, event: techExpo._id,
    company: "Green Energy PK", contact: "Usman Tariq",
    email: exhibitorUsers[2].email, category: "Energy",
    city: "Islamabad", description: "Solar charging stations and energy management for tech offices.",
    status: "pending",
  });

  console.log("Created exhibitor applications");

  // ── Sessions ────────────────────────────────────────────────────────────────
  const sessions = [
    // TechBridge
    { event: techExpo._id, title: "The State of AI in Pakistan", speaker: "Dr. Asim Raza", speakerRole: "AI Research Lead, LUMS", type: "Keynote", date: new Date("2026-03-15"), time: "09:00", duration: "60 min", room: "Main Hall", description: "How AI is reshaping industries in Pakistan and what's coming next." },
    { event: techExpo._id, title: "Building Scalable APIs with Node.js", speaker: "Kamran Arif", speakerRole: "Senior Engineer, Systems Ltd", type: "Workshop", date: new Date("2026-03-15"), time: "11:00", duration: "90 min", room: "Room A" },
    { event: techExpo._id, title: "Pakistan's Startup Funding Landscape", speaker: "Panel Discussion", speakerRole: "", type: "Panel", date: new Date("2026-03-16"), time: "10:00", duration: "60 min", room: "Main Hall", description: "VCs and founders discuss funding challenges in the local market." },
    { event: techExpo._id, title: "Cloud Migration for SMEs", speaker: "Zainab Mirza", speakerRole: "Solutions Architect, AWS", type: "Talk", date: new Date("2026-03-16"), time: "14:00", duration: "45 min", room: "Room B" },
    { event: techExpo._id, title: "Cybersecurity in 2026", speaker: "Col. (r) Imran Baig", speakerRole: "CERT Pakistan", type: "Keynote", date: new Date("2026-03-17"), time: "09:30", duration: "60 min", room: "Main Hall" },
    // MediPak
    { event: mediExpo._id, title: "Telemedicine in Rural Pakistan", speaker: "Dr. Saima Akhtar", speakerRole: "PMDC", type: "Keynote", date: new Date("2026-04-10"), time: "09:00", duration: "60 min", room: "Main Hall", description: "Bridging the healthcare gap with mobile-first telemedicine platforms." },
    { event: mediExpo._id, title: "Medical Device Regulations Update", speaker: "DRAP Official", speakerRole: "Drug Regulatory Authority", type: "Talk", date: new Date("2026-04-10"), time: "11:30", duration: "45 min", room: "Room A" },
    { event: mediExpo._id, title: "AI-Assisted Diagnostics", speaker: "Dr. Faisal Qureshi", speakerRole: "Aga Khan Hospital", type: "Workshop", date: new Date("2026-04-11"), time: "10:00", duration: "90 min", room: "Room B" },
    // GreenPower
    { event: energyExpo._id, title: "Pakistan's Renewable Energy Roadmap", speaker: "Eng. Khalid Mahmood", speakerRole: "NEPRA", type: "Keynote", date: new Date("2026-05-20"), time: "09:00", duration: "60 min", room: "Main Hall", description: "Government plans to reach 30% renewable energy by 2030." },
    { event: energyExpo._id, title: "Solar + Storage: What Works in Pakistan", speaker: "Amna Rashid", speakerRole: "SunPower PK", type: "Talk", date: new Date("2026-05-20"), time: "11:00", duration: "45 min", room: "Room A" },
    // AgriPak
    { event: agriExpo._id, title: "Smart Farming with IoT", speaker: "Prof. Tariq Gill", speakerRole: "UAF", type: "Keynote", date: new Date("2026-06-05"), time: "09:00", duration: "60 min", room: "Main Hall", description: "How Pakistani farmers are using sensors and drones to improve yields." },
    { event: agriExpo._id, title: "Water Management for Arid Zones", speaker: "Dr. Hira Nawaz", speakerRole: "IWMI Pakistan", type: "Workshop", date: new Date("2026-06-06"), time: "10:00", duration: "90 min", room: "Room A" },
    // FoodExpo
    { event: foodExpo._id, title: "Halal Certification and Export", speaker: "Arif Habib", speakerRole: "PSQCA", type: "Talk", date: new Date("2026-08-22"), time: "10:00", duration: "45 min", room: "Main Hall", description: "How to get halal certified and enter Middle East export markets." },
    { event: foodExpo._id, title: "Food Safety Standards in Pakistan", speaker: "Dr. Asma Baig", speakerRole: "Punjab Food Authority", type: "Keynote", date: new Date("2026-08-23"), time: "09:00", duration: "60 min", room: "Main Hall" },
  ];

  await Session.insertMany(sessions);
  console.log(`Created ${sessions.length} sessions`);

  // ── Registrations ──────────────────────────────────────────────────────────
  const regPairs = [
    [attendeeUsers[0], techExpo],
    [attendeeUsers[0], mediExpo],
    [attendeeUsers[1], techExpo],
    [attendeeUsers[1], agriExpo],
    [attendeeUsers[2], energyExpo],
    [attendeeUsers[2], techExpo],
    [attendeeUsers[3], mediExpo],
    [attendeeUsers[3], fashionExpo],
    [attendeeUsers[4], foodExpo],
    [attendeeUsers[4], agriExpo],
    [attendeeUsers[5], techExpo],
    [attendeeUsers[5], foodExpo],
  ];

  for (const [user, expo] of regPairs) {
    await Registration.create({ user: user._id, event: expo._id, status: "confirmed" });
  }
  console.log(`Created ${regPairs.length} registrations`);

  console.log("\n=== Seed Complete ===");
  console.log("Admin:    admin@planova.com     / Admin@123");
  console.log("Exhibitor example: raza@techbridge.pk / Exhibitor@1");
  console.log("Attendee example:  hamza@gmail.com    / Attendee@1");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
