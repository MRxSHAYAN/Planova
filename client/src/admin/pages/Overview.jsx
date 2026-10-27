import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRange, Users, ClipboardList, Map, TrendingUp, Mail, Loader2 } from "lucide-react";
import { EXPOS, APPLICATIONS, BOOTHS, ATTENDEES, ACTIVITY } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

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
      <div className="text-[26px] font-black text-slate-800 leading-none">{value}</div>
      <div className="text-[11.5px] font-semibold text-slate-500 mt-1 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
    </button>
  );
}

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, attendees: 0, exhibitors: 0, admins: 0, verified: 0, active: 0 });
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/auth/stats", { headers }).then(r => r.json()),
      fetch("/api/newsletter/subscribers", { headers }).then(r => r.json()),
    ])
      .then(([statsData, subsData]) => {
        setStats(statsData);
        setSubscribers(Array.isArray(subsData) ? subsData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalExpos = EXPOS.length;
  const publishedExpos = EXPOS.filter((e) => e.status === "Published").length;
  const totalAttendees = stats.attendees;
  const totalExhibitors = stats.exhibitors;
  const totalUsers = stats.total;
  const verifiedUsers = stats.verified;

  const recentApps = [...APPLICATIONS].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)).slice(0, 4);
  const recentAttendees = [...ATTENDEES].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt)).slice(0, 4);
  const upcomingExpos = EXPOS.filter((e) => e.status === "Published").slice(0, 3);

  const activityColors = { success: "bg-green-400", error: "bg-red-400", info: "bg-blue-400", warning: "bg-amber-400" };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.25rem] font-black text-slate-800">Overview</h1>
          <p className="text-slate-400 text-[13px] mt-0.5">Here's what's happening across Planova today.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard icon={Users}         label="Total Users"    value={totalUsers}     sub={`${verifiedUsers} verified`}              color="bg-green-50 text-green-600"   onClick={() => navigate("/admin/users")} />
        <MetricCard icon={Users}         label="Attendees"      value={totalAttendees} sub="registered"                               color="bg-blue-50 text-blue-600"     onClick={() => navigate("/admin/users")} />
        <MetricCard icon={Users}         label="Exhibitors"     value={totalExhibitors}sub="verified"                                 color="bg-violet-50 text-violet-600" onClick={() => navigate("/admin/users")} />
        <MetricCard icon={CalendarRange} label="Total Expos"    value={totalExpos}     sub={`${publishedExpos} published`}            color="bg-indigo-50 text-indigo-600"     onClick={() => navigate("/admin/expos")} />
        <MetricCard icon={ClipboardList} label="Pending Apps"   value={APPLICATIONS.filter(a => a.status === "Pending").length} sub="awaiting review" color="bg-amber-50 text-amber-600" onClick={() => navigate("/admin/applications")} />
        <MetricCard icon={Mail}          label="Subscribers"    value={subscribers.length} sub="newsletter"                          color="bg-pink-50 text-pink-600"     onClick={() => {}} />
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
          <div className="divide-y divide-slate-50">
            {recentApps.map(app => (
              <div key={app.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 shrink-0">
                  {app.company.substring(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-700 truncate">{app.company}</p>
                  <p className="text-[11.5px] text-slate-400 truncate">{app.expo}</p>
                </div>
                <StatusBadge status={app.status} />
                <span className="text-[11px] text-slate-400 shrink-0 hidden sm:block">{app.appliedAt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[13.5px] text-slate-700">Recent Activity</h2>
          </div>
          <div className="px-5 py-3 space-y-3">
            {ACTIVITY.map(a => (
              <div key={a.id} className="flex gap-2.5">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activityColors[a.type]}`} />
                <div>
                  <p className="text-[12.5px] text-slate-700 leading-snug">{a.action}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{a.user}  {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming expos */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[13.5px] text-slate-700">Upcoming Expos</h2>
            <button onClick={() => navigate("/admin/expos")}
              className="text-[12px] text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
              Manage 
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingExpos.map(expo => (
              <div key={expo.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <img src={expo.image} alt={expo.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-700 truncate">{expo.title}</p>
                  <p className="text-[11.5px] text-slate-400">{expo.startDate}  {expo.venue}</p>
                </div>
                <StatusBadge status={expo.status} />
              </div>
            ))}
          </div>
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
          <div className="divide-y divide-slate-50">
            {recentAttendees.map(att => (
              <div key={att.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {att.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-700 truncate">{att.name}</p>
                  <p className="text-[11.5px] text-slate-400 truncate">{att.expo}</p>
                </div>
                <StatusBadge status={att.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booth summary bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[13.5px] text-slate-700">Booth Occupancy Summary</h2>
          <button onClick={() => navigate("/admin/booths")}
            className="text-[12px] text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
            Manage booths 
          </button>
        </div>
        <div className="space-y-3">
          {EXPOS.filter(e => e.status === "Published").map(expo => {
            const total = expo.totalBooths;
            const occupied = expo.occupiedBooths;
            const pct = Math.round((occupied / total) * 100);
            return (
              <div key={expo.id}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-slate-600 font-medium truncate max-w-[60%]">{expo.title}</span>
                  <span className="text-slate-400 shrink-0">{occupied}/{total} occupied</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: pct > 80 ? "#22C55E" : pct > 50 ? "#6366F1" : "#94A3B8" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter Subscribers */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-pink-500" />
            <h2 className="font-bold text-[13.5px] text-slate-700">Newsletter Subscribers</h2>
          </div>
          <span className="text-[12px] font-semibold text-slate-400">{subscribers.length} total</span>
        </div>
        {subscribers.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-slate-400">No subscribers yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 max-h-[320px] overflow-y-auto">
            {subscribers.map(s => (
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
