import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const TEAM = [
  {
    name: "Arham Siddiqui",
    role: "Founder & CEO",
    bio: "Ex-organizer of two national tech expos. Built Planova to fix the chaos he experienced firsthand.",
    initials: "AS",
  },
  {
    name: "Zara Malik",
    role: "Head of Product",
    bio: "Previously led product at a B2B SaaS startup in Lahore. Obsessed with reducing friction for exhibitors.",
    initials: "ZM",
  },
  {
    name: "Bilal Raza",
    role: "Lead Engineer",
    bio: "Full-stack developer with 8 years of experience building scalable platforms across the MENA region.",
    initials: "BR",
  },
  {
    name: "Hina Farooq",
    role: "Head of Partnerships",
    bio: "Manages relationships with expo centres and industry associations across Pakistan.",
    initials: "HF",
  },
];

const STATS = [
  ["2024", "Founded"],
  ["120+", "Expos hosted"],
  ["3,400+", "Exhibitors"],
  ["85,000+", "Attendees"],
];

function ValueCard({ title, desc, icon }) {
  return (
    <div className="bg-white rounded-xl border border-[#CBD5E8] p-6">
      <div className="w-10 h-10 rounded-lg bg-[#E8F0FE] flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-[#6B9FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {icon}
        </svg>
      </div>
      <h3 className="text-[#0A1628] font-black text-[16px] mb-2">{title}</h3>
      <p className="text-[#64748B] text-[13px] leading-relaxed">{desc}</p>
    </div>
  );
}

export default function About() {
  return (
    <Layout>
      <div className="bg-[#0A1628] pt-[90px] pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-[#6B9FFF]" />
            <span className="text-[#6B9FFF] text-[10.5px] font-semibold tracking-[0.2em] uppercase">Our story</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.6rem] font-black text-white leading-[1.1] mb-4 max-w-xl">
            Pakistan's expo industry needed better infrastructure.
          </h1>
          <p className="text-white/50 text-[14px] leading-relaxed max-w-[500px]">
            Planova was built by people who ran expos manually — spreadsheets, WhatsApp groups, printed booth maps — and decided there had to be a better way.
          </p>
        </div>
      </div>

      <div className="bg-[#112240] px-5 sm:px-8 py-10 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-[1.8rem] font-black text-white leading-none">{value}</div>
              <div className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-white px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-[1.6rem] font-black text-[#0A1628] mb-4">What we're building</h2>
            <p className="text-[#64748B] text-[14px] leading-relaxed mb-4">
              Planova is an end-to-end expo management platform. Organizers publish events, review exhibitor applications, and assign booths on an interactive floor plan. Exhibitors build profiles and manage their participation. Attendees browse, register, and navigate expos from one app.
            </p>
            <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
              We started with trade shows in Karachi, Lahore, and Islamabad — and we're expanding to every major city in Pakistan.
            </p>
            <Link to="/explore-expos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6B9FFF] text-[#0A1628] font-bold text-[13px] hover:bg-[#4A82F5] hover:text-white transition-colors">
              Browse upcoming expos
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#CBD5E8] shadow-md aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=75"
              alt="Expo floor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F4F7FF] px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[1.6rem] font-black text-[#0A1628] mb-2">What we stand for</h2>
          <p className="text-[#64748B] text-[13.5px] mb-10">Three principles behind every decision we make.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <ValueCard
              title="Transparency"
              desc="Every application status, booth assignment, and payment — visible and trackable in real time."
              icon={
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </>
              }
            />
            <ValueCard
              title="Simplicity"
              desc="Managing an expo should not require a team of coordinators. Planova makes it a one-person job."
              icon={<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>}
            />
            <ValueCard
              title="Local first"
              desc="Built for Pakistan's expo ecosystem — cities, industries, and payment methods that matter here."
              icon={
                <>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </>
              }
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[1.6rem] font-black text-[#0A1628] mb-2">The team</h2>
          <p className="text-[#64748B] text-[13.5px] mb-10">Small team, big ambition.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-[#F4F7FF] rounded-xl border border-[#CBD5E8] p-6 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0A1628] flex items-center justify-center">
                  <span className="text-[#6B9FFF] font-black text-[14px]">{member.initials}</span>
                </div>
                <div>
                  <h3 className="text-[#0A1628] font-black text-[15px]">{member.name}</h3>
                  <p className="text-[#6B9FFF] text-[12px] font-semibold">{member.role}</p>
                </div>
                <p className="text-[#64748B] text-[12.5px] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A1628] px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-[1.5rem] font-black text-white mb-2">Ready to use Planova?</h2>
            <p className="text-white/40 text-[13.5px]">Whether you're organizing, exhibiting, or attending — start here.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/register"
              className="px-6 py-3 rounded-lg bg-[#6B9FFF] text-[#0A1628] font-bold text-[13px] hover:bg-[#4A82F5] hover:text-white transition-colors min-h-[44px] flex items-center">
              Get Started
            </Link>
            <Link to="/explore-expos"
              className="px-6 py-3 rounded-lg border border-white/15 text-white/60 font-medium text-[13px] hover:border-white/30 hover:text-white transition-colors min-h-[44px] flex items-center">
              Browse Expos
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
