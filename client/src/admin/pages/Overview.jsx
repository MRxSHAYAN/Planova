import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarRange, Users, ClipboardList, LayoutGrid,
  TrendingUp, Mail, Loader2, TicketCheck, Mic2,
} from "lucide-react";

function MetricCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
        <TrendingUp size={13} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
      </div>
      <div className="text-[26px] font-black text-slate-800 leading-none">{value ?? "—"}</div>
      <div className="text-[11.5px] font-semibold text-slate-500 mt-1 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
    </button>
  );
}

function StatusDot({ status }) {
  const map = {
    approved: "bg-green-400", pending: "bg-amber-400", rejected: "bg-red-400",
    published: "bg-green-400", upcoming: "bg-blue-400", archived: "bg-slate-300",
    confirmed: "bg-green-400",
  };
  const cls = map[status?.toLowerCase()] || "bg-slate-300";
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${cls}`} />;
}

function StatusPill({ status }) {
  const map = {
    approved:  "bg-green-50 text-green-700 border-green-100",
    pending:   "bg-amber-50 text-amber-700 border-amber-100",
    rejected:  "bg-red-50 text-red-600 border-red-100",
    published: "bg-green-50 text-green-700 border-green-100",
    upcoming:  "bg-blue-50 text-blue-700 border-blue-100",
    archived:  "bg-slate-50 text-slate-500 border-slate-100",
    confirmed: "bg-green-50 text-green-700 border-green-100",
  };
  const cls = map[status?.toLowerCase()] || "bg-slate-50 text-slate-500 border-slate-100";
  return (
    <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${cls} capitalize`}>
      {status}
    </span>
  );
}

export default function Overview() {
  const navigate = useNavigate();

  const [stats,    setStats]    = useState(null);
  const [expos,    setExpos]    = useState([]);
  const [apps,     setApps]     = useState([]);
  const [booths,   setBooths]   = useState([]);
  const [regs,     setRegs]     = useState([]);
  const [sessions, setSessions] = useState([]);
  const [subs,     setSubs]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    const h = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/auth/stats",              { headers: h }).then(r => r.json()),
      fetch("/api/expos/all",               { headers: h }).then(r => r.json()),
      fetch("/api/applications",            { headers: h }).then(r => r.json()),
      fetch("/api/booths",                  { headers: h }).then(r => r.json()),
      fetch("/api/registrations",           { headers: h }).then(r => r.json()),
      fetch("/api/sessions",                { headers: h }).then(r => r.json()),
      fetch("/api/newsletter/subscribers",  { headers: h }).then(r => r.json()),
    ])
      .then(([s, ex, ap, bo, rg, se, ns]) => {
        setStats(s || {});
        setExpos(Array.isArray(ex) ? ex : []);
        setApps(Array.isArray(ap) ? ap : []);
        setBooths(Array.isArray(bo) ? bo : []);
        setRegs(Array.isArray(rg) ? rg : []);
        setSessions(Array.isArray(se) ? se : []);
        setSubs(Array.isArray(ns) ? ns : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  const pendingApps   = apps.filter(a => a.status === "pending").length;
  const approvedApps  = apps.filter(a => a.status === "approved").length;
  const occupiedBooths = booths.filter(b => b.status === "occupied").length;
  const publishedExpos = expos.filter(e => e.status === "published" || e.status === "upcoming").length;

  const recentApps   = [...apps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentRegs   = [...regs].sort((a, b) => new Date(b.registeredAt || b.createdAt) - new Date(a.registeredAt || a.createdAt)).slice(0, 5);
  const upcomingExpos = expos.filter(e => e.status !== "archived").slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[1.25rem] font-black text-slate-800">Overview</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Live data across Planova.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        <MetricCard icon={Users}         label="Total Users"    value={stats?.total}      sub={`${stats?.verified ?? 0} verified`}    color="bg-slate-100 text-slate-600"   onClick={() => navigate("/admin/users")} />
        <MetricCard icon={Users}         label="Attendees"      value={stats?.attendees}  sub="registered"                            color="bg-blue-50 text-blue-600"      onClick={() => navigate("/admin/users")} />
        <MetricCard icon={Users}         label="Exhibitors"     value={stats?.exhibitors} sub="verified"                              color="bg-violet-50 text-violet-600"  onClick={() => navigate("/admin/users")} />
        <MetricCard icon={CalendarRange} label="Total Expos"    value={expos.length}      sub={`${publishedExpos} active`}            color="bg-indigo-50 text-indigo-600"  onClick={() => navigate("/admin/expos")} />
        <MetricCard icon={ClipboardList} label="Pending Apps"   value={pendingApps}       sub={`${approvedApps} approved`}            color="bg-amber-50 text-amber-600"    onClick={() => navigate("/admin/applications")} />
        <MetricCard icon={LayoutGrid}    label="Booths"         value={booths.length}     sub={`${occupiedBooths} occupied`}          color="bg-green-50 text-green-600"    onClick={() => navigate("/admin/booths")} />
        <MetricCard icon={TicketCheck}   label="Registrations"  value={regs.length}       sub="total attendee reg."                   color="bg-cyan-50 text-cyan-600"      onClick={() => navigate("/admin/attendees")} />
        <MetricCard icon={Mail}          label="Subscribers"    value={subs.length}       sub="newsletter"                            color="bg-pink-50 text-pink-600"      onClick={() => {}} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[13.5px] text-slate-700">Recent Applications</h2>
            <button onClick={() => navigate("/admin/applications")}
              className="text-[12px] text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
              View all
            </button>
          </div>
          {recentApps.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">No applications yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentApps.map(app => (
                <div key={app._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 shrink-0">
                    {(app.companyName || app.company || "?").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700 truncate">{app.companyName || app.company || "Unknown"}</p>
                    <p className="text-[11.5px] text-slate-400 truncate">{app.expo?.title || "—"}</p>
                  </div>
                  <StatusPill status={app.status} />
                  <span className="text-[11px] text-slate-400 shrink-0 hidden sm:block">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sessions summary */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Mic2 size={14} className="text-indigo-400" />
            <h2 className="font-bold text-[13.5px] text-slate-700">Sessions Overview</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <div className="text-[36px] font-black text-indigo-600">{sessions.length}</div>
              <div className="text-[12px] text-slate-400 font-medium">total sessions</div>
            </div>
            {/* Breakdown by type */}
            {["Keynote", "Panel", "Workshop", "Talk"].map(type => {
              const count = sessions.filter(s => s.type === type).length;
              const pct   = sessions.length > 0 ? Math.round((count / sessions.length) * 100) : 0;
              const colors = { Keynote: "#09152E", Panel: "#3478F6", Workshop: "#D97706", Talk: "#12875A" };
              return (
                <div key={type}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-slate-600 font-medium">{type}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[type] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming expos */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[13.5px] text-slate-700">Expos</h2>
            <button onClick={() => navigate("/admin/expos")}
              className="text-[12px] text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
              Manage
            </button>
          </div>
          {upcomingExpos.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">No expos yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {upcomingExpos.map(expo => (
                <div key={expo._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  {expo.image ? (
                    <img src={expo.image} alt={expo.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <CalendarRange size={14} className="text-indigo-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700 truncate">{expo.title}</p>
                    <p className="text-[11.5px] text-slate-400">
                      {expo.dateStart ? new Date(expo.dateStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      {expo.city ? `  \u00b7  ${expo.city}` : ""}
                    </p>
                  </div>
                  <StatusPill status={expo.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent registrations */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[13.5px] text-slate-700">Recent Registrations</h2>
            <button onClick={() => navigate("/admin/attendees")}
              className="text-[12px] text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
              View all
            </button>
          </div>
          {recentRegs.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-slate-400">No registrations yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentRegs.map(reg => (
                <div key={reg._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                    {(reg.user?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700 truncate">{reg.user?.name || "Unknown"}</p>
                    <p className="text-[11.5px] text-slate-400 truncate">{reg.event?.title || "—"}</p>
                  </div>
                  <StatusPill status={reg.status || "confirmed"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booth occupancy per expo */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[13.5px] text-slate-700">Booth Occupancy by Expo</h2>
          <button onClick={() => navigate("/admin/booths")}
            className="text-[12px] text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
            Manage booths
          </button>
        </div>
        {expos.length === 0 ? (
          <p className="text-[13px] text-slate-400">No expos yet.</p>
        ) : (
          <div className="space-y-3">
            {expos.map(expo => {
              const expoBooths  = booths.filter(b => String(b.expo?._id || b.expo) === String(expo._id));
              const total       = expoBooths.length;
              const occupied    = expoBooths.filter(b => b.status === "occupied").length;
              const pct         = total > 0 ? Math.round((occupied / total) * 100) : 0;
              return (
                <div key={expo._id}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="text-slate-600 font-medium truncate max-w-[60%]">{expo.title}</span>
                    <span className="text-slate-400 shrink-0">{occupied}/{total} occupied</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: pct > 80 ? "#22C55E" : pct > 50 ? "#6366F1" : "#94A3B8" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Newsletter Subscribers */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-pink-500" />
            <h2 className="font-bold text-[13.5px] text-slate-700">Newsletter Subscribers</h2>
          </div>
          <span className="text-[12px] font-semibold text-slate-400">{subs.length} total</span>
        </div>
        {subs.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-slate-400">No subscribers yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 max-h-[280px] overflow-y-auto">
            {subs.map(s => (
              <div key={s._id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                    <Mail size={12} className="text-pink-400" />
                  </div>
                  <span className="text-[13px] text-slate-700">{s.email}</span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
