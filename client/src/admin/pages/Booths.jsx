import { useState } from "react";
import { Search, X, UserCheck, AlertCircle } from "lucide-react";
import { BOOTHS, EXPOS, APPLICATIONS } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

const EXPO_NAMES = ["All", ...EXPOS.map(e => e.title)];
const STATUS_FILTER = ["All", "Available", "Pending", "Occupied"];

const boothColors = {
  Available: "border-green-200 bg-green-50 text-green-700 hover:border-green-400",
  Occupied:  "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400",
  Pending:   "border-cyan-200 bg-cyan-50 text-cyan-600 hover:border-cyan-400",
};

// Assign modal — shown when clicking "Assign Exhibitor" on an available booth
function AssignModal({ booth, booths, onAssign, onClose }) {
  const [selectedExhibitor, setSelectedExhibitor] = useState("");
  const [error, setError] = useState("");

  // Only approved exhibitors for the same expo can be assigned
  const eligibleExhibitors = APPLICATIONS.filter(
    a => a.status === "Approved" && a.expo === booth.expo
  );

  // Exhibitors already assigned to another booth in this expo
  const alreadyAssigned = booths
    .filter(b => b.expo === booth.expo && b.status === "Occupied" && b.id !== booth.id)
    .map(b => b.exhibitor);

  // Exclude already-assigned exhibitors
  const available = eligibleExhibitors.filter(
    e => !alreadyAssigned.includes(e.company)
  );

  const handleConfirm = () => {
    if (!selectedExhibitor) {
      setError("Please select an exhibitor to assign.");
      return;
    }
    onAssign(booth.id, selectedExhibitor);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center">
              <UserCheck size={15} className="text-cyan-500" />
            </div>
            <div>
              <h2 className="font-bold text-[14.5px] text-slate-800 leading-tight">
                Assign Exhibitor
              </h2>
              <p className="text-[11.5px] text-slate-400">
                Booth <span className="font-mono font-bold text-slate-600">{booth.id}</span>
                {" · "}{booth.type} · {booth.size}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Booth details summary */}
          <div className="grid grid-cols-2 gap-2 text-[12.5px]">
            {[
              ["Expo",   booth.expo],
              ["Status", booth.status],
              ["Type",   booth.type],
              ["Size",   booth.size],
            ].map(([label, val]) => (
              <div key={label} className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                <p className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-slate-700 font-semibold mt-0.5 truncate">{val}</p>
              </div>
            ))}
          </div>

          {/* Exhibitor dropdown */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
              Select Approved Exhibitor
              <span className="text-red-400 ml-0.5">*</span>
            </label>

            {available.length === 0 ? (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-amber-700">
                  No approved exhibitors available for{" "}
                  <strong>{booth.expo}</strong>.
                  {eligibleExhibitors.length > 0
                    ? ` ${eligibleExhibitors.length - available.length} exhibitor(s) already have a booth.`
                    : " Approve applications first."}
                </p>
              </div>
            ) : (
              <>
                <select
                  value={selectedExhibitor}
                  onChange={e => { setSelectedExhibitor(e.target.value); setError(""); }}
                  className={`w-full px-3 py-2.5 rounded-lg border text-[13.5px] text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all appearance-none ${
                    error ? "border-red-400 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <option value="">— Choose an exhibitor —</option>
                  {available.map(app => (
                    <option key={app.id} value={app.company}>
                      {app.company} · {app.category} · {app.city}
                    </option>
                  ))}
                </select>

                {/* Selected exhibitor preview */}
                {selectedExhibitor && (() => {
                  const app = available.find(a => a.company === selectedExhibitor);
                  return app ? (
                    <div className="mt-2 flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center text-[10px] font-black text-green-800 shrink-0">
                        {app.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-green-800 truncate">{app.company}</p>
                        <p className="text-[11.5px] text-green-600">
                          {app.contact} · {app.email}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-200 text-green-800 shrink-0">
                        Approved
                      </span>
                    </div>
                  ) : null;
                })()}
              </>
            )}

            {error && (
              <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> {error}
              </p>
            )}
          </div>

          {/* Duplicate protection notice */}
          <div className="flex items-start gap-2 text-[11.5px] text-slate-400">
            <AlertCircle size={12} className="shrink-0 mt-0.5" />
            <span>
              Each approved exhibitor can only be assigned to one booth per expo.
              Already-assigned exhibitors are excluded from this list.
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={available.length === 0}
              className="flex-1 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck size={14} />
              Assign Booth
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Booths() {
  const [booths, setBooths]       = useState(BOOTHS);
  const [filterExpo, setExpo]     = useState("All");
  const [filterStatus, setSt]     = useState("All");
  const [search, setSearch]       = useState("");
  const [selected, setSel]        = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [toast, setToast]         = useState(null);
  const [view, setView]           = useState("grid");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = booths.filter(b => {
    const matchExpo   = filterExpo === "All"   || b.expo === filterExpo;
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase())
                     || (b.exhibitor || "").toLowerCase().includes(search.toLowerCase());
    return matchExpo && matchStatus && matchSearch;
  });

  const stats = {
    total:     filtered.length,
    available: filtered.filter(b => b.status === "Available").length,
    occupied:  filtered.filter(b => b.status === "Occupied").length,
    pending:   filtered.filter(b => b.status === "Pending").length,
  };

  // Assign an exhibitor to the selected booth
  const handleAssign = (boothId, exhibitorName) => {
    setBooths(p =>
      p.map(b => b.id === boothId ? { ...b, status: "Occupied", exhibitor: exhibitorName } : b)
    );
    // Keep selected in sync so detail panel refreshes
    setSel(prev => prev ? { ...prev, status: "Occupied", exhibitor: exhibitorName } : null);
    setShowAssign(false);
    showToast(`Booth ${boothId} assigned to ${exhibitorName}.`);
  };

  const handleClear = (id) => {
    setBooths(p => p.map(b => b.id === id ? { ...b, status: "Available", exhibitor: null } : b));
    setSel(null);
    showToast("Booth cleared.", "info");
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold flex items-center gap-2 text-white transition-all ${
          toast.type === "info" ? "bg-blue-500" : "bg-green-500"
        }`}>
          <span>{toast.type === "info" ? "ℹ" : "✓"}</span> {toast.msg}
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
          ["Total Booths", stats.total,     "bg-slate-50 border-slate-200 text-slate-600"],
          ["Available",    stats.available,  "bg-green-50 border-green-200 text-green-700"],
          ["Occupied",     stats.occupied,   "bg-blue-50 border-blue-200 text-blue-700"],
          ["Pending",      stats.pending,    "bg-cyan-50 border-cyan-200 text-cyan-600"],
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
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search booth ID or exhibitor…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400"
          />
        </div>
        <select
          value={filterExpo}
          onChange={e => setExpo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400 max-w-[220px]"
        >
          {EXPO_NAMES.map(n => <option key={n}>{n}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setSt(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400"
        >
          {STATUS_FILTER.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          {["grid", "table"].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-2 text-[12px] font-semibold transition-colors ${
                view === v ? "bg-cyan-500 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {v === "grid" ? "⊞ Grid" : "≡ Table"}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-[12px]">
        {[
          ["Available", "bg-green-500"],
          ["Occupied",  "bg-blue-500"],
          ["Pending",   "bg-cyan-500"],
        ].map(([label, cls]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cls}`} />
            <span className="text-slate-500 font-medium">{label}</span>
          </div>
        ))}
        <span className="text-slate-300">·</span>
        <span className="text-slate-400 text-[11.5px]">Click any booth to view details or assign an exhibitor.</span>
      </div>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-10">No booths match your filters.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
              {filtered.map(booth => (
                <button
                  key={booth.id}
                  onClick={() => setSel(booth)}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center font-bold transition-all cursor-pointer ${
                    boothColors[booth.status] || "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                  title={booth.exhibitor ? `Assigned: ${booth.exhibitor}` : booth.status}
                >
                  <span className="text-[13px] font-black">{booth.id}</span>
                  <span className="text-[9px] mt-0.5 opacity-70 px-1 text-center truncate w-full leading-tight">
                    {booth.exhibitor ? booth.exhibitor.split(" ")[0] : booth.type}
                  </span>
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
                  {["Booth ID","Expo","Type","Size","Status","Assigned Exhibitor","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(booth => (
                  <tr key={booth.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{booth.id}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">{booth.expo}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.type}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.size}</td>
                    <td className="px-4 py-3"><StatusBadge status={booth.status} /></td>
                    <td className="px-4 py-3">
                      {booth.exhibitor ? (
                        <span className="font-medium text-slate-700">{booth.exhibitor}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSel(booth)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[12px] font-semibold hover:border-cyan-400 hover:text-cyan-500 transition-colors"
                      >
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

      {/* ── Detail panel ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => { setSel(null); setShowAssign(false); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-black text-[1.2rem] text-slate-800 font-mono">{selected.id}</span>
                <p className="text-[12px] text-slate-400 truncate max-w-[200px]">{selected.expo}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <button
                  onClick={() => { setSel(null); setShowAssign(false); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-2">
              {/* Info rows */}
              {[
                ["Type",       selected.type],
                ["Size",       selected.size],
                ["Status",     selected.status],
                ["Exhibitor",  selected.exhibitor || "Unassigned"],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3 py-2 border-b border-slate-50 text-[13px]">
                  <span className="font-semibold text-slate-400 w-24 shrink-0">{label}</span>
                  <span className={`${val === "Unassigned" ? "text-slate-300 italic" : "text-slate-700"}`}>{val}</span>
                </div>
              ))}

              {/* Assign inline form — shown for Available or Pending booths */}
              {(selected.status === "Available" || selected.status === "Pending") && (
                <div className="pt-3">
                  {!showAssign ? (
                    <button
                      onClick={() => setShowAssign(true)}
                      className="w-full py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck size={14} />
                      Assign Exhibitor
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <AssignDropdown
                        booth={selected}
                        booths={booths}
                        onAssign={handleAssign}
                        onCancel={() => setShowAssign(false)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Occupied — show clear option */}
              {selected.status === "Occupied" && (
                <div className="pt-3 space-y-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-700">
                    ⚠ Clearing a booth removes the exhibitor assignment. This will reflect across the platform once the backend is connected.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSel(null)}
                      className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleClear(selected.id)}
                      className="flex-1 py-2.5 rounded-lg border border-red-200 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors"
                    >
                      Clear Booth
                    </button>
                  </div>
                </div>
              )}

              {/* Available with no assign form open */}
              {selected.status !== "Occupied" && !showAssign && (
                <div className="pt-1">
                  <button
                    onClick={() => setSel(null)}
                    className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Full-screen assign modal (triggered from grid/table detail) ── */}
      {showAssign && selected && (
        <AssignModal
          booth={selected}
          booths={booths}
          onAssign={handleAssign}
          onClose={() => setShowAssign(false)}
        />
      )}
    </div>
  );
}

// Inline compact assign dropdown used inside the detail panel
function AssignDropdown({ booth, booths, onAssign, onCancel }) {
  const [pick, setPick] = useState("");
  const [err, setErr]   = useState("");

  const eligible = APPLICATIONS.filter(
    a => a.status === "Approved" && a.expo === booth.expo
  );
  const alreadyAssigned = booths
    .filter(b => b.expo === booth.expo && b.status === "Occupied" && b.id !== booth.id)
    .map(b => b.exhibitor);
  const available = eligible.filter(e => !alreadyAssigned.includes(e.company));

  if (available.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12.5px] text-amber-700 space-y-2">
        <p className="font-semibold">No approved exhibitors available</p>
        <p className="text-[12px]">
          {eligible.length > 0
            ? "All approved exhibitors for this expo already have a booth assigned."
            : "There are no approved applications for this expo yet."}
        </p>
        <button onClick={onCancel} className="text-[12px] font-semibold text-amber-700 underline">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <label className="block text-[12px] font-semibold text-slate-600">
        Select Exhibitor <span className="text-red-400">*</span>
      </label>

      <select
        value={pick}
        onChange={e => { setPick(e.target.value); setErr(""); }}
        className={`w-full px-3 py-2.5 rounded-lg border text-[13px] text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all ${
          err ? "border-red-400 bg-red-50" : "border-slate-200"
        }`}
      >
        <option value="">— Choose exhibitor —</option>
        {available.map(a => (
          <option key={a.id} value={a.company}>
            {a.company} · {a.city}
          </option>
        ))}
      </select>

      {/* Preview card */}
      {pick && (() => {
        const app = available.find(a => a.company === pick);
        return app ? (
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-green-50 border border-green-200">
            <div className="w-7 h-7 rounded-lg bg-green-200 text-green-800 flex items-center justify-center text-[10px] font-black shrink-0">
              {app.company.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-green-800 truncate">{app.company}</p>
              <p className="text-[11px] text-green-600 truncate">{app.contact} · {app.email}</p>
            </div>
          </div>
        ) : null;
      })()}

      {err && <p className="text-[12px] text-red-500">{err}</p>}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-[12.5px] font-semibold hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!pick) { setErr("Please select an exhibitor."); return; }
            onAssign(booth.id, pick);
          }}
          className="flex-1 py-2 rounded-lg bg-cyan-500 text-white text-[12.5px] font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-1.5"
        >
          <UserCheck size={13} /> Assign
        </button>
      </div>
    </div>
  );
}
