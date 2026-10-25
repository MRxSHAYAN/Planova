import { useState, useEffect } from "react";
import { Bookmark, MapPin, User, Clock, CalendarDays, X, Loader2 } from "lucide-react";

const BAR_COLORS = {
  Keynote:  "#09152E",
  Panel:    "#3478F6",
  Workshop: "#D97706",
  Talk:     "#12875A",
};

const CAT_COLORS = {
  Keynote:  { bg: "#DCE8FF", text: "#09152E" },
  Panel:    { bg: "#E5EEFF", text: "#3478F6" },
  Workshop: { bg: "#FEF3C7", text: "#92620A" },
  Talk:     { bg: "#DDF7E7", text: "#16804A" },
};

function SessionModal({ session, onClose }) {
  const c = CAT_COLORS[session.type] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(9,21,46,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-xl overflow-hidden" style={{ background: "#fff" }} onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-start justify-between gap-3" style={{ borderBottom: "1px solid #F0F3FA" }}>
          <div>
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>{session.type}</span>
            <h3 className="text-[15px] font-black leading-snug mt-2" style={{ color: "#09152E" }}>{session.title}</h3>
          </div>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors"
            style={{ background: "#F0F3FA", color: "#64748B" }} onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {session.description && (
            <p className="text-[13px] leading-relaxed" style={{ color: "#3E506D" }}>{session.description}</p>
          )}
          <div className="rounded-lg p-3 space-y-2.5" style={{ background: "#F5F8FF" }}>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <User size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              <span><strong style={{ color: "#09152E" }}>{session.speaker}</strong>
                {session.speakerRole && ` · ${session.speakerRole}`}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <Clock size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              {session.time}{session.duration && ` · ${session.duration}`}
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <MapPin size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              {session.room}
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "#3E506D" }}>
              <CalendarDays size={13} style={{ color: "#3478F6", flexShrink: 0 }} />
              {new Date(session.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              {session.event?.title && ` · ${session.event.title}`}
            </div>
          </div>
        </div>
        <div className="px-5 py-4" style={{ borderTop: "1px solid #F0F3FA" }}>
          <button className="w-full py-2.5 rounded-lg text-[13px] font-bold text-white transition-colors"
            style={{ background: "#09152E" }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MySchedule() {
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saved,    setSaved]    = useState({});
  const [modal,    setModal]    = useState(null);
  const [dateIdx,  setDateIdx]  = useState(0);

  useEffect(() => {
    fetch("/api/sessions")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSessions(data);
          // Init saved state
          const init = {};
          data.forEach(s => { init[s._id] = false; });
          setSaved(init);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build unique sorted date list
  const dates = [...new Set(
    sessions.map(s => new Date(s.date).toDateString())
  )].sort((a, b) => new Date(a) - new Date(b));

  const safeIdx     = Math.min(dateIdx, dates.length - 1);
  const currentDate = dates[safeIdx];

  const sessionsForDate = sessions.filter(s => new Date(s.date).toDateString() === currentDate);
  const savedSessions   = sessions.filter(s => saved[s._id]);

  function toggleSave(id) { setSaved(p => ({ ...p, [id]: !p[id] })); }

  function dayLabel(d) {
    return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  if (sessions.length === 0) return (
    <div className="rounded-xl px-5 py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <CalendarDays size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
      <p className="text-[14px] font-semibold" style={{ color: "#09152E" }}>No sessions scheduled yet</p>
      <p className="text-[12.5px] mt-1" style={{ color: "#94A3B8" }}>Sessions will appear here once the admin adds them.</p>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Date picker */}
      <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        <p className="text-[13px] font-black mb-3" style={{ color: "#09152E" }}>
          {currentDate ? dayLabel(currentDate) : "—"} &nbsp;·&nbsp;
          <span style={{ color: "#94A3B8", fontWeight: 400 }}>{sessionsForDate.length} sessions</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          {dates.map((d, i) => {
            const label = new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const cnt   = sessions.filter(s => new Date(s.date).toDateString() === d).length;
            return (
              <button key={d} onClick={() => setDateIdx(i)}
                className="flex flex-col items-center px-4 py-2.5 rounded-lg transition-colors"
                style={safeIdx === i
                  ? { background: "#09152E", color: "#fff" }
                  : { background: "#F5F8FF", color: "#3E506D", border: "1px solid #EEF1F8" }}>
                <span className="text-[12px] font-bold">{label}</span>
                <span className="text-[10px] mt-0.5 opacity-60">{cnt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Agenda */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #F0F3FA" }}>
            <p className="text-[13px] font-black" style={{ color: "#09152E" }}>
              {currentDate ? dayLabel(currentDate) : "Sessions"}
            </p>
          </div>

          {sessionsForDate.length > 0 ? sessionsForDate.map((session, i) => {
            const barColor = BAR_COLORS[session.type] || "#3478F6";
            const isSaved  = saved[session._id];
            return (
              <div key={session._id}
                className="flex gap-0 cursor-pointer transition-colors"
                style={{ borderBottom: i < sessionsForDate.length - 1 ? "1px solid #F5F7FB" : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                onClick={() => setModal(session)}>
                <div className="w-0.5 shrink-0 self-stretch" style={{ background: barColor, marginLeft: 16, marginTop: 12, marginBottom: 12, borderRadius: 1 }} />
                <div className="w-[56px] shrink-0 py-4 pl-3 text-right">
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: "#3478F6" }}>{session.time}</span>
                  <span className="block text-[10px]" style={{ color: "#B0BCC8" }}>{session.duration}</span>
                </div>
                <div className="flex-1 min-w-0 py-4 pl-3 pr-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold leading-snug mb-1" style={{ color: "#09152E" }}>{session.title}</p>
                      <p className="text-[12px]" style={{ color: "#64748B" }}>
                        {session.speaker}
                        {session.speakerRole && <span style={{ color: "#94A3B8" }}> · {session.speakerRole}</span>}
                      </p>
                      <p className="text-[11.5px] mt-1.5" style={{ color: "#B0BCC8" }}>
                        {session.room}{session.event?.title && ` · ${session.event.title}`}
                      </p>
                    </div>
                    <button className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: isSaved ? "#E5EEFF" : "transparent" }}
                      onClick={e => { e.stopPropagation(); toggleSave(session._id); }}>
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
            <div key={s._id} className="px-5 py-3.5 cursor-pointer transition-colors"
              style={{ borderBottom: i < savedSessions.length - 1 ? "1px solid #F5F7FB" : "none" }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => setModal(s)}>
              <p className="text-[12.5px] font-semibold leading-snug line-clamp-2 mb-1" style={{ color: "#09152E" }}>{s.title}</p>
              <p className="text-[11px]" style={{ color: "#94A3B8" }}>
                {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {s.time}
              </p>
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
