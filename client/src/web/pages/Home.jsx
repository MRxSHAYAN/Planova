import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import heroImg from "./../assets/Hero.jpg";

const HERO_IMAGE = heroImg;

const EXPOS = [
  {
    id: 1,
    title: "Karachi Technology Expo 2026",
    date: "Nov 15–17, 2026",
    location: "Expo Centre, Karachi",
    category: "Technology",
    exhibitors: 142,
    attendees: 4800,
    status: "Open",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=75",
  },
  {
    id: 2,
    title: "Pakistan Health & Pharma Summit",
    date: "Dec 3–5, 2026",
    location: "Convention Centre, Lahore",
    category: "Healthcare",
    exhibitors: 87,
    attendees: 2600,
    status: "Open",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=75",
  },
  {
    id: 3,
    title: "Green Energy & Sustainability Expo",
    date: "Jan 20–22, 2027",
    location: "Jinnah Convention, Islamabad",
    category: "Energy",
    exhibitors: 65,
    attendees: 1900,
    status: "Coming Soon",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=700&q=75",
  },
];

const FILTERS = ["All", "Technology", "Healthcare", "Energy"];

/* ── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="Event venue"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, color-mix(in srgb, var(--color-navy) 25%, transparent) 40%, color-mix(in srgb, var(--color-navy) 15%, transparent) 60%, transparent 75%)" }} />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to top, var(--color-navy) 0%, color-mix(in srgb, var(--color-navy) 93%, transparent) 14%, color-mix(in srgb, var(--color-navy) 40%, transparent) 35%, transparent 58%)" }} />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(105deg, color-mix(in srgb, var(--color-navy) 80%, transparent) 0%, color-mix(in srgb, var(--color-navy) 25%, transparent) 38%, transparent 56%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-12 pt-[100px]">
        <div className="max-w-[530px]">

          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-px bg-accent" />
            <span className="text-accent text-[11px] font-semibold tracking-[0.2em] uppercase">
              Expo Management Platform
            </span>
          </div>

          <h1 className="text-[2rem] sm:text-[2.5rem] lg:text-[2.9rem] font-black text-white leading-[1.1] mb-3">
            Pakistan's expos,
            <br />
            one platform.
          </h1>

          <p className="text-white/60 text-[14px] leading-relaxed mb-7 max-w-[420px]">
            Organizers, exhibitors, and attendees — managed end to end.
            Booths, schedules, applications, and live analytics.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-10">
            <Link to="/explore-expos"
              className="px-5 py-2.5 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors min-h-[44px] flex items-center">
              Browse Expos
            </Link>
            <Link to="/register"
              className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-white/70 border border-white/25 hover:border-white/50 hover:text-white transition-colors min-h-[44px] flex items-center">
              Register Free
            </Link>
          </div>

          {/* Search bar */}
          <div className="mb-10 max-w-[440px]">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <svg className="w-4 h-4 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by city or industry…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/35 outline-none"
              />
              <button className="text-[12px] font-bold text-accent hover:text-white transition-colors shrink-0">
                Search
              </button>
            </div>
          </div>

          <div className="flex gap-6 sm:gap-10 pt-5 border-t border-white/10 px-1">
            {[["120+", "Expos hosted"], ["3,400+", "Exhibitors"], ["85,000+", "Attendees"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-[1.25rem] sm:text-[1.3rem] font-black text-white leading-none">{n}</div>
                <div className="text-[10px] sm:text-[11px] text-white/30 mt-0.5 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Expo card ─────────────────────────────────────────────────────────── */
function ExpoCard({ expo }) {
  const badge = {
    Technology: "bg-accent-light text-navy",
    Healthcare:  "bg-status-open-bg text-status-open",
    Energy:      "bg-[#FEF3C7] text-[#92620A]",
  };

  return (
    <article className="group bg-surface rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-[300px] sm:min-w-0">
      <div className="relative h-[155px] overflow-hidden bg-ice">
        <img src={expo.image} alt={expo.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/35 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badge[expo.category] || "bg-accent-light text-navy"}`}>
            {expo.category}
          </span>
          {expo.status === "Open" && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-status-open-bg text-status-open">Open</span>
          )}
          {expo.status === "Coming Soon" && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20">Soon</span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-dark font-bold text-[14px] leading-snug mb-3">{expo.title}</h3>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-[12.5px] text-body">
            <svg className="w-3.5 h-3.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {expo.date}
          </div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-body">
            <svg className="w-3.5 h-3.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/><circle cx="12" cy="9" r="2.5"/>
            </svg>
            {expo.location}
          </div>
        </div>
        <div className="mt-auto pt-3 border-t border-border-card flex items-center justify-between">
          <div className="flex gap-3 text-[11.5px] text-body">
            <span><strong className="text-dark font-semibold">{expo.exhibitors}</strong> exhibitors</span>
            <span><strong className="text-dark font-semibold">{expo.attendees.toLocaleString()}</strong> attending</span>
          </div>
          <div className="flex items-center gap-2">
            <button title="Add to calendar" className="text-body hover:text-accent transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>
              </svg>
            </button>
            <Link to={`/expo/${expo.id}`} className="text-[12px] font-bold text-accent hover:text-accent-hover transition-colors">
              View →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Featured Expos ────────────────────────────────────────────────────── */
function FeaturedExpos() {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? EXPOS
    : EXPOS.filter((e) => e.category === active);

  return (
    <section className="bg-page" style={{ padding: "4.5rem 0" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-[1.65rem] font-black text-dark">Upcoming expos</h2>
            <p className="text-body text-[13.5px] mt-1">Pakistan's top trade shows and exhibitions.</p>
          </div>
          <Link to="/explore-expos"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent border border-border bg-surface px-4 py-2 rounded-lg hover:border-accent/50 transition-colors">
            See all
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="flex gap-2 mb-7 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                active === f
                  ? "bg-navy text-white border-navy"
                  : "bg-surface text-body border-border hover:border-accent hover:text-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => <ExpoCard key={e.id} expo={e} />)}
        </div>

        <div className="md:hidden -mx-5 px-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {filtered.map((e) => (
              <div key={e.id} className="snap-start w-[82vw] max-w-[320px]">
                <ExpoCard expo={e} />
              </div>
            ))}
            <div className="w-4 shrink-0" />
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <Link to="/explore-expos"
            className="w-full inline-flex justify-center text-[13px] font-semibold text-accent border border-border bg-surface px-4 py-2.5 rounded-lg">
            See all expos →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ──────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "1", title: "Create or discover an expo", desc: "Organizers publish events with full details — venue, booth layout, and agenda. Exhibitors and attendees can browse and register." },
    { n: "2", title: "Apply and get approved", desc: "Companies apply to exhibit, submit documents, and receive approval notifications. Every status update happens inside the platform." },
    { n: "3", title: "Pick a booth, plan your visit", desc: "Approved exhibitors choose a booth on the interactive floor plan. Attendees register for sessions and bookmark what matters." },
    { n: "4", title: "Show up and connect", desc: "Everyone arrives with their schedule, booth map, and contacts ready. Organizers track attendance and analytics from one dashboard." },
  ];

  return (
    <section className="bg-surface" style={{ padding: "4.5rem 0" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="text-[1.65rem] font-black text-dark mb-3">How it works</h2>
            <p className="text-body text-[14px] leading-relaxed max-w-sm mb-8">
              From the organizer's first setup to an attendee's last session.
            </p>

            <div className="space-y-5">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-navy flex items-center justify-center text-[12px] font-black text-accent">
                    {s.n}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-dark text-[14px] mb-0.5">{s.title}</h3>
                    <p className="text-[12.5px] text-body leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-border aspect-[4/3] shadow-md lg:sticky lg:top-24">
            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=75"
              alt="Exhibition floor plan" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-surface rounded-lg px-4 py-2.5 border border-border shadow-sm">
              <div className="text-[10.5px] text-body mb-0.5">Interactive floor plan</div>
              <div className="text-[13.5px] font-black text-dark">Booth B-12 — Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Who Uses Planova ──────────────────────────────────────────────────── */
function ForWho() {
  return (
    <section className="bg-ice" style={{ padding: "4.5rem 0" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-9">
          <h2 className="text-[1.65rem] font-black text-dark">Who uses Planova</h2>
          <p className="text-body text-[13.5px] mt-1 max-w-md">
            Three roles, one platform. Each gets a dedicated workspace built for their workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Organizer — dark primary card */}
          <div className="bg-navy rounded-xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 className="text-white font-black text-[17px] mb-2">Organizers</h3>
            <p className="text-white/45 text-[12.5px] leading-relaxed flex-1">
              Publish expos, review applications, assign booths on the floor planner, manage sessions, and watch analytics live.
            </p>
            <Link to="/register?role=organizer"
              className="mt-6 inline-flex items-center justify-center text-[12.5px] font-bold py-3 px-5 rounded-lg bg-accent text-navy hover:bg-accent-hover hover:text-white transition-colors min-h-[44px]">
              Start organizing →
            </Link>
          </div>

          {/* Exhibitor + Attendee */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Exhibitors",
                desc: "Build a company profile, apply to expos, choose your booth, and list what you're showcasing. All statuses tracked in one place.",
                cta: "Apply as exhibitor →",
                href: "/register?role=exhibitor",
                icon: <><rect x="2" y="7" width="6" height="10" rx="1"/><rect x="9" y="3" width="6" height="14" rx="1"/><rect x="16" y="9" width="6" height="8" rx="1"/></>,
              },
              {
                title: "Attendees",
                desc: "Register for expos, browse exhibitors, bookmark sessions, and navigate the venue with the live floor map on the day.",
                cta: "Register to attend →",
                href: "/register?role=attendee",
                icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
              },
            ].map((role) => (
              <div key={role.title} className="bg-surface rounded-xl border border-border p-6 flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {role.icon}
                  </svg>
                </div>
                <h3 className="text-dark font-black text-[17px] mb-2">{role.title}</h3>
                <p className="text-body text-[12.5px] leading-relaxed flex-1">{role.desc}</p>
                <Link to={role.href}
                  className="mt-6 inline-flex items-center justify-center text-[12.5px] font-bold py-3 px-5 rounded-lg border border-border text-dark hover:bg-ice hover:border-accent/50 transition-colors min-h-[44px]">
                  {role.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Newsletter block ──────────────────────────────────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <section className="bg-page border-t border-border" style={{ padding: "3.5rem 0" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-[1.1rem] font-black text-dark mb-1">Get expo alerts for your city</h3>
            <p className="text-body text-[13px]">We'll notify you when new expos open in Karachi, Lahore, or Islamabad.</p>
          </div>
          {sent ? (
            <div className="shrink-0 text-[13px] font-semibold text-status-open bg-status-open-bg px-5 py-3 rounded-lg">
              ✓ You're subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto shrink-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 sm:w-[220px] px-4 py-2.5 rounded-lg border border-border bg-surface text-[13px] text-dark placeholder-muted outline-none focus:border-accent transition-colors"
              />
              <button type="submit"
                className="px-5 py-2.5 rounded-lg bg-navy text-white text-[13px] font-bold hover:bg-navy-mid transition-colors shrink-0">
                Notify me
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ───────────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="bg-navy-mid" style={{ padding: "4.5rem 0" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-lg">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-5 h-px bg-accent" />
              <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Get started</span>
            </div>
            <h2 className="text-[1.65rem] font-black text-white leading-snug mb-2">Join the next expo.</h2>
            <p className="text-white/40 text-[14px] leading-relaxed">
              Organizer, exhibitor, or attendee — set up in minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link to="/explore-expos"
              className="px-6 py-3 rounded-lg bg-accent text-navy text-[13px] font-bold hover:bg-accent-hover hover:text-white transition-colors min-h-[44px] flex items-center">
              Browse Expos
            </Link>
            <Link to="/register"
              className="px-6 py-3 rounded-lg text-[13px] font-medium text-white/55 border border-white/15 hover:border-white/30 hover:text-white transition-colors min-h-[44px] flex items-center">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sticky mobile bottom bar ──────────────────────────────────────────── */
function MobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-navy/97 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-2.5 safe-area-bottom">
      <Link to="/explore-expos"
        className="flex-1 text-center text-[13px] font-bold py-3 rounded-lg bg-accent text-navy hover:bg-accent-hover hover:text-white transition-colors min-h-[44px] flex items-center justify-center">
        Browse Expos
      </Link>
      <Link to="/login"
        className="flex-1 text-center text-[13px] font-semibold py-3 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors min-h-[44px] flex items-center justify-center">
        Log in
      </Link>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Layout>
        <Hero />
        <FeaturedExpos />
        <HowItWorks />
        <ForWho />
        <Newsletter />
        <CTA />
      </Layout>
      <MobileBar />
      <div className="md:hidden h-[72px]" />
    </>
  );
}
