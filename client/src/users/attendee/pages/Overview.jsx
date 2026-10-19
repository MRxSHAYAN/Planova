import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, CalendarDays, Clock, Bookmark, Bell, CheckCircle2 } from "lucide-react";
import { CURRENT_USER, EVENTS, SESSIONS, NOTIFICATIONS, CATEGORY_COLORS } from "../data/mockData";

const BASE = "/users/dashboard/attendee";

const NEXT_EVENT      = EVENTS.find((e) => e.upcoming && e.registrationStatus === "Confirmed");
const NEXT_SESSIONS   = SESSIONS.filter((s) => s.eventId === "evt_001").slice(0, 3);
const RECOMMENDATIONS = EVENTS.filter((e) => !e.registrationStatus).slice(0, 3);
const RECENT_NOTIFS   = NOTIFICATIONS.filter((n) => !n.read).slice(0, 3);

const NOTIF_DOTS = {
  confirmation: "#12875A",
  update:       "#D97706",
  reminder:     "#3478F6",
  announcement: "#7C3AED",
};

function CategoryPill({ label }) {
  const c = CATEGORY_COLORS[label] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <span className="inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

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

      {/* Welcome row */}
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
          <button onClick={() => navigate(`${BASE}/explore`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: "#fff", border: "1px solid #E8EEF8", color: "#3E506D" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3478F6")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E8EEF8")}>
            Explore
          </button>
          <button onClick={() => navigate(`${BASE}/my-events`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
            My Events
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="rounded-xl px-5 py-4 flex flex-wrap gap-x-8 gap-y-3"
        style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {[
          { icon: CalendarDays, label: "Registered",        value: registeredCount, color: "#3478F6" },
          { icon: Clock,        label: "Sessions lined up", value: sessionCount,    color: "#09152E" },
          { icon: Bookmark,     label: "Saved items",       value: savedCount,      color: "#09152E" },
          { icon: Bell,         label: "Unread",            value: unreadCount,     color: unreadCount > 0 ? "#D97706" : "#09152E" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={15} style={{ color, flexShrink: 0 }} />
            <span className="text-[13px] font-semibold" style={{ color: "#09152E" }}>{value}</span>
            <span className="text-[12.5px]" style={{ color: "#94A3B8" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Main two-col layout */}
      <div className="grid lg:grid-cols-5 gap-5">

        <div className="lg:col-span-3 space-y-4">

          {/* Next event */}
          {NEXT_EVENT ? (
            <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <div className="relative h-[140px] overflow-hidden">
                <img src={NEXT_EVENT.image} alt={NEXT_EVENT.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(9,21,46,0.7) 0%, transparent 55%)" }} />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <CategoryPill label={NEXT_EVENT.category} />
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#E6F9F1", color: "#12875A" }}>
                    <CheckCircle2 size={10} /> {NEXT_EVENT.registrationStatus}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>
                  Next up
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
                <div className="rounded-lg overflow-hidden" style={{ background: "#F5F8FF", border: "1px solid #E8EEF8" }}>
                  <div className="px-3 py-2.5 flex items-center justify-between"
                    style={{ borderBottom: "1px solid #E8EEF8" }}>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      Your sessions
                    </span>
                    <button onClick={() => navigate(`${BASE}/schedule`)}
                      className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#3478F6" }}>
                      Full schedule <ArrowRight size={11} />
                    </button>
                  </div>
                  {NEXT_SESSIONS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 px-3 py-2.5"
                      style={{ borderBottom: i < NEXT_SESSIONS.length - 1 ? "1px solid #EEF1F8" : "none" }}>
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
            <div className="rounded-xl px-6 py-10 text-center"
              style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <p className="text-[14px] font-semibold mb-3" style={{ color: "#09152E" }}>No registered events yet</p>
              <button onClick={() => navigate(`${BASE}/explore`)}
                className="text-[13px] font-bold" style={{ color: "#3478F6" }}>
                Browse events →
              </button>
            </div>
          )}

          {/* Explore more */}
          <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid #F0F3FA" }}>
              <p className="text-[13px] font-black" style={{ color: "#09152E" }}>More to explore</p>
              <button onClick={() => navigate(`${BASE}/explore`)}
                className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: "#3478F6" }}>
                See all <ArrowRight size={11} />
              </button>
            </div>
            {RECOMMENDATIONS.map((ev, i) => (
              <div key={ev.id}
                className="flex gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                style={{ borderBottom: i < RECOMMENDATIONS.length - 1 ? "1px solid #F0F3FA" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFF")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => navigate(`${BASE}/explore`)}>
                <img src={ev.image} alt={ev.title}
                  className="w-11 h-11 rounded-lg object-cover shrink-0" style={{ background: "#E5EEFF" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-snug truncate" style={{ color: "#09152E" }}>{ev.title}</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>{ev.date} · {ev.location}</p>
                </div>
                <CategoryPill label={ev.category} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications column */}
        <div className="lg:col-span-2">
          <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid #F0F3FA" }}>
              <p className="text-[13px] font-black" style={{ color: "#09152E" }}>Notifications</p>
              <button onClick={() => navigate(`${BASE}/notifications`)}
                className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: "#3478F6" }}>
                All <ArrowRight size={11} />
              </button>
            </div>
            {RECENT_NOTIFS.length > 0 ? (
              <div>
                {RECENT_NOTIFS.map((n, i) => (
                  <div key={n.id} className="px-5 py-4"
                    style={{ borderBottom: i < RECENT_NOTIFS.length - 1 ? "1px solid #F5F7FB" : "none" }}>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
                        style={{ background: NOTIF_DOTS[n.type] || "#94A3B8" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-snug" style={{ color: "#09152E" }}>{n.title}</p>
                        <p className="text-[12px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: "#64748B" }}>{n.message}</p>
                        <p className="text-[10.5px] mt-1.5" style={{ color: "#B0BCC8" }}>{n.timeLabel}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-5 py-3">
                  <button onClick={() => navigate(`${BASE}/notifications`)}
                    className="w-full py-2 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{ background: "#F0F3FA", color: "#3E506D" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#E5EEFF")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#F0F3FA")}>
                    View all
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
