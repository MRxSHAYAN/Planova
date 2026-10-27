import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const TYPE_COLORS = {
  Keynote:  "bg-accent-light text-navy",
  Talk:     "bg-status-open-bg text-status-open",
  Workshop: "bg-[#FEF3C7] text-[#92620A]",
  Panel:    "bg-[#FCE7F3] text-[#9D174D]",
};

const ALL_TYPES = ["All", "Keynote", "Talk", "Workshop", "Panel"];

function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function SessionRow({ session, bookmarked, onToggle }) {
  return (
    <div className="group flex gap-4 sm:gap-6 py-4 border-b border-border-card last:border-0 hover:bg-ice/40 px-4 rounded-xl transition-colors -mx-4">
      <div className="shrink-0 w-[60px] pt-0.5 text-right">
        <p className="text-accent font-black text-[13.5px] leading-none">{session.time}</p>
        <p className="text-muted text-[10.5px] mt-1">{session.duration}</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[session.type] || "bg-ice text-dark"}`}>
            {session.type}
          </span>
          <span className="text-[10.5px] text-muted border border-border px-2 py-0.5 rounded-full">
            {session.room}
          </span>
        </div>
        <h3 className="text-dark font-semibold text-[14px] leading-snug mb-0.5">{session.title}</h3>
        <p className="text-[12.5px] text-body">
          {session.speaker}
          {session.speakerRole && <span className="text-muted">  {session.speakerRole}</span>}
        </p>
      </div>
      <button onClick={() => onToggle(session._id)} title={bookmarked ? "Remove" : "Bookmark"}
        className={`shrink-0 mt-1 transition-colors ${bookmarked ? "text-accent" : "text-border hover:text-accent"}`}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>
  );
}

export default function Schedule() {
  const [sessions,    setSessions]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeExpo,  setActiveExpo]  = useState("All");
  const [activeType,  setActiveType]  = useState("All");
  const [bookmarks,   setBookmarks]   = useState([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then(r => r.json())
      .then(data => setSessions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleBookmark(id) {
    setBookmarks(p => p.includes(id) ? p.filter(b => b !== id) : [...p, id]);
  }

  // Build expo filter list from sessions
  const expoNames = ["All", ...new Set(sessions.map(s => s.event?.title).filter(Boolean))];

  const filtered = sessions.filter(s =>
    (activeExpo === "All" || s.event?.title === activeExpo) &&
    (activeType === "All" || s.type === activeType)
  );

  // Group by expo + date
  const grouped = filtered.reduce((acc, s) => {
    const expo = s.event?.title || "Unknown Expo";
    const key  = `${expo}  ${dayLabel(s.date)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="bg-navy pt-[90px] pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-3">Planova</p>
          <h1 className="text-[2rem] sm:text-[2.4rem] font-black text-white mb-2">Session Schedule</h1>
          <p className="text-white/45 text-[14px] max-w-md">
            Keynotes, talks, workshops, and panels across all upcoming expos.
          </p>
          {bookmarks.length > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 bg-accent/15 border border-accent/25 rounded-xl px-4 py-2">
              <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="text-accent text-[12.5px] font-semibold">
                {bookmarks.length} session{bookmarks.length !== 1 ? "s" : ""} bookmarked
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-page min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row gap-6 mb-9">
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2.5">Expo</p>
              <div className="flex flex-wrap gap-2">
                {expoNames.map(e => (
                  <button key={e} onClick={() => setActiveExpo(e)}
                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
                      activeExpo === e ? "bg-navy text-white border-navy" : "bg-surface text-body border-border hover:border-accent hover:text-accent"
                    }`}>
                    {e === "All" ? "All expos" : e.split(" ").slice(0, 3).join(" ") + ""}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2.5">Type</p>
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map(t => (
                  <button key={t} onClick={() => setActiveType(t)}
                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
                      activeType === t ? "bg-accent text-white border-accent" : "bg-surface text-body border-border hover:border-accent hover:text-accent"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : Object.keys(grouped).length > 0 ? (
            <div className="space-y-10">
              {Object.entries(grouped).map(([group, slist]) => (
                <div key={group}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-[12px] font-black text-dark uppercase tracking-[0.12em]">{group}</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11.5px] text-muted">{slist.length} session{slist.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="bg-surface rounded-2xl border border-border-card px-4">
                    {slist.map(s => (
                      <SessionRow key={s._id} session={s}
                        bookmarked={bookmarks.includes(s._id)}
                        onToggle={toggleBookmark} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-body text-[14px] mb-4">
                {sessions.length === 0 ? "No sessions scheduled yet." : "No sessions match your filters."}
              </p>
              {sessions.length > 0 && (
                <button onClick={() => { setActiveExpo("All"); setActiveType("All"); }}
                  className="text-[13px] font-semibold text-accent hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
