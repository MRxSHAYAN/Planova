import { useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import { USERS } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

const ROLES = ["All", "Admin", "Exhibitor", "Attendee"];

export default function Users() {
  const [search, setSearch] = useState("");
  const [filterRole, setRole] = useState("All");
  const [filterStatus, setStatus] = useState("All");

  const filtered = USERS.filter(u => {
    const matchS = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchR = filterRole === "All" || u.role === filterRole;
    const matchSt = filterStatus === "All" || u.status === filterStatus;
    return matchS && matchR && matchSt;
  });

  const roleCounts = { Admin: 0, Exhibitor: 0, Attendee: 0 };
  USERS.forEach(u => { if (roleCounts[u.role] !== undefined) roleCounts[u.role]++; });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Users & Roles</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">{USERS.length} total users — Attendees, Exhibitors, and Admins.</p>
      </div>

      {/* Security notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
        <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-amber-700">Role management requires backend authorization.</p>
          <p className="text-[12px] text-amber-600 mt-0.5">Role assignment is enforced on the server. Changes here require backend authorization.</p>
        </div>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          ["Admins",    roleCounts.Admin,    "bg-cyan-50 border-cyan-200 text-cyan-700"],
          ["Exhibitors",roleCounts.Exhibitor,"bg-violet-50 border-violet-200 text-violet-700"],
          ["Attendees", roleCounts.Attendee, "bg-blue-50 border-blue-200 text-blue-700"],
        ].map(([label, count, cls]) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${cls}`}>
            <div className="text-[22px] font-black">{count}</div>
            <div className="text-[11.5px] font-semibold mt-0.5 uppercase tracking-wide opacity-70">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterRole} onChange={e => setRole(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400">
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400">
          {["All","Active","Inactive"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["User","Email","Role","Status","Joined","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${
                          user.role === "Admin" ? "bg-cyan-500" : user.role === "Exhibitor" ? "bg-violet-500" : "bg-blue-500"
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{user.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={user.role} /></td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{user.joinedAt}</td>
                    <td className="px-4 py-3">
                      <button
                        disabled={user.role === "Admin"}
                        className={`px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-colors ${
                          user.role === "Admin"
                            ? "border-slate-100 text-slate-300 cursor-not-allowed"
                            : "border-slate-200 text-slate-500 hover:border-cyan-400 hover:text-cyan-500"
                        }`}
                        title={user.role === "Admin" ? "Cannot modify admin account" : "View user"}
                      >
                        {user.role === "Admin" ? "Protected" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
