import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import heroImg from "./../assets/Hero.jpg";

const FILTERS = ["All", "Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food"];

const categoryColor = {
  Technology:  { bg: "bg-accent-light",   text: "text-navy" },
  Healthcare:  { bg: "bg-status-open-bg", text: "text-status-open" },
  Energy:      { bg: "bg-[#FEF3C7]",      text: "text-[#92620A]" },
  Agriculture: { bg: "bg-status-open-bg", text: "text-status-open" },
  Fashion:     { bg: "bg-[#FCE7F3]",      text: "text-[#9D174D]" },
  Food:        { bg: "bg-[#FEF3C7]",      text: "text-[#92620A]" },
};

function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <img src={heroImg} alt="Event venue"
        className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(9,21,46,0.6) 0%, rgba(9,21,46,0.1) 40%, rgba(9,21,46,0.15) 60%, rgba(9,21,46,0.95) 100%)" }} />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(100deg, rgba(9,21,46,0.75) 0%, rgba(9,21,46,0.2) 45%, transparent 65%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-14 pt-[100px]">
        <div className="max-w-[520px]">
          <p className="text-accent text-[11px] font-bold tracking-[0.22em] uppercase mb-4">
            Expo Management Platform
          </p>
          <h1 className="text-[2.2rem] sm:text-[2.7rem] lg:text-[3rem] font-black text-white leading-[1.08] mb-4">
            Pakistan's expos,<br />one platform.
          </h1>
          <p className="text-white/55 text-[14.5px] leading-relaxed mb-8 max-w-[400px]">
            Organizers publish events. Exhibitors claim booths. Attendees register and show up. Everything tracked in one place.
          </p>
          <div className="flex flex-wrap gap-3 mb-12">
            <Link to="/explore-expos"
              className="px-6 py-3 rounded-xl bg-accent text-white font-bold text-[13.5px] hover:bg-accent-hover transition-colors">
              Browse Expos
            </Link>
            <Link to="/register"
              className="px-6 py-3 rounded-xl text-[13.5px] font-semibold text-white/65 border border-white/20 hover:border-white/40 hover:text-white transition-colors">
              Create account
            </Link>
          </div>
          <div className="flex gap-8 pt-5 border-t border-white/10">
            {[["120+", "Expos hosted"], ["3,400+", "Exhibitors"], ["85,000+", "Attendees"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-[1.3rem] font-black text-white leading-none">{n}</div>
                <div className="text-[10.5px] text-white/30 mt-0.5 tracking-wide">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpoCard({ expo }) {
  const c = categoryColor[expo.category] || categoryColor.Technology;
  return (
    <article className="group bg-surface rounded-2xl border border-border-card overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-[290px] sm:min-w-0">
      <div className="relative h-[158px] overflow-hidden bg-ice shrink-0">
        <img src={expo.image} alt={expo.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09152E]/55 to-transparent" />
        <div className="absolute top-3 right-3">
          {expo.status === "Published"
            ? <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-status-open">Open</span>
            : <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm">Coming soon</span>
          }
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${c.bg} ${c.text}`}>{expo.category}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-dark font-bold text-[14.5px] leading-snug mb-2.5 group-hover:text-accent transition-colors">{expo.title}</h3>
        <p className="text-[12px] text-muted mb-1">{expo.date}</p>
        <p className="text-[12px] text-muted mb-4 truncate">{expo.venue}</p>
        <div className="mt-auto pt-3 border-t border-border-card flex items-center justify-between">
          <div className="text-[11.5px] text-muted">
            <span className="text-dark font-semibold">{expo.exhibitors}</span> exhibitors  
            <span className="text-dark font-semibold">{expo.attendees.toLocaleString()}</span> attending
          </div>
          <Link to="/explore-expos" className="text-[12px] font-bold text-accent hover:text-accent-hover transition-colors shrink-0 ml-2">
            View 
          </Link>
        </div>
      </div>
    </article>
  );
}

function FeaturedExpos() {
  const [expos, setExpos] = useState([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    fetch("/api/expos")
      .then(r => r.json())
      .then(data => setExpos(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Shape DB expo for ExpoCard
  function shape(e) {
    return {
      ...e,
      id:         e._id,
      date:       e.dateStart ? new Date(e.dateStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      venue:      e.venue || e.city,
      exhibitors: 0,
      attendees:  0,
      status:     e.status === "published" ? "Published" : "Draft",
    };
  }

  const shaped = expos.map(shape);
  const filtered = active === "All" ? shaped : shaped.filter(e => e.category === active);

  return (
    <section className="bg-page py-18">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[1.7rem] font-black text-dark">Upcoming expos</h2>
            <p className="text-body text-[13.5px] mt-1">Pakistan's top trade shows and exhibitions.</p>
          </div>
          <Link to="/explore-expos"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-accent border border-border bg-surface px-4 py-2 rounded-xl hover:border-accent/40 transition-colors">
            See all 
          </Link>
        </div>

        <div className="flex gap-2 mb-7 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
                active === f
                  ? "bg-navy text-white border-navy"
                  : "bg-surface text-body border-border hover:border-accent hover:text-accent"
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(e => <ExpoCard key={e._id || e.id} expo={e} />)}
        </div>

        <div className="md:hidden -mx-5 px-5 overflow-x-auto scroll-smooth scrollbar-hide">
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {filtered.map(e => (
              <div key={e._id || e.id} className="w-[82vw] max-w-[310px]">
                <ExpoCard expo={e} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <Link to="/explore-expos" className="w-full flex justify-center text-[13px] font-semibold text-accent border border-border bg-surface px-4 py-3 rounded-xl">
            See all expos 
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-surface py-18">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden border border-border shadow-lg aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=75"
              alt="Exhibition hall"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09152E]/50 to-transparent" />
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 border border-border shadow-sm">
              <p className="text-[10.5px] text-muted mb-0.5">Interactive floor plan</p>
              <p className="text-[13px] font-black text-dark">Booth B-12  Available</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-[1.65rem] font-black text-dark mb-2">From first post to final session</h2>
            <p className="text-body text-[14px] mb-9 max-w-sm">
              Four steps that take an expo from an idea to a venue full of people.
            </p>
            <div className="space-y-6">
              {[
                { n: "01", title: "Publish the expo", desc: "Set dates, venue, categories, and booth capacity. Live on the platform in minutes." },
                { n: "02", title: "Review applications", desc: "Companies apply to exhibit. You approve, reject, or request more info from one screen." },
                { n: "03", title: "Assign booths", desc: "Approved exhibitors get placed on the floor plan. The platform prevents double-booking." },
                { n: "04", title: "Everyone shows up ready", desc: "Attendees have their schedule. Exhibitors know their booth. Organizers track it live." },
              ].map(s => (
                <div key={s.n} className="flex gap-5">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                    <span className="text-[11px] font-black text-accent">{s.n}</span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-bold text-dark text-[14.5px] mb-0.5">{s.title}</h3>
                    <p className="text-[13px] text-body leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ForWho() {
  return (
    <section className="bg-page py-18">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-[1.7rem] font-black text-dark mb-1.5">Three roles, one platform</h2>
        <p className="text-body text-[13.5px] mb-10 max-w-md">
          Each role gets its own workspace. No one sees what they don't need.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-navy rounded-2xl p-7 flex flex-col">
            <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center mb-5">
              <svg className="w-4.5 h-4.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-accent text-[11px] font-bold tracking-[0.15em] uppercase mb-2">Organizers</p>
            <h3 className="text-white font-black text-[18px] mb-3 leading-tight">Run the whole show from one dashboard</h3>
            <p className="text-white/40 text-[13px] leading-relaxed flex-1">
              Publish expos, review exhibitor applications, fill the floor plan, manage sessions, watch live analytics.
            </p>
            <Link to="/register" className="mt-7 inline-flex items-center justify-center text-[13px] font-bold py-3 px-5 rounded-xl bg-accent text-navy hover:bg-accent-hover hover:text-white transition-colors">
              Start organizing 
            </Link>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {[
              {
                role: "Exhibitors",
                sub: "Apply, get a booth, manage your presence",
                desc: "Build a company profile, apply to expos, pick your booth on the floor plan, and list what you're showcasing.",
                cta: "Apply as exhibitor ",
              },
              {
                role: "Attendees",
                sub: "Register, browse, and plan your visit",
                desc: "Register for expos, explore who's exhibiting, bookmark sessions you want to attend, and navigate the venue on the day.",
                cta: "Register to attend ",
              },
            ].map(r => (
              <div key={r.role} className="bg-surface rounded-2xl border border-border-card p-7 flex flex-col">
                <p className="text-accent text-[11px] font-bold tracking-[0.15em] uppercase mb-2">{r.role}</p>
                <h3 className="text-dark font-black text-[16px] mb-3 leading-tight">{r.sub}</h3>
                <p className="text-body text-[13px] leading-relaxed flex-1">{r.desc}</p>
                <Link to="/register" className="mt-7 inline-flex items-center justify-center text-[13px] font-bold py-3 px-5 rounded-xl border border-border text-dark hover:bg-ice hover:border-accent/30 transition-colors">
                  {r.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.message || "Something went wrong"); setStatus("error"); return; }
      setStatus("done");
    } catch {
      setMsg("Something went wrong");
      setStatus("error");
    }
  }

  return (
    <section className="bg-navy-mid border-t border-white/[0.04] py-14">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7">
        <div>
          <h3 className="text-[1.05rem] font-black text-white mb-1">Get expo alerts for your city</h3>
          <p className="text-white/35 text-[13px]">New expos in Karachi, Lahore, or Islamabad  straight to your inbox.</p>
        </div>
        {status === "done" ? (
          <div className="shrink-0 text-[13px] font-semibold text-status-open bg-status-open-bg px-5 py-3 rounded-xl">
            Subscribed
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input type="email" required value={email}
                onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="your@email.com"
                className="flex-1 sm:w-[220px] px-4 py-2.5 rounded-xl border border-white/15 bg-white/8 text-[13px] text-white placeholder-white/30 outline-none focus:border-accent/50 transition-colors" />
              <button type="submit" disabled={status === "loading"}
                className="px-5 py-2.5 rounded-xl bg-accent text-navy text-[13px] font-bold hover:bg-accent-hover hover:text-white transition-colors shrink-0 disabled:opacity-60">
                {status === "loading" ? "..." : "Notify me"}
              </button>
            </form>
            {status === "error" && (
              <p className="text-[12px]" style={{ color: "#FCA5A5" }}>{msg}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-navy py-18">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-lg">
          <h2 className="text-[1.8rem] font-black text-white leading-snug mb-2">Ready to join?</h2>
          <p className="text-white/35 text-[14px] leading-relaxed">
            Organizer, exhibitor, or attendee  takes five minutes to set up.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link to="/explore-expos"
            className="px-6 py-3 rounded-xl bg-accent text-navy text-[13.5px] font-bold hover:bg-accent-hover hover:text-white transition-colors">
            Browse Expos
          </Link>
          <Link to="/register"
            className="px-6 py-3 rounded-xl text-[13.5px] font-medium text-white/50 border border-white/15 hover:border-white/30 hover:text-white transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}

function MobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-navy/97 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-2.5">
      <Link to="/explore-expos"
        className="flex-1 text-center text-[13px] font-bold py-3 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors flex items-center justify-center">
        Browse Expos
      </Link>
      <Link to="/login"
        className="flex-1 text-center text-[13px] font-semibold py-3 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center">
        Log in
      </Link>
    </div>
  );
}

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
