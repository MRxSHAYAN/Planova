import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { SESSIONS, EXPOS } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

const EMPTY = { expo: "", title: "", speaker: "", type: "Talk", date: "", time: "", duration: "", room: "" };
const TYPES = ["Keynote", "Talk", "Workshop", "Panel"];
const EXPO_NAMES = EXPOS.map(e => e.title);

function SessionForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [errors, setErrs] = useState({});

  const validate = () => {
    const e = {};
    if (!form.expo)          e.expo    = "Required.";
    if (!form.title.trim())  e.title   = "Required.";
    if (!form.speaker.trim())e.speaker = "Required.";
    if (!form.date)          e.date    = "Required.";
    if (!form.time)          e.time    = "Required.";
    if (!form.room.trim())   e.room    = "Required.";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const f = (name, label, type = "text") => (
    <div>
      <label className="block text-[12px] font-semibold text-slate-600 mb-1">{label} <span className="text-red-400">*</span></label>
      <input type={type} value={form[name]} onChange={e => setForm(p => ({...p,[name]:e.target.value}))}
        className={`w-full px-3 py-2 rounded-lg border text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all ${errors[name]?"border-red-400":"border-slate-200"}`} />
      {errors[name] && <p className="text-[11px] text-red-500 mt-0.5">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[15px] text-slate-800">{initial?.id ? "Edit Session" : "Add Session"}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={14}/></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); if(validate()) onSave(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Expo <span className="text-red-400">*</span></label>
            <select value={form.expo} onChange={e => setForm(p=>({...p,expo:e.target.value}))}
              className={`w-full px-3 py-2 rounded-lg border text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all ${errors.expo?"border-red-400":"border-slate-200"}`}>
              <option value="">Select expo…</option>
              {EXPO_NAMES.map(n=><option key={n}>{n}</option>)}
            </select>
            {errors.expo && <p className="text-[11px] text-red-500 mt-0.5">{errors.expo}</p>}
          </div>
          {f("title","Session Title")}
          {f("speaker","Speaker Name")}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 transition-all">
                {TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            {f("room","Room / Location")}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {f("date","Date","date")}
            {f("time","Time","time")}
            {f("duration","Duration (e.g. 45 min)")}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors">
              {initial?.id ? "Save Changes" : "Add Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [sessions, setSessions] = useState(SESSIONS);
  const [search, setSearch]     = useState("");
  const [filterExpo, setExpo]   = useState("All");
  const [filterType, setType]   = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEdit]     = useState(null);
  const [confirmDel, setDel]    = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2500); };

  const filtered = sessions.filter(s => {
    const matchS = s.title.toLowerCase().includes(search.toLowerCase()) || s.speaker.toLowerCase().includes(search.toLowerCase());
    const matchE = filterExpo === "All" || s.expo === filterExpo;
    const matchT = filterType === "All" || s.type === filterType;
    return matchS && matchE && matchT;
  });

  const handleSave = (form) => {
    if (editItem) {
      setSessions(p => p.map(s => s.id === editItem.id ? { ...s, ...form } : s));
      showToast("Session updated.");
    } else {
      setSessions(p => [...p, { ...form, id: Date.now(), attendees: 0 }]);
      showToast("Session added.");
    }
    setShowForm(false); setEdit(null);
  };

  const handleDelete = (id) => {
    setSessions(p => p.filter(s => s.id !== id));
    showToast("Session deleted."); setDel(null);
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold">✓ {toast}</div>}

      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[1.15rem] font-black text-slate-800">Schedule & Sessions</h1>
          <p className="text-slate-400 text-[13px] mt-0.5">{sessions.length} sessions across all expos.</p>
        </div>
        <button onClick={() => { setEdit(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors shadow-sm shadow-cyan-500/20">
          <Plus size={15} /> Add Session
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search session or speaker…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterExpo} onChange={e => setExpo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400 max-w-[200px]">
          <option>All</option>
          {[...new Set(sessions.map(s=>s.expo))].map(e => <option key={e}>{e}</option>)}
        </select>
        <select value={filterType} onChange={e => setType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400">
          {["All",...TYPES].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
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
                  {["Session","Speaker","Expo","Date & Time","Room","Type","Attendees","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-700 max-w-[200px]">
                      <p className="truncate">{s.title}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{s.speaker}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-[160px] truncate">{s.expo}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{s.date} {s.time}</td>
                    <td className="px-4 py-3 text-slate-500">{s.room}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.type} /></td>
                    <td className="px-4 py-3 text-slate-500">{s.attendees}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEdit(s); setShowForm(true); }} title="Edit"
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-cyan-50 text-slate-400 hover:text-cyan-500 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDel(s.id)} title="Delete"
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

      {showForm && <SessionForm initial={editItem} onSave={handleSave} onClose={() => { setShowForm(false); setEdit(null); }} />}

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[360px] p-6">
            <h3 className="font-bold text-[15px] text-slate-800 mb-2">Delete Session?</h3>
            <p className="text-[13px] text-slate-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDel(null)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDel)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
