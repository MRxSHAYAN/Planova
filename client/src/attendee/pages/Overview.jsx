import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, CalendarDays, Clock, Bookmark, Bell, CheckCircle2 } from "lucide-react";
import { CURRENT_USER, EVENTS, SESSIONS, NOTIFICATIONS } from "../data/mockData";
import { CATEGORY_COLORS } from "../data/mockData";

const NEXT_EVENT       = EVENTS.find((e) => e.upcoming && e.registrationStatus === "Confirmed");
const NEXT_SESSIONS    = SESSIONS.filter((s) => s.eventId === "evt_001").slice(0, 3);
const RECOMMENDATIONS  = EVENTS.filter((e) => !e.registrationStatus).slice(0, 3);
const RECENT_NOTIFS    = NOTIFICATIONS.filter((n) => !n.read).slice(0, 3);

/* ── tiny helpers ────────────────────────────────────────────── */
function CategoryPill({ label }) {
  const c = CATEGORY_COLORS[label] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <span className="inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

function StatusPill({ label }) {
  const map = {
    Confirmed: { bg: "#E6F9F1", text: "#12875A" },
    Pending:   { bg: "#FFF4DE", text: "#A16207" },
    Attended:  { bg: "#EEF1F8", text: "#3E506D" },
  };
  const s = map[label] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.text }}>
      {label === "Confirmed" && <CheckCircle2 size={10} />}
      {label}
    </span>
  );
}

/* ── stat tile ───────────────────────────────────────────────── */
function Tile({ value, label, icon: Icon, accent }) {
  return (
    <div
      className="rounded-xl px-5 py-4 flex items-center gap-3"
      style={{
        background: accent ? "#09152E" : "#fff",
        border: accent ? "none" : "1px solid #E8EEF8",
      }}
    >
      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: accent ? "rgba(52,120,246,0.18)" : "#F0F3FA", color: accent ? "#3478F6" : "#7A8AA5" }}
      >
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-[22px] font-black leading-none" style={{ color: accent ? "#fff" : "#09152E" }}>{value}</p>
        <p className="text-[11px] mt-0.5" style={{ color: accent ? "rgba(255,255,255,0.45)" : "#94A3B8" }}>{label}</p>
      </div>
    </div>
  );
}

/* ── notification type meta ──────────────────────────────────── */
const NOTIF_META = {
  confirmation: { dot: "#12875A", label: "Confirmed" },
  update:       { dot: "#D97706", label: "Update" },
  reminder:     { dot: "#3478F6", label: "Reminder" },
  announcement: { dot: "#7C3AED", label: "News" },
};

/* ── page ────────────────────────────────────────────────────── */
export default function Overview() {
  const navigate = useNavigate();
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  const registeredCount = EVENTS.filter((e) => ["Confirmed", "Pending"].includes(e.registrationStatus)).length;
  const sessionCount    = SESSIONS.filter((s) => s.eventId === "evt_001").length;
  const savedCount      = EVENTS.filter((e) => e.saved).length + SESSIONS.filter((s) => s.saved).length;
  const unreadCount     = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">

      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium" style={{ color: "#3478F6" }}>{greeting}</p>
          <h2 className="text-[22px] font-black leading-tight mt-0.5" style={{ color: "#09152E" }}>
            {CURRENT_USER.name.split(" ")[0]} 👋
          </h2>
          <p className="text-[13px] mt-1" style={{ color: "#64748B" }}>
            {registeredCount} event{registeredCount !== 1 ? "s" : ""} registered · {unreadCount} new notifications
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => navigate("/dashboard/explore")}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: "#fff", border: "1px solid #E8EEF8", color: "#3E506D" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3478F6"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E8EEF8"}
          >
            Explore
          </button>
          <button
            onClick={() => navigate("/dashboard/my-events")}
            className="px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1D5FE0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#3478F6"}
          >
            My Events
          </button>
        </div>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile value={registeredCount} label="Registered events" icon={CalendarDays} accent />
        <Tile value={sessionCount}    label="Scheduled sessions" icon={Clock} />
        <Tile value={savedCount}      label="Saved items"        icon={Bookmark} />
        <Tile value={unreadCount}     label="Unread alerts"      icon={Bell} />
      </div>

      {/* ── Two-col body ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Left — Next event card (3 cols) */}
        <div className="lg:col-span-3 space-y-4">

          {NEXT_EVENT ? (
            <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              {/* Image strip */}
              <div className="relative h-[140px] overflow-hidden">
                <img src={NEXT_EVENT.image} alt={NEXT_EVENT.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,21,46,0.7) 0%, transparent 55%)" }} />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <CategoryPill label={NEXT_EVENT.category} />
                  <StatusPill label={NEXT_EVENT.registrationStatus} />
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>
                  Next registered event
                </p>
                <h3 className="text-[15px] font-black leading-snug mb-3" style={{ color: "#09152E" }}>
                  {NEXT_EVENT.title}
                </h3>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
                  <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
                    <CalendarDays size={12} style={{ color: "#3478F6" }} /> {NEXT_EVENT.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
                    <MapPin size={12} style={{ color: "#3478F6" }} /> {NEXT_EVENT.venue}
                  </span>
                </div>

                {/* Session mini-list */}
                <div className="rounded-lg overflow-hidden" style={{ background: "#F5F8FF", border: "1px solid #E8EEF8" }}>
                  <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid #E8EEF8" }}>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      Your sessions
                    </span>
                    <button
                      onClick={() => navigate("/dashboard/schedule")}
                      className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
                      style={{ color: "#3478F6" }}
                    >
                      Full schedule <ArrowRight size={11} />
                    </button>
                  </div>
                  {NEXT_SESSIONS.map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 px-3 py-2.5"
                      style={{ borderBottom: i < NEXT_SESSIONS.length - 1 ? "1px solid #EEF1F8" : "none" }}
                    >
                      <span className="text-[11px] font-bold w-[44px] shrink-0 tabular-nums" style={{ color: "#3478F6" }}>
                        {s.timeStart}
                      </span>
                      <span className="flex-1 text-[12.5px] font-medium truncate" style={{ color: "#09152E" }}>
                        {s.title}
                      </span>
                      <span className="text-[10.5px] shrink-0" style={{ color: "#94A3B8" }}>{s.dateLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl px-6 py-10 text-center"
              style={{ background: "#fff", border: "1px solid #E8EEF8" }}
            >
              <p className="text-[14px] font-semibold mb-3" style={{ color: "#09152E" }}>No registered events yet</p>
              <button
                onClick={() => navigate("/dashboard/explore")}
                className="text-[13px] font-bold transition-colors"
                style={{ color: "#3478F6" }}
              >
                Browse events →
              </button>
            </div>
          )}

          {/* Recommended strip */}
          <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F3FA" }}>
              <p className="text-[13px] font-black" style={{ color: "#09152E" }}>You might like</p>
              <button
                onClick={() => navigate("/dashboard/explore")}
                className="flex items-center gap-1 text-[11.5px] font-semibold"
                style={{ color: "#3478F6" }}
              >
                See all <ArrowRight size={11} />
              </button>
            </div>
            {RECOMMENDATIONS.map((ev, i) => (
              <div
                key={ev.id}
                className="flex gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                style={{ borderBottom: i < RECOMMENDATIONS.length - 1 ? "1px solid #F0F3FA" : "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAFBFF"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                onClick={() => navigate("/dashboard/explore")}
              >
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-11 h-11 rounded-lg object-cover shrink-0"
                  style={{ background: "#E5EEFF" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-snug truncate" style={{ color: "#09152E" }}>{ev.title}</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>{ev.date} · {ev.location}</p>
                </div>
                <CategoryPill label={ev.category} />
              </div>
            ))}
          </div>
        </div>

        {/* Right — Notifications (2 cols) */}
        <div className="lg:col-span-2">
          <div className="rounded-xl h-full" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F3FA" }}>
              <p className="text-[13px] font-black" style={{ color: "#09152E" }}>Notifications</p>
              <button
                onClick={() => navigate("/dashboard/notifications")}
                className="flex items-center gap-1 text-[11.5px] font-semibold"
                style={{ color: "#3478F6" }}
              >
                All <ArrowRight size={11} />
              </button>
            </div>

            {RECENT_NOTIFS.length > 0 ? (
              <div>
                {RECENT_NOTIFS.map((n, i) => {
                  const meta = NOTIF_META[n.type] || { dot: "#94A3B8", label: n.type };
                  return (
                    <div
                      key={n.id}
                      className="px-5 py-4"
                      style={{ borderBottom: i < RECENT_NOTIFS.length - 1 ? "1px solid #F5F7FB" : "none" }}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
                          style={{ background: meta.dot }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold leading-snug" style={{ color: "#09152E" }}>{n.title}</p>
                          <p className="text-[12px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: "#64748B" }}>{n.message}</p>
                          <p className="text-[10.5px] mt-1.5" style={{ color: "#B0BCC8" }}>{n.timeLabel}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="px-5 py-3">
                  <button
                    onClick={() => navigate("/dashboard/notifications")}
                    className="w-full py-2 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{ background: "#F0F3FA", color: "#3E506D" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#E5EEFF"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#F0F3FA"}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-[13px]" style={{ color: "#94A3B8" }}>All caught up ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
