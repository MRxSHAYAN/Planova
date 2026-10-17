import { useState } from "react";
import { Bookmark, MapPin, User, Clock, CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SESSIONS, CATEGORY_COLORS } from "../data/mockData";

const DATE_TABS = [
  { label: "Nov 15", dayFull: "Saturday, Nov 15" },
  { label: "Nov 16", dayFull: "Sunday, Nov 16" },
  { label: "Nov 17", dayFull: "Monday, Nov 17" },
  { label: "Dec 3",  dayFull: "Thursday, Dec 3" },
];

const CAT_BAR_COLORS = {
  Keynote:  "#09152E",
  Panel:    "#3478F6",
  Workshop: "#D97706",
  Talk:     "#12875A",
};

/* ── Session detail modal ────────────────────────────────────── */
function SessionModal({ session, onClose }) {
  const c = CATEGORY_COLORS[session.category] || { bg: "#EEF1F8", text: "#3E506D" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(9,21,46,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl overflow-hidden"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="px-5 py-4 flex items-start justify-between gap-3" style={{ borderBottom: "1px solid #F0F3FA" }}>
          <div>
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
              {session.category}
            </span>
            <h3 className="text-[15px] font-black leading-snug mt-2" style={{ color: "#09152E" }}>{session.title}</h3>
          </div>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors"
            style={{ background: "#F0F3FA", color: "#64748B" }}
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-[13px] leading-relaxed" style={{ color: "#3E506D" }}>{session.description}</p>

          <div className="rounded-lg p-3 space-y-2.5" style={{ background: "#F5F8FF" }}>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <User size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              <span><strong style={{ color: "#09152E" }}>{session.speaker}</strong>{session.speakerRole && ` · ${session.speakerRole}`}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <Clock size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              {session.timeStart} – {session.timeEnd}
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <MapPin size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              {session.room}
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <CalendarDays size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              {session.dateLabel} · {session.eventTitle}
            </div>
          </div>
        </div>

        <div className="px-5 py-4" style={{ borderTop: "1px solid #F0F3FA" }}>
          <button
            className="w-full py-2.5 rounded-lg text-[13px] font-bold text-white transition-colors"
            style={{ background: "#09152E" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────── */
export default function MySchedule() {
  const [dateIdx,   setDateIdx]  = useState(0);
  const [saved,     setSaved]    = useState(Object.fromEntries(SESSIONS.map((s) => [s.id, s.saved])));
  const [modal,     setModal]    = useState(null);

  const selectedDate    = DATE_TABS[dateIdx].label;
  const sessionsForDate = SESSIONS.filter((s) => s.dateLabel === selectedDate);
  const savedSessions   = SESSIONS.filter((s) => saved[s.id]);

  const toggleSave = (id) => setSaved((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-5">

      {/* Date selector */}
      <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {/* Day nav */}
        <div className="flex items-center gap-3 mb-4">
          <button
            disabled={dateIdx === 0}
            onClick={() => setDateIdx(dateIdx - 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
            style={{ background: "#F0F3FA", color: "#64748B" }}
          >
            <ChevronLeft size={14} />
          </button>
          <div className="flex-1 text-center">
            <p className="text-[13.5px] font-black" style={{ color: "#09152E" }}>{DATE_TABS[dateIdx].dayFull}</p>
            <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>{sessionsForDate.length} sessions</p>
          </div>
          <button
            disabled={dateIdx === DATE_TABS.length - 1}
            onClick={() => setDateIdx(dateIdx + 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
            style={{ background: "#F0F3FA", color: "#64748B" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Date pills */}
        <div className="flex gap-2">
          {DATE_TABS.map(({ label }, i) => {
            const cnt = SESSIONS.filter((s) => s.dateLabel === label).length;
            return (
              <button
                key={label}
                onClick={() => setDateIdx(i)}
                className="flex-1 flex flex-col items-center py-2.5 rounded-lg transition-colors"
                style={
                  dateIdx === i
                    ? { background: "#09152E", color: "#fff" }
                    : { background: "#F5F8FF", color: "#3E506D", border: "1px solid #EEF1F8" }
                }
              >
                <span className="text-[12px] font-bold">{label}</span>
                <span className="text-[10px] mt-0.5 opacity-60">{cnt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main + sidebar */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Agenda — 2 cols */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #F0F3FA" }}>
            <p className="text-[13px] font-black" style={{ color: "#09152E" }}>{DATE_TABS[dateIdx].dayFull}</p>
          </div>

          {sessionsForDate.length > 0 ? sessionsForDate.map((session, i) => {
            const barColor = CAT_BAR_COLORS[session.category] || "#3478F6";
            const isSaved  = saved[session.id];

            return (
              <div
                key={session.id}
                className="flex gap-0 cursor-pointer transition-colors"
                style={{ borderBottom: i < sessionsForDate.length - 1 ? "1px solid #F5F7FB" : "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAFBFF"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                onClick={() => setModal(session)}
              >
                {/* Left color bar */}
                <div className="w-0.5 shrink-0 self-stretch" style={{ background: barColor, marginLeft: "16px", marginTop: "12px", marginBottom: "12px", borderRadius: "1px" }} />

                {/* Time column */}
                <div className="w-[56px] shrink-0 py-4 pl-3 text-right">
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: "#3478F6" }}>{session.timeStart}</span>
                  <span className="block text-[10px]" style={{ color: "#B0BCC8" }}>{session.timeEnd}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-4 pl-3 pr-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold leading-snug mb-1" style={{ color: "#09152E" }}>
                        {session.title}
                      </p>
                      <p className="text-[12px]" style={{ color: "#64748B" }}>
                        {session.speaker}
                        {session.speakerRole && <span style={{ color: "#94A3B8" }}> · {session.speakerRole}</span>}
                      </p>
                      <p className="text-[11.5px] mt-1.5" style={{ color: "#B0BCC8" }}>
                        📍 {session.room}
                      </p>
                    </div>
                    <button
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: isSaved ? "#E5EEFF" : "transparent" }}
                      onClick={(e) => { e.stopPropagation(); toggleSave(session.id); }}
                      aria-label={isSaved ? "Remove bookmark" : "Save"}
                    >
                      <Bookmark size={13} style={{ color: isSaved ? "#3478F6" : "#CBD5E1", fill: isSaved ? "#3478F6" : "none" }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="py-16 text-center">
              <CalendarDays size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
              <p className="text-[14px] font-semibold" style={{ color: "#09152E" }}>No sessions on this day</p>
              <p className="text-[12.5px] mt-1" style={{ color: "#94A3B8" }}>Sessions exist for Nov 15–17 and Dec 3.</p>
            </div>
          )}
        </div>

        {/* Saved sessions */}
        <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #F0F3FA" }}>
            <p className="text-[13px] font-black" style={{ color: "#09152E" }}>Saved Sessions</p>
            <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>{savedSessions.length} bookmarked</p>
          </div>

          {savedSessions.length > 0 ? savedSessions.map((s, i) => (
            <div
              key={s.id}
              className="px-5 py-3.5 cursor-pointer transition-colors"
              style={{ borderBottom: i < savedSessions.length - 1 ? "1px solid #F5F7FB" : "none" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#FAFBFF"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              onClick={() => setModal(s)}
            >
              <p className="text-[12.5px] font-semibold leading-snug line-clamp-2 mb-1" style={{ color: "#09152E" }}>{s.title}</p>
              <p className="text-[11px]" style={{ color: "#94A3B8" }}>{s.dateLabel} · {s.timeStart}</p>
            </div>
          )) : (
            <div className="px-5 py-8 text-center">
              <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>Bookmark sessions from the agenda.</p>
            </div>
          )}
        </div>
      </div>

      {modal && <SessionModal session={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
