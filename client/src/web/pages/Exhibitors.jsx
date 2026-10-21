import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { EXHIBITORS } from "../../data.js";

const CATEGORIES = ["All", "Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food"];

const categoryColor = {
  Technology:  { bg: "bg-accent-light",    text: "text-navy" },
  Healthcare:  { bg: "bg-status-open-bg",  text: "text-status-open" },
  Energy:      { bg: "bg-[#FEF3C7]",       text: "text-[#92620A]" },
  Agriculture: { bg: "bg-status-open-bg",  text: "text-status-open" },
  Fashion:     { bg: "bg-[#FCE7F3]",       text: "text-[#9D174D]" },
  Food:        { bg: "bg-[#FEF3C7]",       text: "text-[#92620A]" },
};

// Deterministic avatar color from company name
const avatarPalette = [
  "bg-[#DBEAFE] text-[#1D4ED8]",
  "bg-[#D1FAE5] text-[#065F46]",
  "bg-[#FEF3C7] text-[#92400E]",
  "bg-[#FCE7F3] text-[#9D174D]",
  "bg-[#E0E7FF] text-[#3730A3]",
  "bg-[#FEE2E2] text-[#991B1B]",
];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
}

// Exhibitor detail modal
function ExhibitorModal({ ex, onClose }) {
  if (!ex) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* modal box */}
      <div
        className="relative bg-surface rounded-2xl border border-border shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header bar */}
        <div className="bg-navy px-6 py-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-black text-[13px] ${avatarColor(ex.company)}`}>
                {ex.company.substring(0, 2).toUpperCase()}
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${(categoryColor[ex.category] || categoryColor.Technology).bg} ${(categoryColor[ex.category] || categoryColor.Technology).text}`}>
                {ex.category}
              </span>
            </div>
            <h2 className="text-white font-black text-[20px] leading-tight">{ex.company}</h2>
            <p className="text-white/45 text-[12.5px] mt-0.5">{ex.city}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shrink-0 mt-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="p-6">
          <p className="text-body text-[13px] leading-relaxed mb-5">{ex.description}</p>

          {/* stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-ice rounded-lg px-3 py-2.5 text-center">
              <div className="text-dark font-black text-[15px]">{ex.employees}</div>
              <div className="text-body text-[11px]">Employees</div>
            </div>
            <div className="bg-ice rounded-lg px-3 py-2.5 text-center">
              <div className="text-dark font-black text-[15px]">{ex.founded}</div>
              <div className="text-body text-[11px]">Founded</div>
            </div>
            <div className="bg-ice rounded-lg px-3 py-2.5 text-center">
              <div className="text-dark font-black text-[15px]">{ex.booth}</div>
              <div className="text-body text-[11px]">Booth</div>
            </div>
          </div>

          {/* expo tag */}
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-ice border border-border">
            <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[12.5px] text-body">Exhibiting at: <strong className="text-dark">{ex.expo}</strong></span>
          </div>

          {/* actions */}
          <div className="flex gap-3">
            <a
              href={ex.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3 rounded-xl bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors"
            >
              Visit Website
            </a>
            <Link
              to="/register"
              className="flex-1 text-center py-3 rounded-xl border border-border text-body font-semibold text-[13px] hover:border-accent hover:text-accent transition-colors"
            >
              Register to Meet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exhibitor card
function ExhibitorCard({ ex, onView }) {
  const c = categoryColor[ex.category] || categoryColor.Technology;
  const initials = ex.company.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

  return (
    <article className="group bg-surface rounded-2xl border border-border-card p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black text-[13px] ${avatarColor(ex.company)}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-dark font-bold text-[14.5px] leading-tight truncate group-hover:text-accent transition-colors">{ex.company}</h3>
          <p className="text-[11.5px] text-muted mt-0.5">{ex.city}</p>
        </div>
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${c.bg} ${c.text}`}>
          {ex.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-body text-[12.5px] leading-relaxed line-clamp-2">{ex.description}</p>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-[11.5px] text-muted pt-1">
        <span>{ex.employees} employees</span>
        <span className="text-border">·</span>
        <span>Est. {ex.founded}</span>
        <span className="text-border">·</span>
        <span className="font-mono font-semibold text-dark">Booth {ex.booth}</span>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border-card">
        <p className="text-[11.5px] text-muted mb-3">
          Exhibiting at <span className="text-dark font-semibold">{ex.expo}</span>
        </p>
        <button
          onClick={() => onView(ex)}
          className="w-full text-center text-[12.5px] font-bold py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          View Profile
        </button>
      </div>
    </article>
  );
}

// Page
export default function Exhibitors() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedEx, setSelectedEx] = useState(null);

  const filtered = EXHIBITORS.filter((ex) => {
    const matchSearch =
      ex.company.toLowerCase().includes(search.toLowerCase()) ||
      ex.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || ex.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <Layout>
      <div className="bg-navy pt-[90px] pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-px bg-accent" />
            <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Planova</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.4rem] font-black text-white mb-2">Exhibitor Directory</h1>
          <p className="text-white/45 text-[14px] max-w-md">
            Companies participating across all upcoming expos on Planova.
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
                placeholder="Search companies…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/35 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-page min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-wrap gap-2 mb-6">
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

          <p className="text-[12.5px] text-body mb-6">
            {filtered.length} exhibitor{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((ex) => (
                <ExhibitorCard key={ex.id} ex={ex} onView={setSelectedEx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-body text-[14px]">No exhibitors match your search.</p>
              <button
                onClick={() => { setCategory("All"); setSearch(""); }}
                className="mt-4 text-[13px] font-semibold text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="mt-14 bg-navy rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-[1.1rem] mb-1">Want to exhibit?</h3>
              <p className="text-white/40 text-[13px]">Apply to showcase your company at the next expo.</p>
            </div>
            <Link
              to="/register"
              className="shrink-0 px-6 py-3 rounded-lg bg-accent text-navy font-bold text-[13px] hover:bg-accent-hover hover:text-white transition-colors"
            >
              Apply as Exhibitor →
            </Link>
          </div>
        </div>
      </div>

      {/* exhibitor detail popup */}
      <ExhibitorModal ex={selectedEx} onClose={() => setSelectedEx(null)} />
    </Layout>
  );
}
