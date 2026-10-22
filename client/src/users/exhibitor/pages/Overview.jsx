import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { CURRENT_COMPANY, APPLICATIONS, BOOTHS, EXPOS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";

const BASE = "/users/dashboard/exhibitor";

export default function Overview() {
  const navigate = useNavigate();
  const approved      = APPLICATIONS.filter((a) => a.status === "approved").length;
  const pending       = APPLICATIONS.filter((a) => a.status === "pending").length;
  const rejected      = APPLICATIONS.filter((a) => a.status === "rejected").length;
  const latestApp     = APPLICATIONS[0];
  const assignedBooth = BOOTHS[0] || null;
  const upcomingExpo  = EXPOS.find((e) => e.applicationOpen && e.featured);
  const profilePct    = CURRENT_COMPANY.profileComplete;

  return (
    <div className="space-y-5">

      {/* Welcome row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium" style={{ color: "#3478F6" }}>Welcome back,</p>
          <h2 className="text-[22px] font-black leading-tight mt-0.5" style={{ color: "#09152E" }}>
            {CURRENT_COMPANY.name}
          </h2>
          <p className="text-[13px] mt-1" style={{ color: "#64748B" }}>
            {approved} approved · {pending} pending · {rejected} not accepted
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => navigate(`${BASE}/explore`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: "#fff", border: "1px solid #E8EEF8", color: "#3E506D" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3478F6")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E8EEF8")}>
            Explore Expos
          </button>
          <button onClick={() => navigate(`${BASE}/applications`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
            Applications
          </button>
        </div>
      </div>

      {/* Profile completion bar */}
      {profilePct < 100 && (
        <div className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: "#fff", border: "1.5px solid #DCEAFF" }}>
          <div className="flex-1">
            <p className="text-[13px] font-bold mb-1" style={{ color: "#09152E" }}>Complete your company profile</p>
            <p className="text-[12px]" style={{ color: "#64748B" }}>
              {profilePct}% complete — add your logo and website to increase visibility with organizers.
            </p>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "#E8EEF8", maxWidth: "320px" }}>
              <div className="h-full rounded-full" style={{ width: `${profilePct}%`, background: "#3478F6" }} />
            </div>
          </div>
          <button onClick={() => navigate(`${BASE}/profile`)}
            className="shrink-0 px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
            Complete Profile
          </button>
        </div>
      )}

      {/* Stats strip */}
      <div className="rounded-xl px-5 py-4 flex flex-wrap gap-x-8 gap-y-3"
        style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {[
          { icon: FileText,     label: "Applications", value: APPLICATIONS.length, color: "#3478F6" },
          { icon: CheckCircle2, label: "Approved",      value: approved,           color: "#12875A" },
          { icon: Clock,        label: "Pending",       value: pending,            color: "#D97706" },
          { icon: Bell,         label: "Unread",        value: unread,             color: unread > 0 ? "#D97706" : "#09152E" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={15} style={{ color, flexShrink: 0 }} />
            <span className="text-[13px] font-semibold" style={{ color: "#09152E" }}>{value}</span>
            <span className="text-[12.5px]" style={{ color: "#94A3B8" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Two-col body */}
      <div className="grid lg:grid-cols-5 gap-5">

        <div className="lg:col-span-3 space-y-4">

          {/* Latest application */}
          {latestApp && (
            <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <div className="relative h-[120px] overflow-hidden" style={{ background: "#E5EEFF" }}>
                <img src={latestApp.expoImage} alt={latestApp.expoTitle} className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(9,21,46,0.65) 0%, transparent 55%)" }} />
                <div className="absolute bottom-3 left-4">
                  <StatusBadge status={latestApp.status} />
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>
                  Latest application
                </p>
                <h3 className="text-[15px] font-black leading-snug mb-2" style={{ color: "#09152E" }}>
                  {latestApp.expoTitle}
                </h3>
                <p className="text-[12px] mb-3" style={{ color: "#64748B" }}>
                  Applied {latestApp.appliedDateLabel} · {latestApp.expoDate}
                </p>
                {latestApp.organiserNote && (
                  <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: "#F5F8FF" }}>
                    <p className="text-[11.5px] font-semibold mb-0.5" style={{ color: "#3478F6" }}>Organizer note</p>
                    <p className="text-[12.5px]" style={{ color: "#3E506D" }}>{latestApp.organiserNote}</p>
                  </div>
                )}
                <button onClick={() => navigate(`${BASE}/applications`)}
                  className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
                  All applications <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Booth */}
          {assignedBooth ? (
            <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>
                    Your booth
                  </p>
                  <h3 className="text-[15px] font-black" style={{ color: "#09152E" }}>
                    Booth {assignedBooth.boothNumber}
                  </h3>
                  <p className="text-[12.5px] mt-0.5" style={{ color: "#64748B" }}>
                    {assignedBooth.hall} · {assignedBooth.size} · {assignedBooth.type}
                  </p>
                </div>
                <StatusBadge status={assignedBooth.status} />
              </div>
              <div className="rounded-lg p-3" style={{ background: "#F5F8FF" }}>
                <p className="text-[11.5px] font-semibold mb-0.5" style={{ color: "#64748B" }}>Setup deadline</p>
                <p className="text-[13px] font-bold" style={{ color: "#09152E" }}>{assignedBooth.setupDeadline}</p>
              </div>
              <button onClick={() => navigate(`${BASE}/booths`)}
                className="mt-3 flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
                Booth details <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="rounded-xl p-5 flex items-start gap-3"
              style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <AlertCircle size={15} className="shrink-0 mt-0.5" style={{ color: "#94A3B8" }} />
              <div>
                <p className="text-[13px] font-semibold mb-0.5" style={{ color: "#09152E" }}>No booth assigned yet</p>
                <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
                  Once an organizer approves your application and assigns a booth, it will appear here.
                </p>
              </div>
            </div>
          )}

          {/* Open expo */}
          {upcomingExpo && (
            <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <div className="px-5 py-3.5 flex items-center justify-between"
                style={{ borderBottom: "1px solid #F0F3FA" }}>
                <p className="text-[13px] font-black" style={{ color: "#09152E" }}>Open for applications</p>
                <button onClick={() => navigate(`${BASE}/explore`)}
                  className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: "#3478F6" }}>
                  Browse all <ArrowRight size={11} />
                </button>
              </div>
              <div className="flex gap-4 p-4">
                <img src={upcomingExpo.image} alt={upcomingExpo.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0" style={{ background: "#E5EEFF" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold leading-snug mb-1" style={{ color: "#09152E" }}>{upcomingExpo.title}</p>
                  <p className="text-[12px]" style={{ color: "#64748B" }}>{upcomingExpo.date} · {upcomingExpo.location}</p>
                  <p className="text-[11.5px] mt-1" style={{ color: "#94A3B8" }}>
                    {upcomingExpo.availableBooths} booths left · Deadline {upcomingExpo.applicationDeadline}
                  </p>
                </div>
                <button onClick={() => navigate(`${BASE}/explore`)}
                  className="shrink-0 self-center px-3 py-1.5 rounded-lg text-[12px] font-bold text-white transition-colors"
                  style={{ background: "#3478F6" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FE0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#3478F6")}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications panel */}
        <div className="lg:col-span-2">
          <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
            <div className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid #F0F3FA" }}>
              <p className="text-[13px] font-black" style={{ color: "#09152E" }}>Recent alerts</p>
              <button onClick={() => navigate(`${BASE}/notifications`)}
                className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: "#3478F6" }}>
                All <ArrowRight size={11} />
              </button>
            </div>
            {recentNotifs.length > 0 ? (
              <>
                {recentNotifs.map((n, i) => (
                  <div key={n.id} className="px-5 py-4"
                    style={{ borderBottom: i < recentNotifs.length - 1 ? "1px solid #F5F7FB" : "none" }}>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
                        style={{ background: NOTIF_DOTS[n.type] || "#94A3B8" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-snug" style={{ color: "#09152E" }}>{n.title}</p>
                        <p className="text-[12px] mt-0.5 line-clamp-2" style={{ color: "#64748B" }}>{n.message}</p>
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
              </>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-[13px]" style={{ color: "#94A3B8" }}>No unread alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
