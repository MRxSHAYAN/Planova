import { useState } from "react";
import { Search } from "lucide-react";
import { BOOTHS, EXPOS } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

const EXPO_NAMES = ["All", ...EXPOS.map(e => e.title)];
const STATUS_FILTER = ["All", "Available", "Pending", "Occupied"];

const boothColors = {
  Available: "border-green-200 bg-green-50 text-green-700 hover:border-green-400",
  Occupied:  "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400",
  Pending:   "border-orange-200 bg-orange-50 text-orange-600 hover:border-orange-400",
};

export default function Booths() {
  const [booths, setBooths]   = useState(BOOTHS);
  const [filterExpo, setExpo] = useState("All");
  const [filterStatus, setSt] = useState("All");
  const [search, setSearch]   = useState("");
  const [selected, setSel]    = useState(null);
  const [toast, setToast]     = useState(null);
  const [view, setView]       = useState("grid"); // grid or table

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = booths.filter(b => {
    const matchExpo   = filterExpo === "All"   || b.expo === filterExpo;
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase())
                     || (b.exhibitor || "").toLowerCase().includes(search.toLowerCase());
    return matchExpo && matchStatus && matchSearch;
  });

  const stats = { total: filtered.length, available: filtered.filter(b=>b.status==="Available").length, occupied: filtered.filter(b=>b.status==="Occupied").length, pending: filtered.filter(b=>b.status==="Pending").length };

  const handleClear = (id) => {
    setBooths(p => p.map(b => b.id === id ? { ...b, status: "Available", exhibitor: null } : b));
    showToast("Booth cleared successfully.");
    setSel(null);
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Booth & Floor Plan</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Manage booth assignments across all expos.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          ["Total Booths", stats.total, "bg-slate-50 border-slate-200 text-slate-600"],
          ["Available",    stats.available, "bg-green-50 border-green-200 text-green-700"],
          ["Occupied",     stats.occupied,  "bg-blue-50 border-blue-200 text-blue-700"],
          ["Pending",      stats.pending,   "bg-orange-50 border-orange-200 text-orange-600"],
        ].map(([label, val, cls]) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${cls}`}>
            <div className="text-[22px] font-black">{val}</div>
            <div className="text-[11.5px] font-semibold mt-0.5 uppercase tracking-wide opacity-70">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search booth ID or exhibitor…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterExpo} onChange={e => setExpo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-orange-400 max-w-[220px]">
          {EXPO_NAMES.map(n => <option key={n}>{n}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setSt(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-orange-400">
          {STATUS_FILTER.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          {["grid","table"].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-2 text-[12px] font-semibold transition-colors ${view===v ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {v === "grid" ? "⊞ Grid" : "≡ Table"}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-[12px]">
        {[["Available","bg-green-500"],["Occupied","bg-blue-500"],["Pending","bg-orange-500"]].map(([label, cls]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cls}`} />
            <span className="text-slate-500 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-10">No booths match your filters.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
              {filtered.map(booth => (
                <button key={booth.id} onClick={() => setSel(booth)}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${boothColors[booth.status] || "border-slate-200 bg-slate-50 text-slate-400"}`}>
                  <span className="text-[13px] font-black">{booth.id}</span>
                  <span className="text-[9px] mt-0.5 opacity-70">{booth.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Table view */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Booth ID","Expo","Type","Size","Status","Exhibitor","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(booth => (
                  <tr key={booth.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{booth.id}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{booth.expo}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.type}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.size}</td>
                    <td className="px-4 py-3"><StatusBadge status={booth.status} /></td>
                    <td className="px-4 py-3 text-slate-500">{booth.exhibitor || "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSel(booth)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[12px] font-semibold hover:border-orange-400 hover:text-orange-500 transition-colors">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between`}>
              <div>
                <span className="font-black text-[1.2rem] text-slate-800 font-mono">{selected.id}</span>
                <p className="text-[12px] text-slate-400">{selected.expo}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="p-5 space-y-3">
              {[
                ["Type",  selected.type],
                ["Size",  selected.size],
                ["Status",selected.status],
                ["Exhibitor", selected.exhibitor || "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3 py-1.5 border-b border-slate-50 text-[13px]">
                  <span className="font-semibold text-slate-400 w-24 shrink-0">{label}</span>
                  <span className="text-slate-700">{val}</span>
                </div>
              ))}
              {selected.status === "Occupied" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12.5px] text-amber-700">
                  ⚠ Unassigning a booth requires backend confirmation to prevent data inconsistency.
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSel(null)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Close</button>
                {selected.status === "Available" && (
                  <button className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white text-[13px] font-bold hover:bg-orange-600 transition-colors">
                    Assign Exhibitor
                  </button>
                )}
                {selected.status === "Occupied" && (
                  <button onClick={() => handleClear(selected.id)} className="flex-1 py-2.5 rounded-lg border border-red-200 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors">
                    Clear Booth
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
