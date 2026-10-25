import { useState, useEffect, useMemo } from "react";
import { Search, X, SlidersHorizontal, MapPin, CalendarDays, Users, Star } from "lucide-react";

const CATEGORIES = ["All", "Technology", "Healthcare", "Energy", "Fashion", "Agriculture"];
const CITIES     = ["All Cities", "Karachi", "Lahore", "Islamabad"];

const CATEGORY_COLORS = {
  Technology:  { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:  { bg: "#DDF7E7", text: "#16804A" },
  Energy:      { bg: "#FEF3C7", text: "#92620A" },
  Fashion:     { bg: "#FCE7F3", text: "#9D174D" },
  Agriculture: { bg: "#ECFDF5", text: "#065F46" },
  Food:        { bg: "#FEF3C7", text: "#92620A" },
};

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

function EventCard({ event, registeredIds, onRegister }) {
  const c = CATEGORY_COLORS[event.category] || { bg: "#EEF1F8", text: "#3E506D" };
  const isRegistered = registeredIds.has(event._id || event.id);

  return (
    <article className="dash-card overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <div className="relative h-[148px] overflow-hidden" style={{ background: "#E5EEFF" }}>
        <img src={event.image} alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,21,46,0.25) 0%, transparent 50%)" }} />
        <span className="absolute top-3 left-3 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: c.bg, color: c.text }}>
          {event.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-[13.5px] font-bold leading-snug mb-2.5 line-clamp-2" style={{ color: "#09152E" }}>
          {event.title}
        </h3>
        <div className="space-y-1.5 mb-3">
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <CalendarDays size={11} style={{ color: "#3478F6", flexShrink: 0 }} />{event.date}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
            <MapPin size={11} style={{ color: "#3478F6", flexShrink: 0 }} />{event.location}
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#94A3B8" }}>
            <Users size={11} style={{ flexShrink: 0 }} />{event.attendees?.toLocaleString() || "0"} attending
          </p>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          {isRegistered ? (
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#E6F9F1", color: "#12875A" }}>
              Registered
            </span>
          ) : (
            <span className="text-[10.5px]" style={{ color: "#B0BCC8" }}>Not registered</span>
          )}
          <button
            onClick={() => !isRegistered && onRegister(event._id || event.id)}
            disabled={isRegistered}
            className="text-[12px] px-3 py-1.5 shrink-0 rounded-lg font-bold transition-colors"
            style={isRegistered
              ? { background: "#F0F3FA", color: "#94A3B8", cursor: "default" }
              : { background: "#3478F6", color: "#fff" }}>
            {isRegistered ? "Registered" : "Register"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ExploreEvents() {
  const [rawEvents, setRawEvents] = useState([]);
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const [city,     setCity]     = useState("All Cities");
  const [showF,    setShowF]    = useState(false);
  const [events,   setEvents]   = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    const token = localStorage.getItem("planova_token");

    fetch("/api/expos")
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const shaped = data.map(e => ({
          ...e,
          id:        e._id,
          location:  e.city,
          date:      e.dateStart ? new Date(e.dateStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
          attendees: 0,
          featured:  false,
        }));
        setRawEvents(shaped);
        setEvents(shaped);
      })
      .catch(() => {});

    // Fetch user's registrations to mark already-registered expos
    if (token) {
      fetch("/api/registrations/mine", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRegisteredIds(new Set(data.map(r => r.event?._id || r.event)));
          }
        })
        .catch(() => {});
    }
  }, []);

  async function handleRegister(expoId) {
    const token = localStorage.getItem("planova_token");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ event: expoId }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Registration failed", "err");
      setRegisteredIds(p => new Set([...p, expoId]));
      showToast("Registered! Check My Events.");
    } catch {
      showToast("Something went wrong", "err");
    }
  }

  const filtered = useMemo(() => {
    let list = events;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q));
    }
    if (category !== "All")    list = list.filter((e) => e.category === category);
    if (city !== "All Cities") list = list.filter((e) => e.location?.includes(city));
    return list;
  }, [events, query, category, city]);

  const hasFilters = category !== "All" || city !== "All Cities";
  const FEATURED = events[0] || null;

  return (
    <div className="space-y-5">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg ${toast.type === "err" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>
          {toast.msg}
        </div>
      )}

      {FEATURED && (
        <div className="relative rounded-xl overflow-hidden" style={{ height: 200 }}>
          <img src={FEATURED.image} alt={FEATURED.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(9,21,46,0.88) 0%, rgba(9,21,46,0.5) 50%, transparent 80%)" }} />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(52,120,246,0.25)", color: "#7BADFF" }}>
                <Star size={9} fill="currentColor" /> Featured
              </span>
            </div>
            <h2 className="text-white font-black text-[17px] leading-snug mb-1 max-w-xs">{FEATURED.title}</h2>
            <p className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              {FEATURED.date} · {FEATURED.location}
            </p>
            <button className="btn-primary self-start px-4 py-2 text-[12.5px]">View & Register</button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="dash-card flex-1 flex items-center gap-2 px-3 py-2.5">
          <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, cities, categories…"
            className="flex-1 text-[13px] outline-none bg-transparent" style={{ color: "#09152E" }} />
          {query && <button onClick={() => setQuery("")}><X size={13} style={{ color: "#94A3B8" }} /></button>}
        </div>
        <button className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${showF || hasFilters ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setShowF(!showF)}>
          <SlidersHorizontal size={13} />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
              style={{ background: "#3478F6", color: "#fff" }}>
              {(category !== "All" ? 1 : 0) + (city !== "All Cities" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {showF && (
        <div className="dash-card p-4 space-y-4">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Pill>)}
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>City</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => <Pill key={c} active={city === c} onClick={() => setCity(c)}>{c}</Pill>)}
            </div>
          </div>
          {hasFilters && (
            <button className="text-[12px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => { setCategory("All"); setCity("All Cities"); }}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {!showF && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((c) => <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Pill>)}
        </div>
      )}

      <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
        {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        {query && <span style={{ color: "#09152E", fontWeight: 600 }}> for "{query}"</span>}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ev) => <EventCard key={ev._id || ev.id} event={ev} registeredIds={registeredIds} onRegister={handleRegister} />)}
        </div>
      ) : (
        <div className="dash-card py-16 text-center">
          <Search size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>No events found</p>
          <p className="text-[13px] mb-4" style={{ color: "#94A3B8" }}>Try adjusting your search or filters.</p>
          <button className="text-[13px] font-bold" style={{ color: "#3478F6" }}
            onClick={() => { setQuery(""); setCategory("All"); setCity("All Cities"); }}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
