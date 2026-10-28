import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Users, CalendarRange, LayoutGrid, TicketCheck, Mic2 } from "lucide-react";

function Bar({ label, value, max, color = "#6366F1", showZero = false }) {
  if (!showZero && value === 0) return null;
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px] mb-1">
        <span className="text-slate-600 font-medium truncate max-w-[55%]">{label}</span>
        <span className="text-slate-400 shrink-0 ml-2 tabular-nums">{value} <span className="text-slate-300">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct || 1}%`, background: color }} />
      </div>
    </div>
  );
}

function KPI({ label, value, color, icon: Icon }) {
  return (
    <div className={`rounded-xl border p-5 text-center ${color}`}>
      {Icon && <Icon size={18} className="mx-auto mb-2 opacity-60" />}
      <div className="text-[30px] font-black leading-none">{value ?? "—"}</div>
      <div className="text-[11.5px] font-semibold mt-1.5 uppercase tracking-wide opacity-70">{label}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-bold text-[13.5px] text-slate-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function Reports() {
  const [stats,    setStats]    = useState({});
  const [expos,    setExpos]    = useState([]);
  const [apps,     setApps]     = useState([]);
  const [booths,   setBooths]   = useState([]);
  const [regs,     setRegs]     = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/auth/stats",      { headers: h }).then(r => r.json()),
      fetch("/api/expos/all",       { headers: h }).then(r => r.json()),
      fetch("/api/applications",    { headers: h }).then(r => r.json()),
      fetch("/api/booths",          { headers: h }).then(r => r.json()),
      fetch("/api/registrations",   { headers: h }).then(r => r.json()),
      fetch("/api/sessions",        { headers: h }).then(r => r.json()),
    ]).then(([s, ex, ap, bo, rg, se]) => {
      setStats(s || {});
      setExpos(Array.isArray(ex) ? ex : []);
      setApps(Array.isArray(ap) ? ap : []);
      setBooths(Array.isArray(bo) ? bo : []);
      setRegs(Array.isArray(rg) ? rg : []);
      setSessions(Array.isArray(se) ? se : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  // Applications
  const appApproved = apps.filter(a => a.status === "approved").length;
  const appPending  = apps.filter(a => a.status === "pending").length;
  const appRejected = apps.filter(a => a.status === "rejected").length;

  // Booths
  const boothOccupied  = booths.filter(b => b.status === "occupied").length;
  const boothAvailable = booths.filter(b => b.status === "available").length;
  const boothPending   = booths.filter(b => b.status === "pending").length;

  // Expos by status
  const expoPublished = expos.filter(e => e.status === "published" || e.status === "upcoming").length;
  const expoArchived  = expos.filter(e => e.status === "archived").length;

  // per-expo counts — use String() to avoid ObjectId comparison issues
  const regsByExpo = expos.map(expo => ({
    title: expo.title,
    count: regs.filter(r => String(r.event?._id || r.event) === String(expo._id)).length,
  })).sort((a, b) => b.count - a.count);

  // Per-expo session counts
  const sessionsByExpo = expos.map(expo => ({
    title: expo.title,
    count: sessions.filter(s => String(s.event?._id || s.event) === String(expo._id)).length,
  })).sort((a, b) => b.count - a.count);

  // Sessions by type
  const sessionTypes = ["Keynote", "Panel", "Workshop", "Talk"];
  const typeColors   = { Keynote: "#09152E", Panel: "#3478F6", Workshop: "#D97706", Talk: "#12875A" };

  // Registrations over time (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    };
  });
  const regsByMonth = months.map(m => ({
    label: m.label,
    count: regs.filter(r => {
      const d = new Date(r.registeredAt || r.createdAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === m.key;
    }).length,
  }));
  const maxMonthReg = Math.max(...regsByMonth.map(m => m.count), 1);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Live data from the database.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KPI icon={CalendarRange} label="Expos"          value={expos.length}      color="bg-indigo-50 text-indigo-600 border-indigo-100" />
        <KPI icon={Users}         label="Attendees"      value={stats.attendees}   color="bg-blue-50 text-blue-600 border-blue-100" />
        <KPI icon={Users}         label="Exhibitors"     value={stats.exhibitors}  color="bg-violet-50 text-violet-600 border-violet-100" />
        <KPI icon={TicketCheck}   label="Registrations"  value={regs.length}       color="bg-cyan-50 text-cyan-600 border-cyan-100" />
        <KPI icon={LayoutGrid}    label="Booths"         value={booths.length}     color="bg-green-50 text-green-600 border-green-100" />
        <KPI icon={Mic2}          label="Sessions"       value={sessions.length}   color="bg-amber-50 text-amber-700 border-amber-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        {/* Application Status */}
        <Card title="Exhibitor Application Status">
          <div className="space-y-3 mb-5">
            <Bar label="Approved"  value={appApproved} max={apps.length} color="#22C55E" showZero />
            <Bar label="Pending"   value={appPending}  max={apps.length} color="#F59E0B" showZero />
            <Bar label="Rejected"  value={appRejected} max={apps.length} color="#EF4444" showZero />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Approved", appApproved, "text-green-600 bg-green-50"],
              ["Pending",  appPending,  "text-amber-600 bg-amber-50"],
              ["Rejected", appRejected, "text-red-500 bg-red-50"]].map(([l, v, cls]) => (
              <div key={l} className={`rounded-lg p-3 border border-slate-100 ${cls.split(" ")[1]}`}>
                <div className={`font-black text-[20px] ${cls.split(" ")[0]}`}>{v}</div>
                <div className="text-slate-400 text-[11.5px]">{l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Booth Occupancy */}
        <Card title="Booth Occupancy">
          <div className="space-y-3 mb-5">
            <Bar label="Occupied"  value={boothOccupied}  max={booths.length} color="#3B82F6" showZero />
            <Bar label="Pending"   value={boothPending}   max={booths.length} color="#6366F1" showZero />
            <Bar label="Available" value={boothAvailable} max={booths.length} color="#22C55E" showZero />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Occupied", boothOccupied, "text-blue-600 bg-blue-50"],
              ["Pending",  boothPending,  "text-indigo-600 bg-indigo-50"],
              ["Available",boothAvailable,"text-green-600 bg-green-50"]].map(([l, v, cls]) => (
              <div key={l} className={`rounded-lg p-3 border border-slate-100 ${cls.split(" ")[1]}`}>
                <div className={`font-black text-[20px] ${cls.split(" ")[0]}`}>{v}</div>
                <div className="text-slate-400 text-[11.5px]">{l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Registrations by Expo */}
        <Card title="Attendee Registrations by Expo">
          {regsByExpo.every(e => e.count === 0) ? (
            <p className="text-slate-400 text-[13px]">No registrations yet.</p>
          ) : (
            <div className="space-y-3">
              {regsByExpo.map(e => (
                <Bar key={e.title} label={e.title} value={e.count} max={regs.length} color="#6366F1" />
              ))}
            </div>
          )}
        </Card>

        {/* Sessions by Expo */}
        <Card title="Sessions by Expo">
          {sessionsByExpo.every(e => e.count === 0) ? (
            <p className="text-slate-400 text-[13px]">No sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {sessionsByExpo.map(e => (
                <Bar key={e.title} label={e.title} value={e.count} max={sessions.length} color="#3478F6" />
              ))}
            </div>
          )}
        </Card>

        {/* Sessions by type */}
        <Card title="Sessions by Type">
          <div className="space-y-3 mb-5">
            {sessionTypes.map(type => (
              <Bar key={type} label={type} value={sessions.filter(s => s.type === type).length}
                max={sessions.length} color={typeColors[type]} showZero />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {sessionTypes.map(type => (
              <div key={type} className="rounded-lg p-3 border border-slate-100 bg-slate-50">
                <div className="font-black text-[18px]" style={{ color: typeColors[type] }}>
                  {sessions.filter(s => s.type === type).length}
                </div>
                <div className="text-slate-400 text-[11px]">{type}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Expo status breakdown */}
        <Card title="Expo Status Breakdown">
          <div className="space-y-3 mb-5">
            <Bar label="Active / Upcoming" value={expoPublished} max={expos.length} color="#22C55E" showZero />
            <Bar label="Archived"          value={expoArchived}  max={expos.length} color="#94A3B8" showZero />
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg p-4 border border-slate-100 bg-green-50">
              <div className="font-black text-[24px] text-green-600">{expoPublished}</div>
              <div className="text-slate-400 text-[11.5px]">Active</div>
            </div>
            <div className="rounded-lg p-4 border border-slate-100 bg-slate-50">
              <div className="font-black text-[24px] text-slate-400">{expoArchived}</div>
              <div className="text-slate-400 text-[11.5px]">Archived</div>
            </div>
          </div>
        </Card>

      </div>

      {/* Registrations over time */}
      <Card title="Registrations Over the Last 6 Months">
        <div className="flex items-end gap-3 h-32">
          {regsByMonth.map(m => {
            const heightPct = Math.round((m.count / maxMonthReg) * 100);
            return (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold text-slate-500 tabular-nums">{m.count || ""}</span>
                <div className="w-full rounded-t-md transition-all duration-500"
                  style={{ height: `${Math.max(heightPct, m.count > 0 ? 8 : 2)}%`, background: m.count > 0 ? "#6366F1" : "#E2E8F0", minHeight: 4 }} />
                <span className="text-[10.5px] text-slate-400">{m.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* User summary */}
      <div className="mt-5">
        <Card title="User Summary">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              ["Total Users",   stats.total,    "text-slate-700 bg-slate-50"],
              ["Verified",      stats.verified, "text-indigo-600 bg-indigo-50"],
              ["Active",        stats.active,   "text-green-600 bg-green-50"],
              ["Admins",        stats.admins,   "text-rose-500 bg-rose-50"],
            ].map(([label, val, cls]) => (
              <div key={label} className={`rounded-xl border border-slate-100 p-5 ${cls.split(" ")[1]}`}>
                <div className={`text-[28px] font-black ${cls.split(" ")[0]}`}>{val ?? 0}</div>
                <div className="text-[12px] font-semibold text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
