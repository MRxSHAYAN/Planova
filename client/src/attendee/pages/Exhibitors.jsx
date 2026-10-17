import { useState, useMemo } from "react";
import { Search, X, Bookmark, ExternalLink } from "lucide-react";
import { EXHIBITORS, CATEGORY_COLORS } from "../data/mockData";

const CATS         = ["All", "Software", "Fintech", "Cybersecurity", "Smart Cities", "SaaS", "HealthTech", "Cloud", "Energy"];
const EVENT_OPTS   = ["All Events", "KTE 2026", "PHPS 2026", "GESE 2027"];

/* ── Exhibitor card ──────────────────────────────────────────── */
function ExhibitorCard({ exh, onView, onToggleSave }) {
  const c = CATEGORY_COLORS[exh.category] || { bg: "#EEF1F8", text: "#3E506D" };

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]"
      style={{ background: "#fff", border: "1px solid #E8EEF8" }}
    >
      {/* Logo + save */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-[14px] shrink-0"
          style={{ background: exh.color || "#09152E" }}
        >
          {exh.initials}
        </div>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: exh.saved ? "#E5EEFF" : "#F0F3FA" }}
          onClick={() => onToggleSave(exh.id)}
          aria-label={exh.saved ? "Remove bookmark" : "Save"}
        >
          <Bookmark size={12} style={{ color: exh.saved ? "#3478F6" : "#94A3B8", fill: exh.saved ? "#3478F6" : "none" }} />
        </button>
      </div>

      {/* Name + event */}
      <div>
        <p className="text-[13.5px] font-bold leading-snug" style={{ color: "#09152E" }}>{exh.company}</p>
        <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>{exh.eventTitle}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
          {exh.category}
        </span>
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F0F3FA", color: "#3E506D" }}>
          {exh.hall} · Booth {exh.booth}
        </span>
      </div>

      {/* Description */}
      <p className="text-[12.5px] leading-relaxed line-clamp-2 flex-1" style={{ color: "#64748B" }}>{exh.description}</p>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button
          className="flex-1 py-2 rounded-lg text-[12px] font-bold text-white transition-colors"
          style={{ background: "#3478F6" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#1D5FE0"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#3478F6"}
          onClick={onView}
        >
          View Profile
        </button>
        <a
          href={exh.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ background: "#F0F3FA", color: "#64748B", border: "1px solid #E8EEF8" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#64748B"; }}
          aria-label="Website"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

/* ── Profile modal ───────────────────────────────────────────── */
function ProfileModal({ exh, onClose, onToggleSave }) {
  const c = CATEGORY_COLORS[exh.category] || { bg: "#EEF1F8", text: "#3E506D" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(9,21,46,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-xl overflow-hidden"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-5 flex items-start gap-4" style={{ borderBottom: "1px solid #F0F3FA" }}>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-[18px] shrink-0"
            style={{ background: exh.color || "#09152E" }}
          >
            {exh.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-black" style={{ color: "#09152E" }}>{exh.company}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "#94A3B8" }}>{exh.eventTitle}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>{exh.category}</span>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F0F3FA", color: "#3E506D" }}>
                {exh.hall} · Booth {exh.booth}
              </span>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#F0F3FA", color: "#64748B" }}
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-relaxed" style={{ color: "#3E506D" }}>{exh.description}</p>
        </div>

        <div className="px-5 py-4 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          <a
            href={exh.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1D5FE0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#3478F6"}
          >
            <ExternalLink size={13} /> Visit Website
          </a>
          <button
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={
              exh.saved
                ? { background: "#E5EEFF", color: "#3478F6", border: "1px solid #3478F6" }
                : { background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }
            }
            onClick={() => onToggleSave(exh.id)}
          >
            <Bookmark size={13} style={{ fill: exh.saved ? "#3478F6" : "none" }} />
            {exh.saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────── */
export default function ExhibitorsPage() {
  const [query,       setQuery]       = useState("");
  const [category,    setCategory]    = useState("All");
  const [eventFilter, setEventFilter] = useState("All Events");
  const [exhibitors,  setExhibitors]  = useState(EXHIBITORS);
  const [selected,    setSelected]    = useState(null);

  const filtered = useMemo(() => {
    let list = exhibitors;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.company.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    if (category !== "All")         list = list.filter((e) => e.category === category);
    if (eventFilter !== "All Events") list = list.filter((e) => e.eventTitle === eventFilter);
    return list;
  }, [exhibitors, query, category, eventFilter]);

  const toggleSave = (id) => {
    setExhibitors((p) => p.map((e) => e.id === id ? { ...e, saved: !e.saved } : e));
    if (selected?.id === id) setSelected((p) => ({ ...p, saved: !p.saved }));
  };

  return (
    <div className="space-y-5">
      {/* Search + event filter */}
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg"
          style={{ background: "#fff", border: "1px solid #E8EEF8" }}
        >
          <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, categories…"
            className="flex-1 text-[13px] outline-none bg-transparent"
            style={{ color: "#09152E" }}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={13} style={{ color: "#94A3B8" }} />
            </button>
          )}
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="text-[12.5px] outline-none rounded-lg px-3 py-2.5 shrink-0"
          style={{ background: "#fff", border: "1px solid #E8EEF8", color: "#09152E" }}
        >
          {EVENT_OPTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold border shrink-0 transition-all"
            style={
              category === c
                ? { background: "#09152E", color: "#fff", borderColor: "#09152E" }
                : { background: "#fff", color: "#3E506D", borderColor: "#E8EEF8" }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
        {filtered.length} exhibitor{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((exh) => (
            <ExhibitorCard
              key={exh.id}
              exh={exh}
              onView={() => setSelected(exh)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <Search size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>No exhibitors found</p>
          <p className="text-[13px]" style={{ color: "#94A3B8" }}>Try adjusting your search.</p>
        </div>
      )}

      {selected && (
        <ProfileModal
          exh={selected}
          onClose={() => setSelected(null)}
          onToggleSave={toggleSave}
        />
      )}
    </div>
  );
}
