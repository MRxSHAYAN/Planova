import { useState } from "react";
import { X, CalendarDays, MapPin, Clock } from "lucide-react";
import { EVENTS, SESSIONS, EXHIBITORS, CATEGORY_COLORS } from "../data/mockData";

const STATUS_STYLE = {
  Confirmed: { bg: "#E6F9F1", text: "#12875A" },
  Pending:   { bg: "#FFF4DE", text: "#A16207" },
};

export default function SavedItems() {
  const [tab,   setTab]   = useState("events");
  const [evts,  setEvts]  = useState(EVENTS.filter((e) => e.saved));
  const [sess,  setSess]  = useState(SESSIONS.filter((s) => s.saved));
  const [exhs,  setExhs]  = useState(EXHIBITORS.filter((e) => e.saved));

  const tabs = [
    { key: "events",     label: "Events",     count: evts.length },
    { key: "sessions",   label: "Sessions",   count: sess.length },
    { key: "exhibitors", label: "Exhibitors", count: exhs.length },
  ];

  const Empty = ({ msg }) => (
    <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>Nothing saved yet</p>
      <p className="text-[13px]" style={{ color: "#94A3B8" }}>{msg}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
            style={tab === key ? { background: "#09152E", color: "#fff" } : { color: "#94A3B8" }}
          >
            {label}
            <span
              className="text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"
              style={
                tab === key
                  ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                  : { background: "#F0F3FA", color: "#94A3B8" }
              }
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Events */}
      {tab === "events" && (
        evts.length > 0 ? (
          <div className="space-y-3">
            {evts.map((ev) => {
              const cat   = CATEGORY_COLORS[ev.category] || { bg: "#EEF1F8", text: "#3E506D" };
              const stat  = ev.registrationStatus ? STATUS_STYLE[ev.registrationStatus] : null;
              return (
                <div key={ev.id} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
                  <img src={ev.image} alt={ev.title} className="w-14 h-14 rounded-lg object-cover shrink-0" style={{ background: "#E5EEFF" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.text }}>{ev.category}</span>
                      {stat && <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: stat.bg, color: stat.text }}>{ev.registrationStatus}</span>}
                    </div>
                    <p className="text-[13.5px] font-bold leading-snug mb-1" style={{ color: "#09152E" }}>{ev.title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                      <span className="flex items-center gap-1 text-[12px]" style={{ color: "#64748B" }}>
                        <CalendarDays size={11} style={{ color: "#3478F6" }} /> {ev.date}
                      </span>
                      <span className="flex items-center gap-1 text-[12px]" style={{ color: "#64748B" }}>
                        <MapPin size={11} style={{ color: "#3478F6" }} /> {ev.location}
                      </span>
                    </div>
                  </div>
                  <button
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ color: "#CBD5E1" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
                    onClick={() => setEvts((p) => p.filter((e) => e.id !== ev.id))}
                    aria-label="Remove"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : <Empty msg="Bookmark events while browsing to save them here." />
      )}

      {/* Sessions */}
      {tab === "sessions" && (
        sess.length > 0 ? (
          <div className="space-y-3">
            {sess.map((s) => {
              const cat = CATEGORY_COLORS[s.category] || { bg: "#EEF1F8", text: "#3E506D" };
              return (
                <div key={s.id} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
                  {/* Time badge */}
                  <div className="w-[52px] text-center py-2.5 rounded-lg shrink-0" style={{ background: "#F5F8FF" }}>
                    <p className="text-[12px] font-bold" style={{ color: "#3478F6" }}>{s.timeStart}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{s.dateLabel}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full mb-1.5 inline-block" style={{ background: cat.bg, color: cat.text }}>{s.category}</span>
                    <p className="text-[13.5px] font-bold leading-snug mb-1" style={{ color: "#09152E" }}>{s.title}</p>
                    <p className="text-[12px]" style={{ color: "#64748B" }}>{s.speaker}{s.speakerRole && ` · ${s.speakerRole}`}</p>
                    <p className="text-[11.5px] mt-1 flex items-center gap-1" style={{ color: "#94A3B8" }}>
                      <Clock size={10} /> {s.timeStart}–{s.timeEnd} · {s.room}
                    </p>
                  </div>
                  <button
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ color: "#CBD5E1" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
                    onClick={() => setSess((p) => p.filter((x) => x.id !== s.id))}
                    aria-label="Remove"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : <Empty msg="Save sessions from the Schedule page." />
      )}

      {/* Exhibitors */}
      {tab === "exhibitors" && (
        exhs.length > 0 ? (
          <div className="space-y-3">
            {exhs.map((exh) => {
              const cat = CATEGORY_COLORS[exh.category] || { bg: "#EEF1F8", text: "#3E506D" };
              return (
                <div key={exh.id} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-[13px] shrink-0" style={{ background: exh.color || "#09152E" }}>
                    {exh.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold leading-snug mb-1" style={{ color: "#09152E" }}>{exh.company}</p>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.text }}>{exh.category}</span>
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F0F3FA", color: "#3E506D" }}>
                        {exh.hall} · Booth {exh.booth}
                      </span>
                    </div>
                    <p className="text-[11.5px]" style={{ color: "#94A3B8" }}>{exh.eventTitle}</p>
                  </div>
                  <button
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ color: "#CBD5E1" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
                    onClick={() => setExhs((p) => p.filter((e) => e.id !== exh.id))}
                    aria-label="Remove"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : <Empty msg="Bookmark exhibitors from the directory." />
      )}
    </div>
  );
}
