import { useState, useEffect } from "react";
import { Search, Loader2, Check, X } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

const ROLES = ["All", "Admin", "Exhibitor", "Attendee"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toggling, setToggling] = useState(null);

  function fetchUsers() {
    const token = localStorage.getItem("planova_token");
    setLoading(true);
    fetch("/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then((data) => { setUsers(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchUsers(); }, []);

  async function toggleStatus(user) {
    setToggling(user._id);
    try {
      const token = localStorage.getItem("planova_token");
      const res = await fetch(`/api/auth/users/${user._id}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setToggling(null);
    }
  }

  const filtered = users.filter((u) => {
    const matchS = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchR = filterRole === "All" || u.role === filterRole.toLowerCase();
    const matchSt = filterStatus === "All" || (filterStatus === "Active" ? u.isActive : !u.isActive);
    return matchS && matchR && matchSt;
  });

  const counts = {
    Admin: users.filter((u) => u.role === "admin").length,
    Exhibitor: users.filter((u) => u.role === "exhibitor").length,
    Attendee: users.filter((u) => u.role === "attendee").length,
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-[14px] font-semibold text-red-600 mb-2">{error}</p>
      <button onClick={fetchUsers} className="text-[13px] font-bold text-indigo-500">Try again</button>
    </div>
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Users & Roles</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">{users.length} total users  real data from database.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          ["Admins", counts.Admin, "bg-indigo-50 border-indigo-200 text-indigo-700"],
          ["Exhibitors", counts.Exhibitor, "bg-violet-50 border-violet-200 text-violet-700"],
          ["Attendees", counts.Attendee, "bg-blue-50 border-blue-200 text-blue-700"],
        ].map(([label, count, cls]) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${cls}`}>
            <div className="text-[22px] font-black">{count}</div>
            <div className="text-[11.5px] font-semibold mt-0.5 uppercase tracking-wide opacity-70">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none">
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none">
          {["All", "Active", "Inactive"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

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
                  {["User", "Email", "Role", "Status", "Verified", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${
                            u.role === "admin" ? "bg-indigo-500" : u.role === "exhibitor" ? "bg-violet-500" : "bg-blue-500"
                          }`}>
                            {u.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <span className="font-semibold text-slate-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.role} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        u.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      }`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.isVerified ? (
                        <span className="flex items-center gap-1 text-green-600"><Check size={12} /> Verified</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600"><X size={12} /> Unverified</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin" ? (
                        <span className="text-[12px] text-slate-300 font-semibold">Protected</span>
                      ) : (
                        <button onClick={() => toggleStatus(u)} disabled={toggling === u._id}
                          className="px-3 py-1.5 rounded-lg border text-[12px] font-semibold border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors disabled:opacity-50">
                          {toggling === u._id ? "" : u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
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
