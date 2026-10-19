import { useState, useMemo } from "react";
import { Search, X, Bookmark, ExternalLink } from "lucide-react";
import { EXHIBITORS, CATEGORY_COLORS } from "../data/mockData";

const CATS = ["All", "Software", "Fintech", "Cybersecurity", "Smart Cities", "SaaS", "HealthTech", "Cloud", "Energy"];
const EVENT_OPTS = ["All Events", "KTE 2026", "PHPS 2026", "GESE 2027"];

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border shrink-0 transition-all ${active ? "pill-active" : "btn-ghost"}`}
    >
      {children}
    </button>
  );
}

function ExhibitorCard({ exh, onView, onToggleSave }) {
  const c = CATEGORY_COLORS[exh.category] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <div className="dash-card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-[14px] shrink-0"
          style={{ background: exh.color || "#09152E" }}>
          {exh.initials}
        </div>
        <button className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: exh.saved ? "#E5EEFF" : "#F0F3FA" }}
          onClick={() => onToggleSave(exh.id)}
          aria-label={exh.saved ? "Remove bookmark" : "Save"}>
          <Bookmark size={12} style={{ color: exh.saved ? "#3478F6" : "#94A3B8", fill: exh.saved ? "#3478F6" : "none" }} />
        </button>
      </div>

      <div>
        <p className="text-[13.5px] font-bold leading-snug" style={{ color: "#09152E" }}>{exh.company}</p>
        <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>{exh.eventTitle}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
          {exh.category}
        </span>
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F0F3FA", color: "#3E506D" }}>
          {exh.hall} · Booth {exh.booth}
        </span>
      </div>

      <p className="text-[12.5px] leading-relaxed line-clamp-2 flex-1" style={{ color: "#64748B" }}>{exh.description}</p>

      <div className="flex gap-2 mt-auto pt-1">
        <button className="btn-primary flex-1 py-2 text-[12px]" onClick={onView}>View Profile</button>
        <a href={exh.website} target="_blank" rel="noopener noreferrer"
          className="btn-muted w-9 flex items-center justify-center" aria-label="Website">
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

function ProfileModal({ exh, onClose, onToggleSave }) {
  const c = CATEGORY_COLORS[exh.category] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(9,21,46,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="dash-card w-full max-w-[420px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-5 flex items-start gap-4" style={{ borderBottom: "1px solid #F0F3FA" }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-[18px] shrink-0"
            style={{ background: exh.color || "#09152E" }}>
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
          <button className="btn-muted w-7 h-7 flex items-center justify-center" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-relaxed" style={{ color: "#3E506D" }}>{exh.description}</p>
        </div>

        <div className="px-5 py-4 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          <a href={exh.website} target="_blank" rel="noopener noreferrer"
            className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12.5px]">
            <ExternalLink size={13} /> Visit Website
          </a>
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={exh.saved
              ? { background: "#E5EEFF", color: "#3478F6", border: "1px solid #3478F6" }
              : { background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
            onClick={() => onToggleSave(exh.id)}>
            <Bookmark size={13} style={{ fill: exh.saved ? "#3478F6" : "none" }} />
            {exh.saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
    if (category !== "All")          list = list.filter((e) => e.category === category);
    if (eventFilter !== "All Events") list = list.filter((e) => e.eventTitle === eventFilter);
    return list;
  }, [exhibitors, query, category, eventFilter]);

  const toggleSave = (id) => {
    setExhibitors((p) => p.map((e) => e.id === id ? { ...e, saved: !e.saved } : e));
    if (selected?.id === id) setSelected((p) => ({ ...p, saved: !p.saved }));
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <div className="dash-card flex-1 flex items-center gap-2 px-3 py-2.5">
          <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, categories…"
            className="flex-1 text-[13px] outline-none bg-transparent" style={{ color: "#09152E" }} />
          {query && <button onClick={() => setQuery("")}><X size={13} style={{ color: "#94A3B8" }} /></button>}
        </div>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}
          className="dash-card text-[12.5px] outline-none px-3 py-2.5 shrink-0" style={{ color: "#09152E" }}>
          {EVENT_OPTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATS.map((c) => <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Pill>)}
      </div>

      <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
        {filtered.length} exhibitor{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((exh) => (
            <ExhibitorCard key={exh.id} exh={exh} onView={() => setSelected(exh)} onToggleSave={toggleSave} />
          ))}
        </div>
      ) : (
        <div className="dash-card py-16 text-center">
          <Search size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold" style={{ color: "#09152E" }}>No exhibitors found</p>
          <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>Try adjusting your search.</p>
        </div>
      )}

      {selected && <ProfileModal exh={selected} onClose={() => setSelected(null)} onToggleSave={toggleSave} />}
    </div>
  );
}
