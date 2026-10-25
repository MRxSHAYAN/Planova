import { useState, useEffect, useMemo } from "react";
import { Search, X, SlidersHorizontal, MapPin, CalendarDays, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Technology", "Healthcare", "Energy", "Agriculture"];
const CITIES     = ["All Cities", "Karachi", "Lahore", "Islamabad"];

const CATEGORY_COLORS = {
  Technology:  { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:  { bg: "#DDF7E7", text: "#16804A" },
  Energy:      { bg: "#FEF3C7", text: "#92620A" },
  Agriculture: { bg: "#ECFDF5", text: "#065F46" },
  Fashion:     { bg: "#FCE7F3", text: "#9D174D" },
  Food:        { bg: "#FEF3C7", text: "#92620A" },
};

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold border shrink-0 transition-all"
      style={active
        ? { background: "#09152E", color: "#fff", borderColor: "#09152E" }
        : { background: "#fff", color: "#3E506D", borderColor: "#E8EEF8" }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}}>
      {label}
    </button>
  );
}

function ExpoCard({ expo }) {
  const navigate = useNavigate();
  const cat = CATEGORY_COLORS[expo.category] || { bg: "#EEF1F8", text: "#3E506D" };

  return (
    <article className="rounded-xl overflow-hidden flex flex-col group transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="relative h-[145px] overflow-hidden" style={{ background: "#E5EEFF" }}>
        <img src={expo.image} alt={expo.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,21,46,0.3) 0%, transparent 55%)" }} />
        <span className="absolute top-3 left-3 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: cat.bg, color: cat.text }}>{expo.category}</span>
        {!expo.applicationOpen && (
          <span className="absolute top-3 right-3 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(9,21,46,0.75)", color: "#fff" }}>Closed</span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-[13.5px] font-bold leading-snug mb-2 line-clamp-2" style={{ color: "#09152E" }}>{expo.title}</h3>
        <div className="space-y-1.5 mb-3">
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <CalendarDays size={11} style={{ color: "#3478F6", flexShrink: 0 }} />{expo.date}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <MapPin size={11} style={{ color: "#3478F6", flexShrink: 0 }} />{expo.location}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#94A3B8" }}>
            <Users size={11} style={{ flexShrink: 0 }} />
            {expo.attendees.toLocaleString()} attendees · {expo.availableBooths} booths left
          </p>
        </div>
        {expo.applicationOpen && (
          <p className="text-[11px] mb-3" style={{ color: "#D97706" }}>
            ⏰ Application deadline: {expo.applicationDeadline}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          <span className="text-[11.5px]" style={{ color: "#94A3B8" }}>
            From PKR {expo.boothPriceFrom?.toLocaleString()}
          </span>
          <div className="flex gap-2">
            {expo.applicationOpen ? (
              <button
                onClick={() => navigate("/users/dashboard/exhibitor/applications")}
                className="text-[12px] font-bold px-3 py-1.5 rounded-lg text-white transition-colors"
                style={{ background: "#3478F6" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
                Apply
              </button>
            ) : (
              <span className="text-[11.5px] font-medium px-3 py-1.5 rounded-lg"
                style={{ background: "#F1F5F9", color: "#94A3B8" }}>Closed</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ExploreExpos() {
  const [expos,  setExpos]  = useState([]);
  const [query,  setQuery]  = useState("");
  const [cat,    setCat]    = useState("All");
  const [city,   setCity]   = useState("All Cities");
  const [showF,  setShowF]  = useState(false);

  useEffect(() => {
    fetch("/api/expos")
      .then(r => r.json())
      .then(data => setExpos(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // shape DB expo to what ExpoCard expects
  function shape(e) {
    return {
      ...e,
      id:               e._id,
      location:         e.city,
      date:             e.dateStart ? new Date(e.dateStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      availableBooths:  e.totalBooths || 0,
      boothPriceFrom:   0,
      applicationOpen:  e.status === "published",
      applicationDeadline: e.dateStart ? new Date(e.dateStart).toLocaleDateString() : "",
      attendees:        0,
      featured:         false,
    };
  }

  const shaped = expos.map(shape);
  const FEATURED = shaped[0] || null;

  const filtered = useMemo(() => {
    let list = shaped;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.city?.toLowerCase().includes(q));
    }
    if (cat  !== "All")        list = list.filter((e) => e.category === cat);
    if (city !== "All Cities") list = list.filter((e) => e.city === city);
    return list;
  }, [shaped, query, cat, city]);

  const hasFilters = cat !== "All" || city !== "All Cities";

  return (
    <div className="space-y-5">

      {/* Featured */}
      {FEATURED && (
        <div className="relative rounded-xl overflow-hidden" style={{ height: 200 }}>
          <img src={FEATURED.image} alt={FEATURED.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(9,21,46,0.88) 0%, rgba(9,21,46,0.5) 55%, transparent 80%)" }} />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="flex gap-2 mb-2">
              <span className="flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(52,120,246,0.3)", color: "#7BADFF" }}>
                <Star size={9} fill="currentColor" /> Featured
              </span>
            </div>
            <h2 className="text-white font-black text-[17px] leading-snug mb-1 max-w-sm">{FEATURED.title}</h2>
            <p className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              {FEATURED.date} · {FEATURED.location} · {FEATURED.availableBooths} booths remaining
            </p>
            <button className="self-start px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
              style={{ background: "#3478F6" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
              Apply as Exhibitor
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg"
          style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expos by title, city, or category…"
            className="flex-1 text-[13px] outline-none bg-transparent" style={{ color: "#09152E" }} />
          {query && <button onClick={() => setQuery("")}><X size={13} style={{ color: "#94A3B8" }} /></button>}
        </div>
        <button onClick={() => setShowF(!showF)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
          style={showF || hasFilters
            ? { background: "#09152E", color: "#fff", border: "1px solid #09152E" }
            : { background: "#fff", color: "#3E506D", border: "1px solid #E8EEF8" }}>
          <SlidersHorizontal size={13} /> Filters
          {hasFilters && (
            <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
              style={{ background: "#3478F6", color: "#fff" }}>
              {(cat !== "All" ? 1 : 0) + (city !== "All Cities" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filter drawer */}
      {showF && (
        <div className="rounded-xl p-4 space-y-4" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => <Pill key={c} label={c} active={cat === c} onClick={() => setCat(c)} />)}
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>City</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => <Pill key={c} label={c} active={city === c} onClick={() => setCity(c)} />)}
            </div>
          </div>
          {hasFilters && (
            <button className="text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => { setCat("All"); setCity("All Cities"); }}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Quick pills */}
      {!showF && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((c) => <Pill key={c} label={c} active={cat === c} onClick={() => setCat(c)} />)}
        </div>
      )}

      <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
        {filtered.length} expo{filtered.length !== 1 ? "s" : ""}
        {query && <span style={{ color: "#09152E", fontWeight: 600 }}> for "{query}"</span>}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((expo) => <ExpoCard key={expo.id} expo={expo} />)}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <Search size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>No expos found</p>
          <p className="text-[13px]" style={{ color: "#94A3B8" }}>Try different filters or search terms.</p>
          <button className="mt-4 text-[12.5px] font-semibold" style={{ color: "#3478F6" }}
            onClick={() => { setQuery(""); setCat("All"); setCity("All Cities"); }}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
