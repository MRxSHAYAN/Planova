import { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, Bookmark, MapPin, CalendarDays, Users, Star } from "lucide-react";
import { EVENTS, CATEGORY_COLORS } from "../data/mockData";

const CATEGORIES  = ["All", "Technology", "Healthcare", "Energy", "Fashion", "Agriculture"];
const CITIES      = ["All Cities", "Karachi", "Lahore", "Islamabad"];
const FEATURED    = EVENTS.find((e) => e.featured);

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold border shrink-0 transition-all"
      style={
        active
          ? { background: "#09152E", color: "#fff", borderColor: "#09152E" }
          : { background: "#fff", color: "#3E506D", borderColor: "#E8EEF8" }
      }
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}}
    >
      {label}
    </button>
  );
}

function EventCard({ event, onSave }) {
  const [saved, setSaved] = useState(event.saved);
  const c = CATEGORY_COLORS[event.category] || { bg: "#EEF1F8", text: "#3E506D" };

  const statusStyle = {
    Confirmed: { bg: "#E6F9F1", text: "#12875A" },
    Pending:   { bg: "#FFF4DE", text: "#A16207" },
  };
  const sStyle = event.registrationStatus ? statusStyle[event.registrationStatus] : null;

  return (
    <article
      className="rounded-xl overflow-hidden flex flex-col group transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{ background: "#fff", border: "1px solid #E8EEF8" }}
    >
      {/* Thumbnail */}
      <div className="relative h-[148px] overflow-hidden" style={{ background: "#E5EEFF" }}>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,21,46,0.25) 0%, transparent 50%)" }} />

        {/* Category badge */}
        <span
          className="absolute top-3 left-3 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: c.bg, color: c.text }}
        >
          {event.category}
        </span>

        {/* Bookmark */}
        <button
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.92)" }}
          onClick={() => { setSaved(!saved); onSave?.(event.id); }}
          aria-label={saved ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark size={13} style={{ color: saved ? "#3478F6" : "#94A3B8", fill: saved ? "#3478F6" : "none" }} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-[13.5px] font-bold leading-snug mb-2.5 line-clamp-2" style={{ color: "#09152E" }}>
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <CalendarDays size={11} style={{ color: "#3478F6", flexShrink: 0 }} />
            {event.date}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <MapPin size={11} style={{ color: "#3478F6", flexShrink: 0 }} />
            {event.location}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#94A3B8" }}>
            <Users size={11} style={{ flexShrink: 0 }} />
            {event.attendees.toLocaleString()} attending
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          {sStyle ? (
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sStyle.bg, color: sStyle.text }}>
              {event.registrationStatus}
            </span>
          ) : (
            <span className="text-[10.5px]" style={{ color: "#B0BCC8" }}>Not registered</span>
          )}
          <button
            className="text-[12px] font-bold px-3 py-1.5 rounded-lg text-white transition-colors shrink-0"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1D5FE0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#3478F6"}
          >
            {event.registrationStatus ? "View" : "Register"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ExploreEvents() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const [city,     setCity]     = useState("All Cities");
  const [showF,    setShowF]    = useState(false);
  const [events,   setEvents]   = useState(EVENTS);

  const filtered = useMemo(() => {
    let list = events;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    if (category !== "All") list = list.filter((e) => e.category === category);
    if (city !== "All Cities") list = list.filter((e) => e.location.includes(city));
    return list;
  }, [events, query, category, city]);

  const handleSave = (id) => setEvents((p) => p.map((e) => e.id === id ? { ...e, saved: !e.saved } : e));
  const hasFilters = category !== "All" || city !== "All Cities";

  return (
    <div className="space-y-5">

      {/* Featured hero */}
      {FEATURED && (
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ height: 200 }}
        >
          <img src={FEATURED.image} alt={FEATURED.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(9,21,46,0.88) 0%, rgba(9,21,46,0.5) 50%, transparent 80%)" }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(52,120,246,0.25)", color: "#7BADFF" }}
              >
                <Star size={9} fill="currentColor" /> Featured
              </span>
            </div>
            <h2 className="text-white font-black text-[17px] leading-snug mb-1 max-w-xs">{FEATURED.title}</h2>
            <p className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              {FEATURED.date} · {FEATURED.location}
            </p>
            <button
              className="self-start px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
              style={{ background: "#3478F6" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1D5FE0"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#3478F6"}
            >
              View & Register
            </button>
          </div>
        </div>
      )}

      {/* Search row */}
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
            placeholder="Search events, cities, categories…"
            className="flex-1 text-[13px] outline-none bg-transparent"
            style={{ color: "#09152E" }}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={13} style={{ color: "#94A3B8" }} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowF(!showF)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
          style={
            showF || hasFilters
              ? { background: "#09152E", color: "#fff", border: "1px solid #09152E" }
              : { background: "#fff", color: "#3E506D", border: "1px solid #E8EEF8" }
          }
        >
          <SlidersHorizontal size={13} />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center" style={{ background: "#3478F6", color: "#fff" }}>
              {(category !== "All" ? 1 : 0) + (city !== "All Cities" ? 1 : 0)}
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
              {CATEGORIES.map((c) => (
                <CategoryPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>City</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <CategoryPill key={c} label={c} active={city === c} onClick={() => setCity(c)} />
              ))}
            </div>
          </div>
          {hasFilters && (
            <button
              className="text-[12px] font-semibold transition-colors"
              style={{ color: "#3478F6" }}
              onClick={() => { setCategory("All"); setCity("All Cities"); }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Category pills quick-filter */}
      {!showF && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((c) => (
            <CategoryPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
        {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        {query && <span style={{ color: "#09152E", fontWeight: 600 }}> for "{query}"</span>}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ev) => (
            <EventCard key={ev.id} event={ev} onSave={handleSave} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <Search size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>No events found</p>
          <p className="text-[13px] mb-4" style={{ color: "#94A3B8" }}>Try adjusting your search or filters.</p>
          <button
            className="text-[13px] font-bold"
            style={{ color: "#3478F6" }}
            onClick={() => { setQuery(""); setCategory("All"); setCity("All Cities"); }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
