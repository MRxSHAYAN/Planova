import { useState, useEffect } from "react";
import { Search, X, UserCheck, Loader2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

const boothColors = {
  available: "border-green-200 bg-green-50 text-green-700 hover:border-green-400",
  occupied:  "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400",
  pending:   "border-indigo-200 bg-indigo-50 text-indigo-600 hover:border-indigo-400",
};

export default function Booths() {
  const [booths,    setBooths]    = useState([]);
  const [apps,      setApps]      = useState([]);
  const [expos,     setExpos]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filterExpo, setFilterExpo] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected,  setSelected]  = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [assignPick, setAssignPick] = useState("");
  const [view,      setView]      = useState("grid");
  const [toast,     setToast]     = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchAll() {
    setLoading(true);
    const token = localStorage.getItem("planova_token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [boothsRes, appsRes, exposRes] = await Promise.all([
        fetch("/api/booths", { headers }),
        fetch("/api/applications", { headers }),
        fetch("/api/expos/all", { headers }),
      ]);
      setBooths(await boothsRes.json());
      setApps(await appsRes.json());
      setExpos(await exposRes.json());
    } catch {
      showToast("Failed to load data", "err");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  const filtered = booths.filter(b => {
    const expoName = b.event?.title || "";
    const matchExpo   = filterExpo === "All" || expoName === filterExpo;
    const matchStatus = filterStatus === "All" || b.status === filterStatus.toLowerCase();
    const matchSearch = b.boothId.toLowerCase().includes(search.toLowerCase())
      || (b.exhibitor || "").toLowerCase().includes(search.toLowerCase());
    return matchExpo && matchStatus && matchSearch;
  });

  const stats = {
    total:     filtered.length,
    available: filtered.filter(b => b.status === "available").length,
    occupied:  filtered.filter(b => b.status === "occupied").length,
    pending:   filtered.filter(b => b.status === "pending").length,
  };

  const expoNames = ["All", ...expos.map(e => e.title)];

  // Approved exhibitors not yet assigned to another booth in the same expo
  function getEligible(booth) {
    const expoId = typeof booth.event === "object" ? booth.event?._id : booth.event;
    const assigned = booths
      .filter(b => {
        const bExpoId = typeof b.event === "object" ? b.event?._id : b.event;
        return bExpoId?.toString() === expoId?.toString() && b.status === "occupied" && b._id !== booth._id;
      })
      .map(b => b.exhibitor);

    return apps.filter(a => {
      const aExpoId = typeof a.event === "object" ? a.event?._id : a.event;
      return a.status === "approved"
        && aExpoId?.toString() === expoId?.toString()
        && !assigned.includes(a.company);
    });
  }

  async function handleAssign() {
    if (!assignPick || !selected) return;
    const res = await fetch(`/api/booths/${selected._id}/assign`, {
      method: "PUT", headers: authHeader(), body: JSON.stringify({ exhibitor: assignPick }),
    });
    if (!res.ok) return showToast("Assign failed", "err");
    showToast(`Booth ${selected.boothId} assigned to ${assignPick}`);
    setShowAssign(false); setAssignPick(""); setSelected(null);
    fetchAll();
  }

  async function handleClear(id, boothId) {
    const res = await fetch(`/api/booths/${id}/clear`, { method: "PUT", headers: authHeader() });
    if (!res.ok) return showToast("Clear failed", "err");
    showToast(`Booth ${boothId} cleared`);
    setSelected(null);
    fetchAll();
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold text-white ${toast.type === "err" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Booth & Floor Plan</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Manage booth assignments across all expos.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          ["Total",    stats.total,     "bg-slate-50 border-slate-200 text-slate-600"],
          ["Available",stats.available, "bg-green-50 border-green-200 text-green-700"],
          ["Occupied", stats.occupied,  "bg-blue-50 border-blue-200 text-blue-700"],
          ["Pending",  stats.pending,   "bg-indigo-50 border-indigo-200 text-indigo-600"],
        ].map(([label, val, cls]) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${cls}`}>
            <div className="text-[22px] font-black">{val}</div>
            <div className="text-[11.5px] font-semibold mt-0.5 uppercase tracking-wide opacity-70">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search booth or exhibitor…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterExpo} onChange={e => setFilterExpo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none max-w-[220px]">
          {expoNames.map(n => <option key={n}>{n}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none">
          {["All", "Available", "Pending", "Occupied"].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          {["grid","table"].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-2 text-[12px] font-semibold transition-colors ${view === v ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {v === "grid" ? "Grid" : "Table"}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-10">No booths match your filters.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
              {filtered.map(booth => (
                <button key={booth._id} onClick={() => { setSelected(booth); setShowAssign(false); setAssignPick(""); }}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center font-bold transition-all cursor-pointer ${boothColors[booth.status] || "border-slate-200 bg-slate-50 text-slate-400"}`}
                  title={booth.exhibitor || booth.status}>
                  <span className="text-[13px] font-black">{booth.boothId}</span>
                  <span className="text-[9px] mt-0.5 opacity-70 px-1 text-center truncate w-full leading-tight">
                    {booth.exhibitor ? booth.exhibitor.split(" ")[0] : booth.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Booth","Expo","Type","Size","Status","Exhibitor","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(booth => (
                  <tr key={booth._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{booth.boothId}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{booth.event?.title || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.type}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.size}</td>
                    <td className="px-4 py-3"><StatusBadge status={booth.status} /></td>
                    <td className="px-4 py-3 text-slate-700">{booth.exhibitor || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(booth); setShowAssign(false); setAssignPick(""); }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[12px] font-semibold hover:border-indigo-400 hover:text-indigo-500 transition-colors">
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

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => { setSelected(null); setShowAssign(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-black text-[1.2rem] text-slate-800 font-mono">{selected.boothId}</span>
                <p className="text-[12px] text-slate-400 truncate max-w-[200px]">{selected.event?.title || "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <button onClick={() => { setSelected(null); setShowAssign(false); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-2">
              {[["Type", selected.type], ["Size", selected.size], ["Exhibitor", selected.exhibitor || "Unassigned"]].map(([label, val]) => (
                <div key={label} className="flex gap-3 py-2 border-b border-slate-50 text-[13px]">
                  <span className="font-semibold text-slate-400 w-24 shrink-0">{label}</span>
                  <span className={val === "Unassigned" ? "text-slate-300 italic" : "text-slate-700"}>{val}</span>
                </div>
              ))}

              {selected.status !== "occupied" && (
                <div className="pt-3 space-y-3">
                  {!showAssign ? (
                    <button onClick={() => setShowAssign(true)}
                      className="w-full py-2.5 rounded-lg bg-indigo-500 text-white text-[13px] font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                      <UserCheck size={14} /> Assign Exhibitor
                    </button>
                  ) : (
                    <>
                      {getEligible(selected).length === 0 ? (
                        <p className="text-[12.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          No approved exhibitors available for this expo.
                        </p>
                      ) : (
                        <select value={assignPick} onChange={e => setAssignPick(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400 transition-all">
                          <option value="">— Choose exhibitor —</option>
                          {getEligible(selected).map(a => (
                            <option key={a._id} value={a.company}>{a.company} · {a.city}</option>
                          ))}
                        </select>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => { setShowAssign(false); setAssignPick(""); }}
                          className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-[12.5px] font-semibold hover:bg-slate-50 transition-colors">
                          Cancel
                        </button>
                        <button onClick={handleAssign} disabled={!assignPick}
                          className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-[12.5px] font-bold hover:bg-indigo-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5">
                          <UserCheck size={13} /> Assign
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {selected.status === "occupied" && (
                <div className="pt-3 flex gap-2">
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">
                    Close
                  </button>
                  <button onClick={() => handleClear(selected._id, selected.boothId)}
                    className="flex-1 py-2.5 rounded-lg border border-red-200 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors">
                    Clear Booth
                  </button>
                </div>
              )}

              {selected.status !== "occupied" && !showAssign && (
                <button onClick={() => setSelected(null)}
                  className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
