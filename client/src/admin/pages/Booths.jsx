import { useState, useEffect } from "react";
import { Search, X, UserCheck, Plus, Trash2, Loader2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

const boothColors = {
  available: "border-green-200 bg-green-50 text-green-700 hover:border-green-400",
  occupied:  "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400",
  pending:   "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400",
};

// Form to create one or multiple booths for a selected expo
function CreateBoothForm({ expos, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    event: "",
    boothId: "",
    type: "Standard",
    size: "3x3m",
    bulk: false,
    bulkPrefix: "A",
    bulkFrom: 1,
    bulkTo: 5,
  });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.event) return setError("Select an expo");
    if (form.bulk) {
      if (!form.bulkPrefix) return setError("Enter a prefix");
      if (form.bulkFrom >= form.bulkTo) return setError("From must be less than To");
      if (form.bulkTo - form.bulkFrom > 49) return setError("Max 50 booths at once");
    } else {
      if (!form.boothId.trim()) return setError("Enter a booth ID");
    }
    setError("");
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[15px] text-slate-800">Create Booth{form.bulk ? "s" : ""}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={14} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-[12.5px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Expo</label>
            <select value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400">
              <option value="">Select expo...</option>
              {expos.map(ex => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400">
                {["Standard", "Premium", "Corner"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Size</label>
              <select value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400">
                {["2x2m", "3x3m", "4x4m", "5x5m", "6x3m"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input type="checkbox" checked={form.bulk} onChange={e => setForm(p => ({ ...p, bulk: e.target.checked }))} className="w-4 h-4 rounded" />
              <span className="text-[13px] font-semibold text-slate-700">Create multiple booths at once</span>
            </label>
            {form.bulk ? (
              <div className="space-y-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-[12px] text-slate-500">Creates booths like: A-01, A-02, A-03...</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Prefix</label>
                    <input value={form.bulkPrefix} onChange={e => setForm(p => ({ ...p, bulkPrefix: e.target.value }))}
                      placeholder="A"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">From</label>
                    <input type="number" min="1" value={form.bulkFrom} onChange={e => setForm(p => ({ ...p, bulkFrom: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">To</label>
                    <input type="number" min="2" value={form.bulkTo} onChange={e => setForm(p => ({ ...p, bulkTo: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400" />
                  </div>
                </div>
                <p className="text-[11.5px] text-indigo-600 font-medium">
                  Will create {Math.max(0, form.bulkTo - form.bulkFrom + 1)} booths
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Booth ID</label>
                <input value={form.boothId} onChange={e => setForm(p => ({ ...p, boothId: e.target.value }))}
                  placeholder="e.g. A-01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400" />
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-indigo-500 text-white text-[13px] font-bold hover:bg-indigo-600 disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {saving ? "Creating..." : form.bulk ? "Create Booths" : "Create Booth"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Booths() {
  const [booths,       setBooths]       = useState([]);
  const [apps,         setApps]         = useState([]);
  const [expos,        setExpos]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [search,       setSearch]       = useState("");
  const [filterExpo,   setFilterExpo]   = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected,     setSelected]     = useState(null);
  const [showAssign,   setShowAssign]   = useState(false);
  const [assignPick,   setAssignPick]   = useState("");   // selected app._id
  const [showCreate,   setShowCreate]   = useState(false);
  const [view,         setView]         = useState("grid");
  const [toast,        setToast]        = useState(null);
  const [confirmDel,   setConfirmDel]   = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchAll() {
    setLoading(true);
    const headers = { Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
    try {
      const [boothsRes, appsRes, exposRes] = await Promise.all([
        fetch("/api/booths",         { headers }),
        fetch("/api/applications",   { headers }),
        fetch("/api/expos/all",      { headers }),
      ]);
      const [boothsData, appsData, exposData] = await Promise.all([
        boothsRes.json(), appsRes.json(), exposRes.json(),
      ]);
      setBooths(Array.isArray(boothsData) ? boothsData : []);
      setApps(Array.isArray(appsData)     ? appsData   : []);
      setExpos(Array.isArray(exposData)   ? exposData  : []);
    } catch {
      showToast("Failed to load data", "err");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  const filtered = booths.filter(b => {
    const matchExpo   = filterExpo === "All" || (b.event?.title || "") === filterExpo;
    const matchStatus = filterStatus === "All" || b.status === filterStatus.toLowerCase();
    const matchSearch = (b.boothId || "").toLowerCase().includes(search.toLowerCase())
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

  // Returns approved applications for the same expo as the selected booth
  // that haven't already been assigned a booth in that expo.
  function getEligible(booth) {
    // booth.event is a populated object { _id, title } OR a raw ObjectId string
    const expoId = String(booth.event?._id || booth.event);

    // Companies already assigned a booth in this expo (excluding current booth)
    const assignedCompanies = booths
      .filter(b => String(b.event?._id || b.event) === expoId && b.status === "occupied" && b._id !== booth._id)
      .map(b => b.exhibitor);

    // Approved applications for this expo that aren't yet assigned
    return apps.filter(a => {
      const appExpoId = String(a.event?._id || a.event);
      return a.status === "approved"
        && appExpoId === expoId
        && !assignedCompanies.includes(a.company);
    });
  }

  async function handleCreate(form) {
    setSaving(true);
    try {
      const boothIds = form.bulk
        ? Array.from({ length: form.bulkTo - form.bulkFrom + 1 }, (_, i) =>
            `${form.bulkPrefix}-${String(form.bulkFrom + i).padStart(2, "0")}`)
        : [form.boothId.trim()];

      let created = 0, failed = 0;
      for (const boothId of boothIds) {
        const res = await fetch("/api/booths", {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify({ boothId, event: form.event, type: form.type, size: form.size }),
        });
        if (res.ok) created++; else failed++;
      }

      if (created > 0)
        showToast(`${created} booth${created > 1 ? "s" : ""} created${failed > 0 ? `, ${failed} skipped (already exist)` : ""}`);
      else
        showToast("All booths already exist for this expo", "err");
      setShowCreate(false);
      fetchAll();
    } catch {
      showToast("Something went wrong", "err");
    } finally {
      setSaving(false);
    }
  }

  async function handleAssign() {
    if (!assignPick || !selected) return;

    // Find the selected application object by _id
    const app = apps.find(a => a._id === assignPick);
    if (!app) return showToast("Could not find application", "err");

    const res = await fetch(`/api/booths/${selected._id}/assign`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify({ exhibitorId: app._id, exhibitorName: app.company }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return showToast(d.message || "Assign failed", "err");
    }
    showToast(`Booth ${selected.boothId} assigned to ${app.company}`);
    setShowAssign(false);
    setAssignPick("");
    setSelected(null);
    fetchAll();
  }

  async function handleClear(id, boothId) {
    const res = await fetch(`/api/booths/${id}/clear`, { method: "PUT", headers: authHeader() });
    if (!res.ok) return showToast("Clear failed", "err");
    showToast(`Booth ${boothId} cleared`);
    setSelected(null);
    fetchAll();
  }

  async function handleDelete(id, boothId) {
    const res = await fetch(`/api/booths/${id}`, { method: "DELETE", headers: authHeader() });
    if (!res.ok) return showToast("Delete failed", "err");
    showToast(`Booth ${boothId} deleted`);
    setConfirmDel(null);
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

      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[1.15rem] font-black text-slate-800">Booth Management</h1>
          <p className="text-slate-400 text-[13px] mt-0.5">{booths.length} booths across all expos</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-[13px] font-bold hover:bg-indigo-600 transition-colors">
          <Plus size={15} /> New Booth
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          ["Total",     stats.total,     "bg-slate-50  border-slate-200  text-slate-600"],
          ["Available", stats.available, "bg-green-50  border-green-200  text-green-700"],
          ["Occupied",  stats.occupied,  "bg-blue-50   border-blue-200   text-blue-700"],
          ["Pending",   stats.pending,   "bg-amber-50  border-amber-200  text-amber-700"],
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search booth ID or exhibitor..."
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
          {["grid", "table"].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-2 text-[12px] font-semibold transition-colors ${view === v ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {v === "grid" ? "Grid" : "Table"}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {booths.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold mb-2">No booths created yet.</p>
          <button onClick={() => setShowCreate(true)} className="text-[13px] font-bold text-indigo-500 hover:text-indigo-600">
            Create your first booth
          </button>
        </div>
      ) : view === "grid" ? (
        /* Grid view */
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-10">No booths match your filters.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(82px,1fr))] gap-2">
              {filtered.map(booth => (
                <button key={booth._id}
                  onClick={() => { setSelected(booth); setShowAssign(false); setAssignPick(""); }}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${boothColors[booth.status] || "border-slate-200 bg-slate-50 text-slate-400"}`}
                  title={booth.exhibitor ? `${booth.boothId} — ${booth.exhibitor}` : `${booth.boothId} (${booth.status})`}>
                  <span className="text-[13px] font-black">{booth.boothId}</span>
                  <span className="text-[9px] mt-0.5 opacity-70 px-1 text-center truncate w-full leading-tight">
                    {booth.exhibitor ? booth.exhibitor.split(" ")[0] : booth.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
            {[["available","bg-green-400","Available"],["occupied","bg-blue-400","Occupied"],["pending","bg-amber-400","Pending"]].map(([, bg, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${bg}`} />
                <span className="text-[11.5px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Table view */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Booth", "Expo", "Type", "Size", "Status", "Exhibitor", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(booth => (
                  <tr key={booth._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{booth.boothId}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{booth.event?.title || ""}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.type}</td>
                    <td className="px-4 py-3 text-slate-500">{booth.size}</td>
                    <td className="px-4 py-3"><StatusBadge status={booth.status} /></td>
                    <td className="px-4 py-3 text-slate-700">{booth.exhibitor || <span className="text-slate-300 italic">Unassigned</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setSelected(booth); setShowAssign(false); setAssignPick(""); }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[12px] font-semibold hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                          Manage
                        </button>
                        <button onClick={() => setConfirmDel(booth)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booth detail / assign panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => { setSelected(null); setShowAssign(false); setAssignPick(""); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-black text-[1.2rem] text-slate-800 font-mono">{selected.boothId}</span>
                <p className="text-[12px] text-slate-400 mt-0.5 truncate max-w-[200px]">{selected.event?.title || ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <button onClick={() => { setSelected(null); setShowAssign(false); setAssignPick(""); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-2">
              {[
                ["Type",      selected.type],
                ["Size",      selected.size],
                ["Exhibitor", selected.exhibitor || "Unassigned"],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3 py-2 border-b border-slate-50 text-[13px]">
                  <span className="font-semibold text-slate-400 w-24 shrink-0">{label}</span>
                  <span className={val === "Unassigned" ? "text-slate-300 italic" : "text-slate-700"}>{val}</span>
                </div>
              ))}

              {/* Assign section — only for non-occupied booths */}
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
                        <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-[12.5px] text-amber-700 space-y-1">
                          <p className="font-semibold">No eligible exhibitors</p>
                          <p className="opacity-80">
                            There are no approved applications for this expo that haven't already been assigned a booth.
                            Approve an application first from the Applications page.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                            Approved exhibitors for {selected.event?.title || "this expo"}
                          </label>
                          <select value={assignPick} onChange={e => setAssignPick(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400">
                            <option value="">Choose exhibitor...</option>
                            {getEligible(selected).map(a => (
                              <option key={a._id} value={a._id}>
                                {a.company}{a.city ? ` — ${a.city}` : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => { setShowAssign(false); setAssignPick(""); }}
                          className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-[12.5px] font-semibold hover:bg-slate-50">
                          Cancel
                        </button>
                        <button onClick={handleAssign} disabled={!assignPick}
                          className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-[12.5px] font-bold hover:bg-indigo-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
                          <UserCheck size={13} /> Assign
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Occupied actions */}
              {selected.status === "occupied" && (
                <div className="pt-3 flex gap-2">
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50">
                    Close
                  </button>
                  <button onClick={() => handleClear(selected._id, selected.boothId)}
                    className="flex-1 py-2.5 rounded-lg border border-amber-200 text-amber-600 text-[13px] font-semibold hover:bg-amber-50">
                    Clear Assignment
                  </button>
                </div>
              )}

              {/* Delete */}
              <div className="pt-1">
                <button onClick={() => setConfirmDel(selected)}
                  className="w-full py-2 rounded-lg border border-red-200 text-red-500 text-[12.5px] font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                  <Trash2 size={13} /> Delete Booth
                </button>
              </div>

              {/* Close for available/pending when not in assign mode */}
              {selected.status !== "occupied" && !showAssign && (
                <button onClick={() => setSelected(null)}
                  className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateBoothForm expos={expos} onSave={handleCreate} onClose={() => setShowCreate(false)} saving={saving} />
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[360px] p-6">
            <h3 className="font-bold text-[15px] text-slate-800 mb-2">Delete Booth {confirmDel.boothId}?</h3>
            <p className="text-[13px] text-slate-500 mb-5">This removes the booth permanently and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDel._id, confirmDel.boothId)}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-bold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
