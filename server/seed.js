import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Event from "./models/Event.js";
import Session from "./models/Session.js";
import Booth from "./models/Booth.js";
import Exhibitor from "./models/Exhibitor.js";
import Registration from "./models/Registration.js";
import Product from "./models/Product.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Session.deleteMany({}),
    Booth.deleteMany({}),
    Exhibitor.deleteMany({}),
    Registration.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log("Cleared old data");

  // NOTE: pass plain passwords — the User model pre("save") hook hashes them
  // DO NOT pre-hash here or passwords will be double-hashed and login will fail

  // ── Users ──────────────────────────────────────────────────────────────────

  const adminUser = await User.create({
    name: "Admin",
    email: "admin@planova.com",
    password: "Admin@123",
    role: "admin",
    isVerified: true,
    isActive: true,
  });

  // Exhibitors: Shayan, Hadi, Moeed, Meekail
  const exhibitorUsers = await Promise.all([
    User.create({ name: "Shayan",   email: "shayan@techbridge.pk",    password: "Planova@1", role: "exhibitor", isVerified: true, isActive: true, company: "TechBridge Solutions", city: "Karachi",    category: "Technology"  }),
    User.create({ name: "Hadi",     email: "hadi@mediplus.pk",         password: "Planova@1", role: "exhibitor", isVerified: true, isActive: true, company: "MediPlus Pakistan",     city: "Lahore",     category: "Healthcare"  }),
    User.create({ name: "Moeed",    email: "moeed@greenenergy.pk",     password: "Planova@1", role: "exhibitor", isVerified: true, isActive: true, company: "Green Energy PK",       city: "Islamabad",  category: "Energy"      }),
    User.create({ name: "Meekail",  email: "meekail@agrosolutions.pk", password: "Planova@1", role: "exhibitor", isVerified: true, isActive: true, company: "Agro Solutions PK",     city: "Multan",     category: "Agriculture" }),
  ]);

  // Attendees: Hamza, Uzair, Fakir, Haseeb
  const attendeeUsers = await Promise.all([
    User.create({ name: "Hamza",    email: "hamza@gmail.com",   password: "Planova@1", role: "attendee", isVerified: true, isActive: true, city: "Karachi"   }),
    User.create({ name: "Uzair",    email: "uzair@gmail.com",   password: "Planova@1", role: "attendee", isVerified: true, isActive: true, city: "Lahore"    }),
    User.create({ name: "Fakir",    email: "fakir@gmail.com",   password: "Planova@1", role: "attendee", isVerified: true, isActive: true, city: "Islamabad" }),
    User.create({ name: "Haseeb",   email: "haseeb@gmail.com",  password: "Planova@1", role: "attendee", isVerified: true, isActive: true, city: "Peshawar"  }),
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
      totalBooths: 6,
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
  async function createBooths(expo, prefix, count) {
    const list = [];
    for (let i = 1; i <= count; i++) {
      list.push({ boothId: `${prefix}-${String(i).padStart(2, "0")}`, event: expo._id, type: "Standard", size: "3x3m" });
    }
    return Booth.insertMany(list);
  }

  const techBooths   = await createBooths(techExpo,    "T",  6);
  const mediBooths   = await createBooths(mediExpo,    "M",  6);
  const energyBooths = await createBooths(energyExpo,  "E",  6);
  const agriBooths   = await createBooths(agriExpo,    "A",  6);
  const fashionBooths= await createBooths(fashionExpo, "F",  4);
  const foodBooths   = await createBooths(foodExpo,    "FD", 4);
  console.log("Created booths");

  // ── Exhibitor Applications ─────────────────────────────────────────────────
  const approvedApps = [
    { user: exhibitorUsers[0], expo: techExpo,    company: "TechBridge Solutions", booth: techBooths[0],    category: "Technology",  city: "Karachi",   contact: "Shayan",   description: "Enterprise software and cloud solutions for Pakistani businesses." },
    { user: exhibitorUsers[1], expo: mediExpo,    company: "MediPlus Pakistan",    booth: mediBooths[0],    category: "Healthcare",  city: "Lahore",    contact: "Hadi",     description: "Medical equipment and diagnostics for hospitals across Pakistan." },
    { user: exhibitorUsers[2], expo: energyExpo,  company: "Green Energy PK",      booth: energyBooths[0],  category: "Energy",      city: "Islamabad", contact: "Moeed",    description: "Solar panels, inverters, and off-grid energy solutions." },
    { user: exhibitorUsers[3], expo: agriExpo,    company: "Agro Solutions PK",    booth: agriBooths[0],    category: "Agriculture", city: "Multan",    contact: "Meekail",  description: "Smart irrigation systems and crop monitoring technology." },
  ];

  for (const a of approvedApps) {
    await Exhibitor.create({
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
    company: "TechBridge Solutions", contact: "Shayan",
    email: exhibitorUsers[0].email, category: "Technology",
    city: "Karachi", description: "Health tech solutions for hospitals.",
    status: "pending",
  });
  await Exhibitor.create({
    user: exhibitorUsers[2]._id, event: techExpo._id,
    company: "Green Energy PK", contact: "Moeed",
    email: exhibitorUsers[2].email, category: "Energy",
    city: "Islamabad", description: "Solar charging stations for tech offices.",
    status: "pending",
  });

  console.log("Created exhibitor applications");

  // ── Sessions ────────────────────────────────────────────────────────────────
  const sessions = [
    { event: techExpo._id,    title: "The State of AI in Pakistan",           speaker: "Dr. Asim Raza",       speakerRole: "AI Research Lead, LUMS",     type: "Keynote",  date: new Date("2026-03-15"), time: "09:00", duration: "60 min", room: "Main Hall",  description: "How AI is reshaping industries in Pakistan." },
    { event: techExpo._id,    title: "Building Scalable APIs with Node.js",   speaker: "Kamran Arif",         speakerRole: "Senior Engineer, Systems Ltd", type: "Workshop", date: new Date("2026-03-15"), time: "11:00", duration: "90 min", room: "Room A" },
    { event: techExpo._id,    title: "Pakistan's Startup Funding Landscape",  speaker: "Panel Discussion",    speakerRole: "",                            type: "Panel",    date: new Date("2026-03-16"), time: "10:00", duration: "60 min", room: "Main Hall",  description: "VCs and founders discuss local funding challenges." },
    { event: techExpo._id,    title: "Cloud Migration for SMEs",              speaker: "Zainab Mirza",        speakerRole: "Solutions Architect, AWS",    type: "Talk",     date: new Date("2026-03-16"), time: "14:00", duration: "45 min", room: "Room B" },
    { event: techExpo._id,    title: "Cybersecurity in 2026",                 speaker: "Col. (r) Imran Baig", speakerRole: "CERT Pakistan",               type: "Keynote",  date: new Date("2026-03-17"), time: "09:30", duration: "60 min", room: "Main Hall" },
    { event: mediExpo._id,    title: "Telemedicine in Rural Pakistan",        speaker: "Dr. Saima Akhtar",    speakerRole: "PMDC",                        type: "Keynote",  date: new Date("2026-04-10"), time: "09:00", duration: "60 min", room: "Main Hall",  description: "Bridging the healthcare gap with mobile-first platforms." },
    { event: mediExpo._id,    title: "Medical Device Regulations Update",     speaker: "DRAP Official",       speakerRole: "Drug Regulatory Authority",   type: "Talk",     date: new Date("2026-04-10"), time: "11:30", duration: "45 min", room: "Room A" },
    { event: mediExpo._id,    title: "AI-Assisted Diagnostics",               speaker: "Dr. Faisal Qureshi",  speakerRole: "Aga Khan Hospital",           type: "Workshop", date: new Date("2026-04-11"), time: "10:00", duration: "90 min", room: "Room B" },
    { event: energyExpo._id,  title: "Pakistan's Renewable Energy Roadmap",   speaker: "Eng. Khalid Mahmood", speakerRole: "NEPRA",                       type: "Keynote",  date: new Date("2026-05-20"), time: "09:00", duration: "60 min", room: "Main Hall",  description: "Plans to reach 30% renewable energy by 2030." },
    { event: energyExpo._id,  title: "Solar + Storage: What Works Here",      speaker: "Amna Rashid",         speakerRole: "SunPower PK",                 type: "Talk",     date: new Date("2026-05-20"), time: "11:00", duration: "45 min", room: "Room A" },
    { event: agriExpo._id,    title: "Smart Farming with IoT",                speaker: "Prof. Tariq Gill",    speakerRole: "UAF",                         type: "Keynote",  date: new Date("2026-06-05"), time: "09:00", duration: "60 min", room: "Main Hall",  description: "Sensors and drones improving yields across Pakistan." },
    { event: agriExpo._id,    title: "Water Management for Arid Zones",       speaker: "Dr. Hira Nawaz",      speakerRole: "IWMI Pakistan",               type: "Workshop", date: new Date("2026-06-06"), time: "10:00", duration: "90 min", room: "Room A" },
    { event: foodExpo._id,    title: "Halal Certification and Export",        speaker: "Arif Habib",          speakerRole: "PSQCA",                       type: "Talk",     date: new Date("2026-08-22"), time: "10:00", duration: "45 min", room: "Main Hall",  description: "How to get halal certified and enter Middle East markets." },
    { event: foodExpo._id,    title: "Food Safety Standards in Pakistan",     speaker: "Dr. Asma Baig",       speakerRole: "Punjab Food Authority",       type: "Keynote",  date: new Date("2026-08-23"), time: "09:00", duration: "60 min", room: "Main Hall" },
  ];

  await Session.insertMany(sessions);
  console.log(`Created ${sessions.length} sessions`);

  // ── Registrations ──────────────────────────────────────────────────────────
  const regPairs = [
    [attendeeUsers[0], techExpo],
    [attendeeUsers[0], mediExpo],
    [attendeeUsers[1], techExpo],
    [attendeeUsers[1], energyExpo],
    [attendeeUsers[2], mediExpo],
    [attendeeUsers[2], agriExpo],
    [attendeeUsers[3], techExpo],
    [attendeeUsers[3], foodExpo],
  ];

  for (const [user, expo] of regPairs) {
    await Registration.create({ user: user._id, event: expo._id, status: "confirmed" });
  }
  console.log(`Created ${regPairs.length} registrations`);

  // ── Products ───────────────────────────────────────────────────────────────
  const products = [
    { user: exhibitorUsers[0]._id, name: "TechBridge ERP Suite",     category: "Enterprise Software",   showcasing: true,  tags: ["ERP","SaaS","SME"],          description: "End-to-end ERP covering inventory, HR, payroll, and procurement for Pakistani SMEs.",              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
    { user: exhibitorUsers[0]._id, name: "CloudSync Analytics",      category: "Business Intelligence", showcasing: true,  tags: ["Analytics","BI","Cloud"],     description: "Real-time dashboards and predictive analytics that integrate with existing databases.",               image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
    { user: exhibitorUsers[0]._id, name: "SecureVault ID",           category: "Cybersecurity",         showcasing: false, tags: ["IAM","Security"],             description: "Identity and access management with multi-factor auth and audit logging.",                           image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
    { user: exhibitorUsers[1]._id, name: "DiagnostiX Lab Suite",     category: "Healthcare",            showcasing: true,  tags: ["Diagnostics","Lab"],          description: "Automated lab management for pathology, radiology, and billing.",                                   image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400" },
    { user: exhibitorUsers[1]._id, name: "PatientLink Mobile",       category: "Healthcare",            showcasing: true,  tags: ["Telemedicine","Mobile"],      description: "Patient portal app for appointments, prescriptions, and teleconsultations.",                         image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400" },
    { user: exhibitorUsers[2]._id, name: "SolarMax 450W Panel",      category: "Energy",                showcasing: true,  tags: ["Solar","Renewable"],          description: "High-efficiency monocrystalline panels rated for Pakistan's climate, 25-year warranty.",             image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400" },
    { user: exhibitorUsers[2]._id, name: "PowerStore 10kWh Battery", category: "Energy",                showcasing: true,  tags: ["Battery","Storage"],          description: "LiFePO4 battery pack for residential and small commercial off-grid setups.",                         image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400" },
    { user: exhibitorUsers[3]._id, name: "IrriSmart Controller",     category: "Agriculture",           showcasing: true,  tags: ["Irrigation","IoT"],           description: "Solar-powered drip irrigation controller with soil moisture sensors and SMS alerts.",                 image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400" },
    { user: exhibitorUsers[3]._id, name: "CropWatch Drone Kit",      category: "Agriculture",           showcasing: true,  tags: ["Drone","Precision Farming"],  description: "Drone kit with NDVI camera for field health mapping and yield estimation.",                           image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400" },
  ];

  await Product.insertMany(products);
  console.log(`Created ${products.length} products`);

  // ── Newsletter subscribers ─────────────────────────────────────────────────
  const NewsletterSchema = new mongoose.Schema({ email: { type: String, unique: true }, createdAt: { type: Date, default: Date.now } });
  const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);
  await Newsletter.deleteMany({});
  await Newsletter.insertMany([
    { email: "sara.business@gmail.com",  createdAt: new Date("2025-12-01") },
    { email: "tech.karachi@outlook.com", createdAt: new Date("2025-12-05") },
    { email: "expo.fan.pk@gmail.com",    createdAt: new Date("2025-12-10") },
    { email: "investor.pak@gmail.com",   createdAt: new Date("2026-01-03") },
    { email: "startup.lahore@gmail.com", createdAt: new Date("2026-01-15") },
    { email: "healthpro.pk@gmail.com",   createdAt: new Date("2026-01-20") },
    { email: "agribusiness@yahoo.com",   createdAt: new Date("2026-02-02") },
    { email: "fashionweek.pk@gmail.com", createdAt: new Date("2026-02-14") },
    { email: "foodnbev.pk@hotmail.com",  createdAt: new Date("2026-02-28") },
    { email: "energywatch.pk@gmail.com", createdAt: new Date("2026-03-05") },
  ]);
  console.log("Created 10 newsletter subscribers");

  console.log("\n=== Seed Complete ===");
  console.log("Admin:     admin@planova.com   / Admin@123");
  console.log("Exhibitors: shayan@techbridge.pk, hadi@mediplus.pk, moeed@greenenergy.pk, meekail@agrosolutions.pk");
  console.log("Attendees:  hamza@gmail.com, uzair@gmail.com, fakir@gmail.com, haseeb@gmail.com");
  console.log("Password for all exhibitors and attendees: Planova@1");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
