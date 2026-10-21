import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { EXHIBITORS } from "../../data.js";

const CATEGORIES = ["All", "Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food"];

const categoryBadge = {
  Technology: "bg-accent-light text-navy",
  Healthcare: "bg-status-open-bg text-status-open",
  Energy: "bg-[#FEF3C7] text-[#92620A]",
  Agriculture: "bg-status-open-bg text-status-open",
  Fashion: "bg-[#FCE7F3] text-[#9D174D]",
  Food: "bg-[#FEF3C7] text-[#92620A]",
};

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
              <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="7" width="6" height="10" rx="1" />
                  <rect x="9" y="3" width="6" height="14" rx="1" />
                  <rect x="16" y="9" width="6" height="8" rx="1" />
                </svg>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryBadge[ex.category]}`}>
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
  return (
    <article className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="w-11 h-11 rounded-lg bg-ice flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="7" width="6" height="10" rx="1" />
            <rect x="9" y="3" width="6" height="14" rx="1" />
            <rect x="16" y="9" width="6" height="8" rx="1" />
          </svg>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryBadge[ex.category]}`}>
          {ex.category}
        </span>
      </div>

      <div>
        <h3 className="text-dark font-black text-[15px] mb-1">{ex.company}</h3>
        <p className="text-body text-[12.5px] leading-relaxed">{ex.description}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-[12px] text-body">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Booth {ex.booth}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {ex.employees} employees
        </span>
      </div>

      <div className="pt-2 border-t border-border-card">
        <p className="text-[11.5px] text-body">
          Exhibiting at: <span className="text-dark font-semibold">{ex.expo}</span>
        </p>
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onView(ex)}
          className="flex-1 text-center text-[12.5px] font-bold py-2.5 rounded-lg bg-accent text-navy hover:bg-accent-hover hover:text-white transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={() => onView(ex)}
          className="px-4 py-2.5 rounded-lg border border-border text-[12.5px] text-body hover:border-accent hover:text-accent transition-colors"
        >
          Website
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
