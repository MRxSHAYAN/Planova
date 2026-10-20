import { useState } from "react";
import Layout from "../components/Layout";

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
    description:
      "The biggest technology gathering in Karachi. Over 140 exhibitors showcasing the latest in AI, fintech, cybersecurity, and consumer electronics. Attendees get access to keynotes, live product demos, and networking events across three days.",
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
    description:
      "A dedicated summit for healthcare professionals, pharma brands, and medical device companies. Sessions cover public health policy, new drug approvals, hospital management, and mental health awareness.",
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
    description:
      "Pakistan's first large-scale green energy expo. Focus on solar, wind, and hydro innovations from local and international companies. Includes government policy discussions and investor roundtables.",
  },
  {
    id: 4,
    title: "Agri-Tech Pakistan 2026",
    date: "Dec 10–12, 2026",
    location: "Faisalabad Expo Centre",
    category: "Agriculture",
    exhibitors: 54,
    attendees: 1500,
    status: "Open",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=75",
    description:
      "Connecting farmers, agri-tech startups, and agricultural equipment manufacturers. Live field demos, drone showcases, and workshops on precision farming and smart irrigation.",
  },
  {
    id: 5,
    title: "Textile & Fashion Expo Pakistan",
    date: "Feb 5–7, 2027",
    location: "Lahore Expo Centre",
    category: "Fashion",
    exhibitors: 110,
    attendees: 3200,
    status: "Coming Soon",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=75",
    description:
      "A showcase of Pakistan's booming textile industry. Domestic and international buyers meet manufacturers, designers, and fabric innovators. Includes fashion shows and B2B matchmaking sessions.",
  },
  {
    id: 6,
    title: "Pakistan Food & Beverage Expo",
    date: "Mar 1–3, 2027",
    location: "Karachi Expo Centre",
    category: "Food",
    exhibitors: 98,
    attendees: 2900,
    status: "Coming Soon",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=75",
    description:
      "Everything food — from street food brands going national to large FMCG companies launching new products. Cooking competitions, tastings, and retail buyer meetups all under one roof.",
  },
];

const CATEGORIES = ["All", "Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food"];
const STATUSES = ["All", "Open", "Coming Soon"];

const categoryBadge = {
  Technology: "bg-accent-light text-navy",
  Healthcare: "bg-status-open-bg text-status-open",
  Energy: "bg-[#FEF3C7] text-[#92620A]",
  Agriculture: "bg-status-open-bg text-status-open",
  Fashion: "bg-[#FCE7F3] text-[#9D174D]",
  Food: "bg-[#FEF3C7] text-[#92620A]",
};

// Expo detail modal
function ExpoModal({ expo, onClose }) {
  if (!expo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* modal box */}
      <div
        className="relative bg-surface rounded-2xl border border-border shadow-xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={expo.image}
            alt={expo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-navy/60 to-transparent" />

          {/* close btn */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* badges on image */}
          <div className="absolute bottom-3 left-4 flex gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryBadge[expo.category]}`}>
              {expo.category}
            </span>
            {expo.status === "Open" && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-status-open-bg text-status-open">
                Open
              </span>
            )}
            {expo.status === "Coming Soon" && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/25">
                Soon
              </span>
            )}
          </div>
        </div>

        {/* content */}
        <div className="p-5">
          <h2 className="text-dark font-black text-[18px] leading-snug mb-3">{expo.title}</h2>

          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center gap-2 text-[13px] text-body">
              <svg className="w-4 h-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {expo.date}
            </div>
            <div className="flex items-center gap-2 text-[13px] text-body">
              <svg className="w-4 h-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" />
              </svg>
              {expo.location}
            </div>
          </div>

          <p className="text-body text-[13px] leading-relaxed mb-5">{expo.description}</p>

          <div className="flex gap-4 mb-5 text-[12.5px]">
            <div className="flex flex-col items-center bg-ice rounded-lg px-4 py-2.5 flex-1">
              <span className="text-dark font-black text-[18px]">{expo.exhibitors}</span>
              <span className="text-body">Exhibitors</span>
            </div>
            <div className="flex flex-col items-center bg-ice rounded-lg px-4 py-2.5 flex-1">
              <span className="text-dark font-black text-[18px]">{expo.attendees.toLocaleString()}</span>
              <span className="text-body">Attendees</span>
            </div>
          </div>

          <a
            href="/register?role=attendee"
            className="w-full block text-center py-3 rounded-xl bg-accent text-navy font-bold text-[13.5px] hover:bg-accent-hover hover:text-white transition-colors"
          >
            Register to Attend
          </a>
        </div>
      </div>
    </div>
  );
}

// Expo card
function ExpoCard({ expo, onView }) {
  return (
    <article className="group bg-surface rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-155px overflow-hidden bg-ice">
        <img
          src={expo.image}
          alt={expo.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy/35 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryBadge[expo.category]}`}>
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
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {expo.date}
          </div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-body">
            <svg className="w-3.5 h-3.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" />
            </svg>
            {expo.location}
          </div>
        </div>
        <div className="mt-auto pt-3 border-t border-border-card flex items-center justify-between">
          <div className="flex gap-3 text-[11.5px] text-body">
            <span><strong className="text-dark font-semibold">{expo.exhibitors}</strong> exhibitors</span>
            <span><strong className="text-dark font-semibold">{expo.attendees.toLocaleString()}</strong> attending</span>
          </div>
          <button
            onClick={() => onView(expo)}
            className="text-[12px] font-bold text-accent hover:text-accent-hover transition-colors"
          >
            View →
          </button>
        </div>
      </div>
    </article>
  );
}

// Page
export default function ExploreExpos() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedExpo, setSelectedExpo] = useState(null);

  const filtered = EXPOS.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || e.category === category;
    const matchStatus = status === "All" || e.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <Layout>
      {/* page header */}
      <div className="bg-navy pt-90px pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-px bg-accent" />
            <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Planova</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.4rem] font-black text-white mb-2">Explore Expos</h1>
          <p className="text-white/45 text-[14px] max-w-md">
            Browse Pakistan's upcoming trade shows, exhibitions, and industry summits.
          </p>

          <div className="mt-6 max-w-480px">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or city…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/35 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-page min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">

          {/* filters */}
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                    category === c
                      ? "bg-navy text-white border-navy"
                      : "bg-surface text-body border-border hover:border-accent hover:text-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                    status === s
                      ? "bg-accent text-navy border-accent"
                      : "bg-surface text-body border-border hover:border-accent hover:text-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[12.5px] text-body mb-6">
            {filtered.length} expo{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((e) => (
                <ExpoCard key={e.id} expo={e} onView={setSelectedExpo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-body text-[14px]">No expos match your filters.</p>
              <button
                onClick={() => { setCategory("All"); setStatus("All"); setSearch(""); }}
                className="mt-4 text-[13px] font-semibold text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* expo detail popup */}
      <ExpoModal expo={selectedExpo} onClose={() => setSelectedExpo(null)} />
    </Layout>
  );
}
