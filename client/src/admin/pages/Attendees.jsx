import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AttendeeDetail({ reg, onClose }) {
  if (!reg) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[14px] font-black text-white shrink-0">
            {reg.user?.name?.charAt(0) || "?"}
          </div>
          <div className="flex-1">
            <h2 className="font-black text-slate-800">{reg.user?.name || "—"}</h2>
            <p className="text-[12.5px] text-slate-400">{reg.user?.email}</p>
          </div>
          <StatusBadge status={reg.status} />
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors ml-1">
            <X size={14} />
          </button>
        </div>
        <div className="p-5 space-y-0">
          {[
            ["Registered Expo",  reg.event?.title || "—"],
            ["Registration Date", formatDate(reg.registeredAt)],
            ["Status",           reg.status],
            ["City",             reg.user?.city || "—"],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-3 py-2.5 border-b border-slate-50 text-[13px]">
              <span className="font-semibold text-slate-400 w-36 shrink-0">{label}</span>
              <span className="text-slate-700">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Attendees() {
  const [regs,    setRegs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filterSt, setSt]     = useState("All");
  const [selected, setSel]   = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    fetch("/api/registrations", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setRegs(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = regs.filter(r => {
    const matchSearch = r.user?.name?.toLowerCase().includes(search.toLowerCase()) || r.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchSt = filterSt === "All" || r.status === filterSt.toLowerCase();
    return matchSearch && matchSt;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Attendees & Registrations</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">
          {regs.length} registrations · {regs.filter(r => r.status === "confirmed").length} confirmed
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterSt} onChange={e => setSt(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none">
          {["All", "Confirmed", "Pending", "Cancelled"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No attendees found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Attendee", "Email", "Expo", "Registered", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(reg => (
                  <tr key={reg._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                          {reg.user?.name?.charAt(0) || "?"}
                        </div>
                        <span className="font-semibold text-slate-700 whitespace-nowrap">{reg.user?.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{reg.user?.email || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{reg.event?.title || "—"}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(reg.registeredAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={reg.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSel(reg)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[12px] font-semibold hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <AttendeeDetail reg={selected} onClose={() => setSel(null)} />}
    </div>
  );
}
