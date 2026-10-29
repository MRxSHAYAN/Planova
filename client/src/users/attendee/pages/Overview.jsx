import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, CalendarDays, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const BASE = "/users/dashboard/attendee";

const CAT_COLORS = {
  Technology:  { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:  { bg: "#DDF7E7", text: "#16804A" },
  Energy:      { bg: "#FEF3C7", text: "#92620A" },
  Agriculture: { bg: "#ECFDF5", text: "#065F46" },
  Fashion:     { bg: "#FCE7F3", text: "#9D174D" },
  Food:        { bg: "#FEF3C7", text: "#92620A" },
};

function CategoryPill({ label }) {
  const c = CAT_COLORS[label] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <span className="inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Overview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [regs,     setRegs]     = useState([]);
  const [sessions, setSessions] = useState([]);
  const [expos,    setExpos]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    const auth  = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/registrations/mine", { headers: auth }).then(r => r.json()),
      fetch("/api/sessions/mine",      { headers: auth }).then(r => r.json()),
      fetch("/api/expos").then(r => r.json()),
    ])
      .then(([regsData, sessData, exposData]) => {
        setRegs(Array.isArray(regsData)  ? regsData  : []);
        setSessions(Array.isArray(sessData) ? sessData : []);
        setExpos(Array.isArray(exposData) ? exposData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nextReg = regs
    .filter(r => r.event?.dateEnd && new Date(r.event.dateEnd) >= new Date())
    .sort((a, b) => new Date(a.event.dateStart) - new Date(b.event.dateStart))[0];

  const upcomingSessions = sessions
    .filter(s => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const unregisteredExpos = expos
    .filter(e => !regs.some(r => String(r.event?._id || r.event) === String(e._id)))
    .slice(0, 3);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={20} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Welcome row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium" style={{ color: "#3478F6" }}>{greeting}</p>
          <h2 className="text-[22px] font-black leading-tight mt-0.5" style={{ color: "#09152E" }}>
            {(user?.name || "").split(" ")[0]}
          </h2>
          <p className="text-[13px] mt-1" style={{ color: "#64748B" }}>
            {regs.length} event{regs.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => navigate(`${BASE}/explore`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: "#fff", border: "1px solid #E8EEF8", color: "#3E506D" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#3478F6"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E8EEF8"}>
            Explore
          </button>
          <button onClick={() => navigate(`${BASE}/my-events`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-bold text-white"
            style={{ background: "#3478F6" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1D5FE0"}
            onMouseLeave={e => e.currentTarget.style.background = "#3478F6"}>
            My Events
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="rounded-xl px-5 py-4 flex flex-wrap gap-x-8 gap-y-3"
        style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {[
          { icon: CalendarDays, label: "Registered",       value: regs.length,             color: "#3478F6" },
          { icon: Clock,        label: "Upcoming sessions", value: upcomingSessions.length, color: "#09152E" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={15} style={{ color, flexShrink: 0 }} />
            <span className="text-[13px] font-semibold" style={{ color: "#09152E" }}>{value}</span>
            <span className="text-[12.5px]" style={{ color: "#94A3B8" }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">

          {/* Next event */}
          {nextReg ? (
            <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <div className="relative h-[140px] overflow-hidden">
                {nextReg.event?.image
                  ? <img src={nextReg.event.image} alt={nextReg.event.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full" style={{ background: "#E5EEFF" }} />
                }
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(9,21,46,0.7) 0%, transparent 55%)" }} />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <CategoryPill label={nextReg.event?.category} />
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#E6F9F1", color: "#12875A" }}>
                    <CheckCircle2 size={10} /> Registered
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>Next up</p>
                <h3 className="text-[15px] font-black leading-snug mb-3" style={{ color: "#09152E" }}>
                  {nextReg.event?.title}
                </h3>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
                  <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
                    <CalendarDays size={12} style={{ color: "#3478F6" }} />
                    {formatDate(nextReg.event?.dateStart)}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
                    <MapPin size={12} style={{ color: "#3478F6" }} />
                    {nextReg.event?.venue}{nextReg.event?.city ? `, ${nextReg.event.city}` : ""}
                  </span>
                </div>

                {upcomingSessions.length > 0 && (
                  <div className="rounded-lg overflow-hidden" style={{ background: "#F5F8FF", border: "1px solid #E8EEF8" }}>
                    <div className="px-3 py-2.5 flex items-center justify-between"
                      style={{ borderBottom: "1px solid #E8EEF8" }}>
                      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                        Upcoming sessions
                      </span>
                      <button onClick={() => navigate(`${BASE}/my-schedule`)}
                        className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#3478F6" }}>
                        Full schedule <ArrowRight size={11} />
                      </button>
                    </div>
                    {upcomingSessions.map((s, i) => (
                      <div key={s._id} className="flex items-center gap-3 px-3 py-2.5"
                        style={{ borderBottom: i < upcomingSessions.length - 1 ? "1px solid #EEF1F8" : "none" }}>
                        <span className="text-[11px] font-bold w-[44px] shrink-0 tabular-nums" style={{ color: "#3478F6" }}>
                          {s.time}
                        </span>
                        <span className="flex-1 text-[12.5px] font-medium truncate" style={{ color: "#09152E" }}>
                          {s.title}
                        </span>
                        <span className="text-[10.5px] shrink-0" style={{ color: "#94A3B8" }}>
                          {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl px-6 py-10 text-center"
              style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <p className="text-[14px] font-semibold mb-3" style={{ color: "#09152E" }}>No registered events yet</p>
              <button onClick={() => navigate(`${BASE}/explore`)}
                className="text-[13px] font-bold" style={{ color: "#3478F6" }}>
                Browse events
              </button>
            </div>
          )}

          {/* Other expos to explore */}
          {unregisteredExpos.length > 0 && (
            <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <div className="px-5 py-3.5 flex items-center justify-between"
                style={{ borderBottom: "1px solid #F0F3FA" }}>
                <p className="text-[13px] font-black" style={{ color: "#09152E" }}>More to explore</p>
                <button onClick={() => navigate(`${BASE}/explore`)}
                  className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: "#3478F6" }}>
                  See all <ArrowRight size={11} />
                </button>
              </div>
              {unregisteredExpos.map((expo, i) => (
                <div key={expo._id}
                  className="flex gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                  style={{ borderBottom: i < unregisteredExpos.length - 1 ? "1px solid #F0F3FA" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => navigate(`${BASE}/explore`)}>
                  {expo.image
                    ? <img src={expo.image} alt={expo.title} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                    : <div className="w-11 h-11 rounded-lg shrink-0" style={{ background: "#E5EEFF" }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold leading-snug truncate" style={{ color: "#09152E" }}>
                      {expo.title}
                    </p>
                    <p className="text-[11.5px] mt-0.5" style={{ color: "#94A3B8" }}>
                      {formatDate(expo.dateStart)} · {expo.city}
                    </p>
                  </div>
                  <CategoryPill label={expo.category} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
