import { EXPOS, APPLICATIONS, BOOTHS, ATTENDEES, SESSIONS } from "../data/adminData";

function StatBar({ label, value, max, color = "#F97316" }) {
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
  const approved  = APPLICATIONS.filter(a => a.status === "Approved").length;
  const pending   = APPLICATIONS.filter(a => a.status === "Pending").length;
  const rejected  = APPLICATIONS.filter(a => a.status === "Rejected").length;
  const totalApps = APPLICATIONS.length;

  const occupied  = BOOTHS.filter(b => b.status === "Occupied").length;
  const pendingB  = BOOTHS.filter(b => b.status === "Pending").length;
  const available = BOOTHS.filter(b => b.status === "Available").length;
  const totalB    = BOOTHS.length;

  const confirmed = ATTENDEES.filter(a => a.status === "Confirmed").length;
  const cancelledA= ATTENDEES.filter(a => a.status === "Cancelled").length;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Operational summary across all expos. Connect a real backend for live data.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          ["Total Expos",       EXPOS.length,      "text-blue-600 bg-blue-50"],
          ["Total Attendees",   ATTENDEES.length,   "text-green-600 bg-green-50"],
          ["Approved Exhibitors",approved,           "text-violet-600 bg-violet-50"],
          ["Booths Occupied",   occupied,            "text-orange-500 bg-orange-50"],
        ].map(([label, val, cls]) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className={`text-[28px] font-black ${cls.split(" ")[0]}`}>{val}</div>
            <div className="text-[11.5px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Application status */}
        <SectionCard title="Exhibitor Application Status">
          <div className="space-y-3">
            <StatBar label="Approved"  value={approved} max={totalApps} color="#22C55E" />
            <StatBar label="Pending"   value={pending}  max={totalApps} color="#F97316" />
            <StatBar label="Rejected"  value={rejected} max={totalApps} color="#EF4444" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px]">
            {[["Approved",approved,"text-green-600"],["Pending",pending,"text-orange-500"],["Rejected",rejected,"text-red-500"]].map(([l,v,c])=>(
              <div key={l} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className={`font-black text-[18px] ${c}`}>{v}</div>
                <div className="text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Booth occupancy */}
        <SectionCard title="Booth Occupancy">
          <div className="space-y-3">
            <StatBar label="Occupied"  value={occupied}  max={totalB} color="#3B82F6" />
            <StatBar label="Pending"   value={pendingB}  max={totalB} color="#F97316" />
            <StatBar label="Available" value={available} max={totalB} color="#22C55E" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px]">
            {[["Occupied",occupied,"text-blue-600"],["Pending",pendingB,"text-orange-500"],["Available",available,"text-green-600"]].map(([l,v,c])=>(
              <div key={l} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className={`font-black text-[18px] ${c}`}>{v}</div>
                <div className="text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Registrations by expo */}
        <SectionCard title="Attendee Registrations by Expo">
          <div className="space-y-3">
            {EXPOS.filter(e=>e.attendees>0).map(expo => (
              <StatBar key={expo.id} label={expo.title} value={expo.attendees} max={5000} color="#6366F1" />
            ))}
          </div>
        </SectionCard>

        {/* Session popularity */}
        <SectionCard title="Session Attendance">
          <div className="space-y-3">
            {SESSIONS.slice(0,5).map(s => (
              <StatBar key={s.id} label={s.title} value={s.attendees} max={500} color="#F97316" />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Attendee registration status */}
      <div className="mt-5">
        <SectionCard title="Attendee Registration Status">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ["Confirmed", confirmed,  "text-green-600 bg-green-50"],
              ["Pending",   ATTENDEES.filter(a=>a.status==="Pending").length, "text-orange-500 bg-orange-50"],
              ["Cancelled", cancelledA, "text-red-500 bg-red-50"],
            ].map(([label, val, cls]) => (
              <div key={label} className={`rounded-xl border border-slate-100 p-5 ${cls.split(" ")[1]}`}>
                <div className={`text-[28px] font-black ${cls.split(" ")[0]}`}>{val}</div>
                <div className="text-[12px] font-semibold text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Integration notice */}
      <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 text-[13px] text-blue-700">
        📊 <strong>Note:</strong> All figures above are from frontend mock data. Connect real backend API endpoints to display live analytics.
      </div>
    </div>
  );
}
