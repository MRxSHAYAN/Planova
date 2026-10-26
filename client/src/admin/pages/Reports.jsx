import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

function StatBar({ label, value, max, color = "#6366F1" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px] mb-1">
        <span className="text-slate-600 font-medium truncate">{label}</span>
        <span className="text-slate-400 shrink-0 ml-2">{value} ({pct}%)</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
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
  const [stats,       setStats]       = useState({ total: 0, attendees: 0, exhibitors: 0, admins: 0, verified: 0, active: 0 });
  const [expos,       setExpos]       = useState([]);
  const [apps,        setApps]        = useState([]);
  const [booths,      setBooths]      = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [sessions,    setSessions]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/auth/stats", { headers }).then(r => r.json()),
      fetch("/api/expos/all", { headers }).then(r => r.json()),
      fetch("/api/applications", { headers }).then(r => r.json()),
      fetch("/api/booths", { headers }).then(r => r.json()),
      fetch("/api/registrations", { headers }).then(r => r.json()),
      fetch("/api/sessions", { headers }).then(r => r.json()),
    ]).then(async ([statsData, exposData, appsData, boothsData, regsData, sessionsData]) => {
      setStats(statsData || {});
      setExpos(Array.isArray(exposData) ? exposData : []);
      setApps(Array.isArray(appsData) ? appsData : []);
      setBooths(Array.isArray(boothsData) ? boothsData : []);
      setRegistrations(Array.isArray(regsData) ? regsData : []);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  const approved = apps.filter(a => a.status === "approved").length;
  const pending  = apps.filter(a => a.status === "pending").length;
  const rejected = apps.filter(a => a.status === "rejected").length;
  const totalApps = apps.length;

  const occupied  = booths.filter(b => b.status === "occupied").length;
  const available = booths.filter(b => b.status === "available").length;
  const pendingB  = booths.filter(b => b.status === "pending").length;
  const totalB    = booths.length;

  const confirmed = registrations.filter(r => r.status === "confirmed").length;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Live data from the database.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          ["Total Expos",       expos.length,     "text-blue-600 bg-blue-50"],
          ["Total Attendees",   stats.attendees,   "text-green-600 bg-green-50"],
          ["Approved Exhibitors", approved,        "text-violet-600 bg-violet-50"],
          ["Booths Occupied",   occupied,          "text-indigo-500 bg-indigo-50"],
        ].map(([label, val, cls]) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className={`text-[28px] font-black ${cls.split(" ")[0]}`}>{val}</div>
            <div className="text-[11.5px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Exhibitor Application Status">
          <div className="space-y-3">
            <StatBar label="Approved"  value={approved} max={totalApps} color="#22C55E" />
            <StatBar label="Pending"   value={pending}  max={totalApps} color="#6366F1" />
            <StatBar label="Rejected"  value={rejected} max={totalApps} color="#EF4444" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px]">
            {[["Approved",approved,"text-green-600"],["Pending",pending,"text-indigo-500"],["Rejected",rejected,"text-red-500"]].map(([l,v,c]) => (
              <div key={l} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className={`font-black text-[18px] ${c}`}>{v}</div>
                <div className="text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Booth Occupancy">
          <div className="space-y-3">
            <StatBar label="Occupied"  value={occupied}  max={totalB} color="#3B82F6" />
            <StatBar label="Pending"   value={pendingB}  max={totalB} color="#6366F1" />
            <StatBar label="Available" value={available} max={totalB} color="#22C55E" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px]">
            {[["Occupied",occupied,"text-blue-600"],["Pending",pendingB,"text-indigo-500"],["Available",available,"text-green-600"]].map(([l,v,c]) => (
              <div key={l} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className={`font-black text-[18px] ${c}`}>{v}</div>
                <div className="text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Attendee Registrations by Expo">
          <div className="space-y-3">
            {expos.length > 0 ? expos.map(expo => {
              const count = registrations.filter(r => (r.event?._id || r.event) === expo._id).length;
              if (count === 0) return null;
              return <StatBar key={expo._id} label={expo.title} value={count} max={registrations.length} color="#6366F1" />;
            }) : <p className="text-slate-400 text-[13px]">No expos yet.</p>}
          </div>
        </SectionCard>

        <SectionCard title="Session Count by Expo">
          <div className="space-y-3">
            {expos.length > 0 ? expos.map(expo => {
              const count = sessions.filter(s => (s.event?._id || s.event) === expo._id).length;
              if (count === 0) return null;
              return <StatBar key={expo._id} label={expo.title} value={count} max={sessions.length} color="#6366F1" />;
            }) : <p className="text-slate-400 text-[13px]">No sessions yet.</p>}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard title="Attendee Registration Status">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ["Confirmed", confirmed,  "text-green-600 bg-green-50"],
              ["Total Users", stats.total, "text-indigo-500 bg-indigo-50"],
              ["Verified",   stats.verified, "text-violet-600 bg-violet-50"],
            ].map(([label, val, cls]) => (
              <div key={label} className={`rounded-xl border border-slate-100 p-5 ${cls.split(" ")[1]}`}>
                <div className={`text-[28px] font-black ${cls.split(" ")[0]}`}>{val}</div>
                <div className="text-[12px] font-semibold text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
