import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const TEAM = [
  { name: "Arham Siddiqui", role: "Founder & CEO",         bio: "Ran two national tech expos manually. Built Planova so nobody else has to.", initials: "AS" },
  { name: "Zara Malik",     role: "Head of Product",       bio: "Previously led product at a Lahore B2B SaaS startup. Focused on reducing friction for exhibitors.", initials: "ZM" },
  { name: "Bilal Raza",     role: "Lead Engineer",         bio: "Full-stack developer, 8 years building scalable platforms across MENA.", initials: "BR" },
  { name: "Hina Farooq",   role: "Head of Partnerships",  bio: "Manages relationships with expo centres and industry associations across Pakistan.", initials: "HF" },
];

const avatarColors = [
  "bg-[#DBEAFE] text-[#1D4ED8]",
  "bg-[#D1FAE5] text-[#065F46]",
  "bg-[#FEF3C7] text-[#92400E]",
  "bg-[#E0E7FF] text-[#3730A3]",
];

export default function About() {
  return (
    <Layout>
      {/* ── Header ── */}
      <div className="bg-navy pt-[90px] pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto max-w-2xl">
          <p className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Our story</p>
          <h1 className="text-[2rem] sm:text-[2.6rem] font-black text-white leading-[1.1] mb-4">
            Pakistan's expo industry needed better infrastructure.
          </h1>
          <p className="text-white/45 text-[14.5px] leading-relaxed max-w-[500px]">
            Planova was built by people who ran expos on spreadsheets and WhatsApp groups, and decided there had to be a better way.
          </p>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="bg-navy-mid border-y border-white/[0.05] px-5 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-10">
          {[["2024", "Founded"], ["120+", "Expos hosted"], ["3,400+", "Exhibitors"], ["85,000+", "Attendees"]].map(([v, l]) => (
            <div key={l}>
              <div className="text-[1.9rem] font-black text-white leading-none">{v}</div>
              <div className="text-[11px] text-white/30 mt-1 tracking-wide">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── What we're building ── */}
      <section className="bg-surface px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[1.6rem] font-black text-dark mb-4">What we're building</h2>
            <p className="text-body text-[14px] leading-relaxed mb-4">
              Planova is an end-to-end expo management platform. Organizers publish events, review exhibitor applications, and assign booths on an interactive floor plan. Exhibitors build profiles and manage their participation. Attendees browse, register, and navigate expos from one account.
            </p>
            <p className="text-body text-[14px] leading-relaxed mb-7">
              We started with trade shows in Karachi, Lahore, and Islamabad — expanding to every major city in Pakistan.
            </p>
            <Link to="/explore-expos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-[13.5px] hover:bg-accent-hover transition-colors">
              Browse upcoming expos →
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border shadow-md aspect-[4/3]">
            <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=75"
              alt="Expo floor" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── Values — horizontal list, not cards ── */}
      <section className="bg-page px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[1.6rem] font-black text-dark mb-2">What we stand for</h2>
          <p className="text-body text-[13.5px] mb-12">Three principles behind every decision we make.</p>

          <div className="grid sm:grid-cols-3 gap-x-12 gap-y-10">
            {[
              { title: "Transparency", desc: "Every application status, booth assignment, and update — visible and trackable in real time by everyone it affects." },
              { title: "Simplicity",   desc: "Managing an expo should not require a team of coordinators. Planova makes it a one-person job." },
              { title: "Local first",  desc: "Built for Pakistan's expo ecosystem — cities, industries, and payment methods that matter here, not generic SaaS fluff." },
            ].map((v, i) => (
              <div key={v.title}>
                <span className="text-[11px] font-black text-accent tracking-[0.15em] uppercase">0{i + 1}</span>
                <h3 className="text-dark font-black text-[17px] mt-2 mb-3">{v.title}</h3>
                <p className="text-body text-[13.5px] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team — no cards, just a grid ── */}
      <section className="bg-surface px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[1.6rem] font-black text-dark mb-1">The team</h2>
          <p className="text-body text-[13.5px] mb-12">Small team. Big ambition.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((m, i) => (
              <div key={m.name} className="flex flex-col gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[15px] ${avatarColors[i % avatarColors.length]}`}>
                  {m.initials}
                </div>
                <div>
                  <h3 className="text-dark font-black text-[15px]">{m.name}</h3>
                  <p className="text-accent text-[12px] font-semibold mt-0.5">{m.role}</p>
                </div>
                <p className="text-body text-[13px] leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-[1.5rem] font-black text-white mb-2">Ready to use Planova?</h2>
            <p className="text-white/35 text-[13.5px]">Whether you're organizing, exhibiting, or attending — start here.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/register"
              className="px-6 py-3 rounded-xl bg-accent text-white font-bold text-[13px] hover:bg-accent-hover transition-colors">
              Get Started
            </Link>
            <Link to="/explore-expos"
              className="px-6 py-3 rounded-xl border border-white/15 text-white/55 font-medium text-[13px] hover:border-white/30 hover:text-white transition-colors">
              Browse Expos
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
