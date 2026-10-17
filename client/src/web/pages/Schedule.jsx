import { useState } from "react";
import Layout from "../components/Layout";

const SESSIONS = [
  {
    id: 1,
    expo: "Karachi Technology Expo 2026",
    expoDate: "Nov 15–17, 2026",
    day: "Day 1 — Nov 15",
    time: "09:00 AM",
    duration: "60 min",
    title: "Opening Keynote: Pakistan's Digital Future",
    speaker: "Dr. Umar Saif",
    role: "Former Chair, PITB",
    type: "Keynote",
    room: "Main Hall",
  },
  {
    id: 2,
    expo: "Karachi Technology Expo 2026",
    expoDate: "Nov 15–17, 2026",
    day: "Day 1 — Nov 15",
    time: "11:00 AM",
    duration: "45 min",
    title: "AI in Pakistani Industry: Case Studies",
    speaker: "Sana Tariq",
    role: "CTO, Netsol Technologies",
    type: "Talk",
    room: "Conference Room A",
  },
  {
    id: 3,
    expo: "Karachi Technology Expo 2026",
    expoDate: "Nov 15–17, 2026",
    day: "Day 2 — Nov 16",
    time: "10:00 AM",
    duration: "90 min",
    title: "Startup Pitching Competition",
    speaker: "Panel of 5 Judges",
    role: "Various",
    type: "Workshop",
    room: "Innovation Stage",
  },
  {
    id: 4,
    expo: "Pakistan Health & Pharma Summit",
    expoDate: "Dec 3–5, 2026",
    day: "Day 1 — Dec 3",
    time: "09:30 AM",
    duration: "60 min",
    title: "Post-COVID Healthcare Infrastructure",
    speaker: "Prof. Zafar Mirza",
    role: "Former SAPM Health",
    type: "Keynote",
    room: "Grand Auditorium",
  },
  {
    id: 5,
    expo: "Pakistan Health & Pharma Summit",
    expoDate: "Dec 3–5, 2026",
    day: "Day 2 — Dec 4",
    time: "02:00 PM",
    duration: "45 min",
    title: "Telemedicine Adoption in Rural Pakistan",
    speaker: "Dr. Ayesha Raza",
    role: "Chief Medical Officer, Sehat Kahani",
    type: "Talk",
    room: "Hall B",
  },
  {
    id: 6,
    expo: "Green Energy & Sustainability Expo",
    expoDate: "Jan 20–22, 2027",
    day: "Day 1 — Jan 20",
    time: "10:00 AM",
    duration: "60 min",
    title: "Renewable Energy Policy in Pakistan",
    speaker: "Eng. Sarfraz Ahmed",
    role: "Director, AEDB",
    type: "Keynote",
    room: "Main Stage",
  },
];

const TYPE_COLORS = {
  Keynote:  "bg-accent-light text-navy",
  Talk:     "bg-status-open-bg text-status-open",
  Workshop: "bg-[#FEF3C7] text-[#92620A]",
  Panel:    "bg-[#FCE7F3] text-[#9D174D]",
};

const ALL_EXPOS = ["All", ...new Set(SESSIONS.map((s) => s.expo))];
const ALL_TYPES = ["All", "Keynote", "Talk", "Workshop", "Panel"];

function SessionCard({ session, bookmarked, onToggle }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 flex gap-4 hover:shadow-sm transition-shadow">
      <div className="shrink-0 w-[72px] text-center">
        <div className="text-accent font-black text-[14px] leading-none">{session.time}</div>
        <div className="text-muted text-[10.5px] mt-0.5">{session.duration}</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TYPE_COLORS[session.type] || "bg-ice text-dark"}`}>
              {session.type}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-page text-body border border-border">
              {session.room}
            </span>
          </div>
          <button
            onClick={() => onToggle(session.id)}
            title={bookmarked ? "Remove bookmark" : "Bookmark session"}
            className={`shrink-0 transition-colors ${bookmarked ? "text-accent" : "text-border hover:text-accent"}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        <h3 className="text-dark font-bold text-[14px] leading-snug mb-1">{session.title}</h3>
        <p className="text-[12.5px] text-body">
          {session.speaker} · <span className="text-muted">{session.role}</span>
        </p>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [activeExpo, setActiveExpo] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [bookmarks,  setBookmarks]  = useState([]);

  const toggleBookmark = (id) =>
    setBookmarks((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);

  const filtered = SESSIONS.filter((s) => {
    const matchExpo = activeExpo === "All" || s.expo === activeExpo;
    const matchType = activeType === "All" || s.type === activeType;
    return matchExpo && matchType;
  });

  const grouped = filtered.reduce((acc, s) => {
    const key = `${s.expo} — ${s.day}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="bg-navy pt-[90px] pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-px bg-accent" />
            <span className="text-accent text-[10.5px] font-semibold tracking-[0.2em] uppercase">Planova</span>
          </div>
          <h1 className="text-[2rem] sm:text-[2.4rem] font-black text-white mb-2">Session Schedule</h1>
          <p className="text-white/45 text-[14px] max-w-md">
            Keynotes, talks, and workshops across all upcoming expos.
          </p>

          {bookmarks.length > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-lg px-4 py-2">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="text-accent text-[13px] font-semibold">{bookmarks.length} session{bookmarks.length !== 1 ? "s" : ""} bookmarked</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-page min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <p className="text-[11px] font-bold text-body uppercase tracking-wider mb-2">Expo</p>
              <div className="flex flex-wrap gap-2">
                {ALL_EXPOS.map((e) => (
                  <button key={e} onClick={() => setActiveExpo(e)}
                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                      activeExpo === e
                        ? "bg-navy text-white border-navy"
                        : "bg-surface text-body border-border hover:border-accent hover:text-accent"
                    }`}>
                    {e === "All" ? "All Expos" : e.split(" ").slice(0, 3).join(" ") + "…"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-body uppercase tracking-wider mb-2">Type</p>
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map((t) => (
                  <button key={t} onClick={() => setActiveType(t)}
                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                      activeType === t
                        ? "bg-accent text-navy border-accent"
                        : "bg-surface text-body border-border hover:border-accent hover:text-accent"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {Object.keys(grouped).length > 0 ? (
            Object.entries(grouped).map(([group, sessions]) => (
              <div key={group} className="mb-10">
                <h2 className="text-[13px] font-black text-dark uppercase tracking-wider mb-4 flex items-center gap-3">
                  <span className="w-5 h-px bg-accent" />
                  {group}
                </h2>
                <div className="flex flex-col gap-3">
                  {sessions.map((s) => (
                    <SessionCard
                      key={s.id}
                      session={s}
                      bookmarked={bookmarks.includes(s.id)}
                      onToggle={toggleBookmark}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-body text-[14px]">No sessions match your filters.</p>
              <button onClick={() => { setActiveExpo("All"); setActiveType("All"); }}
                className="mt-4 text-[13px] font-semibold text-accent hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
