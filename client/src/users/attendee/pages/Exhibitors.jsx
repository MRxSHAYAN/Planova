import { useState, useEffect, useMemo } from "react";
import { Search, X, ExternalLink, Loader2 } from "lucide-react";

const CAT_COLORS = {
  Technology:  { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:  { bg: "#DDF7E7", text: "#16804A" },
  Energy:      { bg: "#FEF3C7", text: "#92620A" },
  Agriculture: { bg: "#ECFDF5", text: "#065F46" },
  Fashion:     { bg: "#FCE7F3", text: "#9D174D" },
  Food:        { bg: "#FEF3C7", text: "#92620A" },
};

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

const COLORS = ["#3478F6", "#16804A", "#946200", "#6D28D9", "#DC2626", "#0891B2"];

function ExhibitorCard({ exh, onView }) {
  const c = CAT_COLORS[exh.category] || { bg: "#EEF1F8", text: "#3E506D" };
  const color = COLORS[(exh.company?.charCodeAt(0) || 0) % COLORS.length];

  return (
    <div className="dash-card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-[14px] shrink-0"
          style={{ background: color }}>
          {getInitials(exh.company)}
        </div>
      </div>

      <div>
        <p className="text-[13.5px] font-bold leading-snug" style={{ color: "#09152E" }}>{exh.company}</p>
        <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>{exh.event?.title || "—"}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
          {exh.category}
        </span>
        {exh.booth && (
          <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F0F3FA", color: "#3E506D" }}>
            Booth {exh.booth}
          </span>
        )}
      </div>

      <p className="text-[12.5px] leading-relaxed line-clamp-2 flex-1" style={{ color: "#64748B" }}>
        {exh.description}
      </p>

      <div className="flex gap-2 mt-auto pt-1">
        <button className="btn-primary flex-1 py-2 text-[12px]" onClick={onView}>View Profile</button>
      </div>
    </div>
  );
}

function ProfileModal({ exh, onClose }) {
  const c = CAT_COLORS[exh.category] || { bg: "#EEF1F8", text: "#3E506D" };
  const color = COLORS[(exh.company?.charCodeAt(0) || 0) % COLORS.length];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(9,21,46,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="dash-card w-full max-w-[420px] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-5 flex items-start gap-4" style={{ borderBottom: "1px solid #F0F3FA" }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-[18px] shrink-0"
            style={{ background: color }}>
            {getInitials(exh.company)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-black" style={{ color: "#09152E" }}>{exh.company}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "#94A3B8" }}>{exh.event?.title || "—"}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>{exh.category}</span>
              {exh.booth && (
                <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F0F3FA", color: "#3E506D" }}>
                  Booth {exh.booth}
                </span>
              )}
            </div>
          </div>
          <button className="btn-muted w-7 h-7 flex items-center justify-center" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-relaxed" style={{ color: "#3E506D" }}>{exh.description}</p>
        </div>

        <div className="px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]" style={{ background: "#FAFBFF", borderTop: "1px solid #F0F3FA" }}>
          {[
            ["Contact",  exh.contact],
            ["Email",    exh.email],
            ["Phone",    exh.phone],
            ["City",     exh.city],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>{label}</p>
              <p className="text-[12.5px] font-medium mt-0.5" style={{ color: val ? "#09152E" : "#B0BCC8" }}>{val || "—"}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          <button className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12.5px]" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExhibitorsPage() {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [query,      setQuery]      = useState("");
  const [category,   setCategory]   = useState("All");
  const [selected,   setSelected]   = useState(null);

  useEffect(() => {
    fetch("/api/applications/approved")
      .then(r => r.json())
      .then(data => setExhibitors(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(exhibitors.map(e => e.category).filter(Boolean))];

  const filtered = useMemo(() => {
    let list = exhibitors;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e => e.company?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q));
    }
    if (category !== "All") list = list.filter(e => e.category === category);
    return list;
  }, [exhibitors, query, category]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <div className="dash-card flex-1 flex items-center gap-2 px-3 py-2.5">
          <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search companies, categories..."
            className="flex-1 text-[13px] outline-none bg-transparent" style={{ color: "#09152E" }} />
          {query && <button onClick={() => setQuery("")}><X size={13} style={{ color: "#94A3B8" }} /></button>}
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border shrink-0 transition-all ${category === c ? "pill-active" : "btn-ghost"}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
        {filtered.length} exhibitor{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(exh => (
            <ExhibitorCard key={exh._id} exh={exh} onView={() => setSelected(exh)} />
          ))}
        </div>
      ) : (
        <div className="dash-card py-16 text-center">
          <Search size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold" style={{ color: "#09152E" }}>No exhibitors found</p>
          <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>
            {exhibitors.length === 0 ? "No approved exhibitors yet." : "Try adjusting your search."}
          </p>
        </div>
      )}

      {selected && <ProfileModal exh={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
