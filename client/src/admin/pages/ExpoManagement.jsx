import { useState } from "react";
import { Plus, Search, Pencil, Eye, Archive, X, Calendar, MapPin, Users, Map } from "lucide-react";
import { EXPOS } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

const EMPTY_FORM = { title: "", category: "", startDate: "", endDate: "", venue: "", city: "", description: "", status: "Draft" };
const CATEGORIES = ["Technology", "Healthcare", "Energy", "Agriculture", "Fashion", "Food", "Other"];

function ExpoModal({ expo, onClose }) {
  if (!expo) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative h-40 overflow-hidden">
          <img src={expo.image} alt={expo.title} className="w-full h-full object-cover" />
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
              [Calendar, `${expo.startDate} → ${expo.endDate}`],
              [MapPin, `${expo.venue}, ${expo.city}`],
              [Users, `${expo.attendees?.toLocaleString()} attendees`],
              [Map, `${expo.occupiedBooths}/${expo.totalBooths} booths occupied`],
            ].map(([Icon, text], i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <Icon size={13} className="text-cyan-500 shrink-0" />
                <span className="truncate">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed">{expo.description}</p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[["Attendees", expo.attendees?.toLocaleString()], ["Exhibitors", expo.exhibitors], ["Booths", expo.totalBooths]].map(([label, val]) => (
              <div key={label} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <div className="text-[18px] font-black text-slate-800">{val}</div>
                <div className="text-[11px] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpoForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = "Title is required.";
    if (!form.startDate)       e.startDate= "Start date is required.";
    if (!form.endDate)         e.endDate  = "End date is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = "End date must be after start date.";
    if (!form.venue.trim())    e.venue    = "Venue is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const field = (name, label, type = "text", req = false) => (
    <div>
      <label className="block text-[12px] font-semibold text-slate-600 mb-1">{label}{req && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={type} value={form[name]} onChange={e => setForm(p => ({...p, [name]: e.target.value}))}
        className={`w-full px-3 py-2 rounded-lg border text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all ${errors[name] ? "border-red-400" : "border-slate-200"}`} />
      {errors[name] && <p className="text-[11.5px] text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[15px] text-slate-800">{initial?.id ? "Edit Expo" : "Create New Expo"}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {field("title", "Expo Title", "text", true)}
          <div className="grid grid-cols-2 gap-3">
            {field("startDate", "Start Date", "date", true)}
            {field("endDate", "End Date", "date", true)}
          </div>
          {field("venue", "Venue / Location", "text", true)}
          <div className="grid grid-cols-2 gap-3">
            {field("city", "City")}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all">
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all">
              <option>Draft</option>
              <option>Published</option>
              <option>Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors">
              {initial?.id ? "Save Changes" : "Create Expo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExpoManagement() {
  const [expos, setExpos]         = useState(EXPOS);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("All");
  const [showForm, setShowForm]   = useState(false);
  const [editExpo, setEditExpo]   = useState(null);
  const [viewExpo, setViewExpo]   = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [toast, setToast]         = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = expos.filter(e => {
    const matchS = e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    const matchF = filterStatus === "All" || e.status === filterStatus;
    return matchS && matchF;
  });

  const handleSave = (form) => {
    if (editExpo) {
      setExpos(p => p.map(e => e.id === editExpo.id ? { ...e, ...form } : e));
      showToast("Expo updated successfully.");
    } else {
      setExpos(p => [...p, { ...form, id: Date.now(), exhibitors: 0, attendees: 0, totalBooths: 0, occupiedBooths: 0, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=75" }]);
      showToast("Expo created successfully.");
    }
    setShowForm(false); setEditExpo(null);
  };

  const handleArchive = (id) => {
    setExpos(p => p.map(e => e.id === id ? { ...e, status: "Archived" } : e));
    showToast("Expo archived."); setConfirm(null);
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold flex items-center gap-2">
          <span>✓</span> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[1.15rem] font-black text-slate-800">Expo Management</h1>
          <p className="text-slate-400 text-[13px] mt-0.5">{expos.length} expos · {expos.filter(e=>e.status==="Published").length} published</p>
        </div>
        <button onClick={() => { setEditExpo(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-[13px] font-bold hover:bg-cyan-600 transition-colors shadow-sm shadow-cyan-500/20">
          <Plus size={15} /> New Expo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expos…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterStatus} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400">
          {["All","Published","Draft","Archived"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No expos found.</p>
          <p className="text-slate-300 text-[12.5px] mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <p className="sm:hidden text-[11px] text-slate-400 px-4 pt-3">← Scroll to see all columns</p>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Expo","Date","Venue","Status","Attendees","Exhibitors","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(expo => (
                  <tr key={expo.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={expo.image} alt={expo.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-700 whitespace-nowrap">{expo.title}</p>
                          <p className="text-[11px] text-slate-400">{expo.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{expo.startDate}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{expo.city}</td>
                    <td className="px-4 py-3"><StatusBadge status={expo.status} /></td>
                    <td className="px-4 py-3 text-slate-500">{expo.attendees?.toLocaleString() || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{expo.exhibitors || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewExpo(expo)} title="View"
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => { setEditExpo(expo); setShowForm(true); }} title="Edit"
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-cyan-50 text-slate-400 hover:text-cyan-500 transition-colors">
                          <Pencil size={13} />
                        </button>
                        {expo.status !== "Archived" && (
                          <button onClick={() => setConfirm(expo.id)} title="Archive"
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                            <Archive size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {viewExpo && <ExpoModal expo={viewExpo} onClose={() => setViewExpo(null)} />}
      {showForm && <ExpoForm initial={editExpo} onSave={handleSave} onClose={() => { setShowForm(false); setEditExpo(null); }} />}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-6">
            <h3 className="font-bold text-[15px] text-slate-800 mb-2">Archive Expo?</h3>
            <p className="text-[13px] text-slate-500 mb-5">This expo will be hidden from the public. You can unarchive it later.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => handleArchive(confirm)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-colors">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
