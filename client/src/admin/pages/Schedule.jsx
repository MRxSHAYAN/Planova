import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, Loader2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

const TYPES = ["Keynote", "Talk", "Workshop", "Panel"];

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SessionForm({ initial, expos, onSave, onClose, saving }) {
  const blank = { event: "", title: "", speaker: "", speakerRole: "", type: "Talk", date: "", time: "", duration: "60 min", room: "", description: "" };
  const [form, setForm] = useState(initial
    ? {
        event:       initial.event?._id || initial.event || "",
        title:       initial.title       || "",
        speaker:     initial.speaker     || "",
        speakerRole: initial.speakerRole || "",
        type:        initial.type        || "Talk",
        date:        initial.date        ? initial.date.slice(0, 10) : "",
        time:        initial.time        || "",
        duration:    initial.duration    || "60 min",
        room:        initial.room        || "",
        description: initial.description || "",
      }
    : blank
  );
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.event)          e.event   = "Required";
    if (!form.title.trim())   e.title   = "Required";
    if (!form.speaker.trim()) e.speaker = "Required";
    if (!form.date)           e.date    = "Required";
    if (!form.time)           e.time    = "Required";
    if (!form.room.trim())    e.room    = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function field(name, label, type = "text") {
    return (
      <div>
        <label className="block text-[12px] font-semibold text-slate-600 mb-1">{label}</label>
        <input type={type} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
          className={`w-full px-3 py-2 rounded-lg border text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 transition-all ${errors[name] ? "border-red-400" : "border-slate-200"}`} />
        {errors[name] && <p className="text-[11px] text-red-500 mt-0.5">{errors[name]}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[15px] text-slate-800">{initial ? "Edit Session" : "Add Session"}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={14} />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (validate()) onSave(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Expo</label>
            <select value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 transition-all ${errors.event ? "border-red-400" : "border-slate-200"}`}>
              <option value="">Select expo...</option>
              {expos.map(ex => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
            </select>
            {errors.event && <p className="text-[11px] text-red-500 mt-0.5">{errors.event}</p>}
          </div>
          {field("title",   "Session Title")}
          {field("speaker", "Speaker Name")}
          {field("speakerRole", "Speaker Role (optional)")}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 transition-all">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {field("room", "Room")}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {field("date",     "Date",           "date")}
            {field("time",     "Time",           "time")}
            {field("duration", "Duration")}
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Description (optional)</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 transition-all resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={13} className="animate-spin" /> : null}
              {initial ? "Save Changes" : "Add Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [sessions,   setSessions]  = useState([]);
  const [expos,      setExpos]     = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [saving,     setSaving]    = useState(false);
  const [search,     setSearch]    = useState("");
  const [filterExpo, setFilterExpo] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [showForm,   setShowForm]  = useState(false);
  const [editItem,   setEditItem]  = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast,      setToast]     = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  async function fetchData() {
    const token = localStorage.getItem("planova_token");
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    try {
      const [sRes, eRes] = await Promise.all([
        fetch("/api/sessions", { headers }),
        fetch("/api/expos/all", { headers }),
      ]);
      setSessions(await sRes.json());
      setExpos(await eRes.json());
    } catch { showToast("Failed to load data", "err"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  const filtered = sessions.filter(s => {
    const matchS = s.title?.toLowerCase().includes(search.toLowerCase()) || s.speaker?.toLowerCase().includes(search.toLowerCase());
    const matchE = filterExpo === "All" || s.event?.title === filterExpo;
    const matchT = filterType === "All" || s.type === filterType;
    return matchS && matchE && matchT;
  });

  async function handleSave(form) {
    setSaving(true);
    try {
      const isEdit = !!editItem;
      const url    = isEdit ? `/api/sessions/${editItem._id}` : "/api/sessions";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) return showToast(data.message || "Save failed", "err");
      showToast(isEdit ? "Session updated" : "Session added");
      setShowForm(false); setEditItem(null);
      fetchData();
    } catch { showToast("Something went wrong", "err"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/sessions/${id}`, { method: "DELETE", headers: authHeader() });
    if (!res.ok) return showToast("Delete failed", "err");
    showToast("Session deleted");
    setConfirmDel(null);
    fetchData();
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-cyan-500" />
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
          <h1 className="text-[1.15rem] font-black text-slate-800">Schedule & Sessions</h1>
          <p className="text-slate-400 text-[13px] mt-0.5">{sessions.length} sessions across all expos.</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors">
          <Plus size={15} /> Add Session
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search session or speaker…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterExpo} onChange={e => setFilterExpo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none max-w-[200px]">
          <option>All</option>
          {expos.map(ex => <option key={ex._id}>{ex.title}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none">
          {["All", ...TYPES].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No sessions found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Session","Speaker","Expo","Date","Time","Room","Type","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr key={s._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-700 max-w-[200px]"><p className="truncate">{s.title}</p></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{s.speaker}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-[140px] truncate">{s.event?.title || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(s.date)}</td>
                    <td className="px-4 py-3 text-slate-500">{s.time}</td>
                    <td className="px-4 py-3 text-slate-500">{s.room}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.type} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditItem(s); setShowForm(true); }}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-cyan-50 text-slate-400 hover:text-cyan-500 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setConfirmDel(s._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
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

      {showForm && <SessionForm initial={editItem} expos={expos} onSave={handleSave} onClose={() => { setShowForm(false); setEditItem(null); }} saving={saving} />}

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[360px] p-6">
            <h3 className="font-bold text-[15px] text-slate-800 mb-2">Delete Session?</h3>
            <p className="text-[13px] text-slate-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDel)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
