import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Eye, Trash2, X, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

const CATEGORIES = ["Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food", "Other"];
const EMPTY_FORM = { title: "", description: "", category: "Technology", dateStart: "", dateEnd: "", venue: "", city: "", image: "", status: "draft", totalBooths: 0 };

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ExpoModal({ expo, onClose }) {
  if (!expo) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative h-40 overflow-hidden bg-slate-100">
          {expo.image && <img src={expo.image} alt={expo.title} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <X size={14} />
          </button>
          <div className="absolute bottom-3 left-4">
            <StatusBadge status={expo.status} />
            <h2 className="text-white font-black text-[1.1rem] mt-1 leading-tight">{expo.title}</h2>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            {[
              [Calendar, `${formatDate(expo.dateStart)} — ${formatDate(expo.dateEnd)}`],
              [MapPin,   `${expo.venue}, ${expo.city}`],
              [Users,    `${expo.totalBooths} total booths`],
            ].map(([Icon, text], i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <Icon size={13} className="text-indigo-500 shrink-0" />
                <span className="truncate">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed">{expo.description}</p>
          <div className="pt-1 text-[12px] text-slate-400">
            Category: <span className="font-semibold text-slate-600">{expo.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpoForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(
    initial
      ? {
          title:       initial.title       || "",
          description: initial.description || "",
          category:    initial.category    || "Technology",
          dateStart:   initial.dateStart   ? initial.dateStart.slice(0, 10) : "",
          dateEnd:     initial.dateEnd     ? initial.dateEnd.slice(0, 10)   : "",
          venue:       initial.venue       || "",
          city:        initial.city        || "",
          image:       initial.image       || "",
          status:      initial.status      || "draft",
          totalBooths: initial.totalBooths || 0,
        }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.title.trim())       e.title       = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.dateStart)          e.dateStart   = "Required";
    if (!form.dateEnd)            e.dateEnd     = "Required";
    if (form.dateStart && form.dateEnd && form.dateEnd < form.dateStart) e.dateEnd = "Must be after start date";
    if (!form.venue.trim())       e.venue       = "Required";
    if (!form.city.trim())        e.city        = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  function field(name, label, type = "text") {
    return (
      <div>
        <label className="block text-[12px] font-semibold text-slate-600 mb-1">{label}</label>
        <input type={type} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
          className={`w-full px-3 py-2 rounded-lg border text-[13.5px] text-slate-800 outline-none focus:border-indigo-400 transition-all ${errors[name] ? "border-red-400" : "border-slate-200"}`} />
        {errors[name] && <p className="text-[11.5px] text-red-500 mt-1">{errors[name]}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[15px] text-slate-800">{initial ? "Edit Expo" : "Create Expo"}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {field("title", "Title")}
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
              className={`w-full px-3 py-2 rounded-lg border text-[13.5px] text-slate-800 outline-none focus:border-indigo-400 transition-all resize-none ${errors.description ? "border-red-400" : "border-slate-200"}`} />
            {errors.description && <p className="text-[11.5px] text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("dateStart", "Start Date", "date")}
            {field("dateEnd",   "End Date",   "date")}
          </div>
          {field("venue", "Venue")}
          <div className="grid grid-cols-2 gap-3">
            {field("city", "City")}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-indigo-400 transition-all">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-indigo-400 transition-all">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Total Booths</label>
              <input type="number" min="0" value={form.totalBooths} onChange={e => setForm(p => ({ ...p, totalBooths: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-indigo-400 transition-all" />
            </div>
          </div>
          {field("image", "Image URL (optional)")}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-indigo-500 text-white text-[13px] font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {initial ? "Save Changes" : "Create Expo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExpoManagement() {
  const [expos, setExpos]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [filterStatus, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editExpo, setEditExpo] = useState(null);
  const [viewExpo, setViewExpo] = useState(null);
  const [confirm, setConfirm]   = useState(null);
  const [toast, setToast]       = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function fetchExpos() {
    setLoading(true);
    fetch("/api/expos/all", { headers: { Authorization: `Bearer ${localStorage.getItem("planova_token")}` } })
      .then(r => r.json())
      .then(data => { setExpos(Array.isArray(data) ? data : []); })
      .catch(() => showToast("Failed to load expos", "err"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchExpos(); }, []);

  const filtered = expos.filter(e => {
    const matchS = e.title.toLowerCase().includes(search.toLowerCase()) || e.city?.toLowerCase().includes(search.toLowerCase());
    const matchF = filterStatus === "All" || e.status === filterStatus.toLowerCase();
    return matchS && matchF;
  });

  async function handleSave(form) {
    setSaving(true);
    try {
      const isEdit = !!editExpo;
      const url    = isEdit ? `/api/expos/${editExpo._id}` : "/api/expos";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) return showToast(data.message || "Save failed", "err");
      fetchExpos();
      showToast(isEdit ? "Expo updated" : "Expo created");
      setShowForm(false); setEditExpo(null);
    } catch { showToast("Something went wrong", "err"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/expos/${id}`, { method: "DELETE", headers: authHeader() });
      if (!res.ok) return showToast("Delete failed", "err");
      fetchExpos();
      showToast("Expo deleted");
      setConfirm(null);
    } catch { showToast("Something went wrong", "err"); }
  }

  async function handleClose(id) {
    try {
      const res = await fetch(`/api/expos/${id}/close`, { method: "PUT", headers: authHeader() });
      if (!res.ok) return showToast("Close failed", "err");
      fetchExpos();
      showToast("Expo closed — data saved, removed from public view");
    } catch { showToast("Something went wrong", "err"); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold ${toast.type === "err" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[1.15rem] font-black text-slate-800">Expo Management</h1>
          <p className="text-slate-400 text-[13px] mt-0.5">
            {expos.length} expos · {expos.filter(e => e.status === "published").length} published
          </p>
        </div>
        <button onClick={() => { setEditExpo(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-[13px] font-bold hover:bg-indigo-600 transition-colors">
          <Plus size={15} /> New Expo
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expos…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterStatus} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-indigo-400">
          {["All", "Published", "Draft", "Archived"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No expos found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Expo", "Dates", "Location", "Booths", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(expo => (
                  <tr key={expo._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {expo.image
                          ? <img src={expo.image} alt={expo.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          : <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
                        }
                        <div>
                          <p className="font-semibold text-slate-700 whitespace-nowrap">{expo.title}</p>
                          <p className="text-[11px] text-slate-400">{expo.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(expo.dateStart)}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{expo.city}</td>
                    <td className="px-4 py-3 text-slate-500">{expo.totalBooths}</td>
                    <td className="px-4 py-3"><StatusBadge status={expo.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewExpo(expo)} title="View"
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => { setEditExpo(expo); setShowForm(true); }} title="Edit"
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 transition-colors">
                          <Pencil size={13} />
                        </button>
                        {expo.status === "published" && (
                          <button onClick={() => handleClose(expo._id)} title="Close expo"
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors">
                            <Calendar size={13} />
                          </button>
                        )}
                        <button onClick={() => setConfirm(expo._id)} title="Delete"
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

      {viewExpo  && <ExpoModal expo={viewExpo} onClose={() => setViewExpo(null)} />}
      {showForm  && <ExpoForm initial={editExpo} onSave={handleSave} onClose={() => { setShowForm(false); setEditExpo(null); }} saving={saving} />}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-6">
            <h3 className="font-bold text-[15px] text-slate-800 mb-2">Delete Expo?</h3>
            <p className="text-[13px] text-slate-500 mb-5">This will permanently remove the expo. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirm)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
