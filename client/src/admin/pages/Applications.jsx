import { useState } from "react";
import { Search, Eye, Check, X, Building2, Globe, Phone, Mail } from "lucide-react";
import { APPLICATIONS } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

function AppDetail({ app, onApprove, onReject, onClose }) {
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[14px] font-black text-slate-600 shrink-0">
            {app.company.substring(0,2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-black text-[1rem] text-slate-800">{app.company}</h2>
            <p className="text-[12.5px] text-slate-400">{app.city} · {app.category}</p>
          </div>
          <StatusBadge status={app.status} />
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors ml-1">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Company info */}
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            {[
              [Mail, app.email], [Phone, app.phone],
              [Globe, app.company], [Building2, `Founded ${app.founded}`],
            ].map(([Icon, text], i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <Icon size={13} className="text-orange-500 shrink-0" />
                <span className="truncate">{text}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[12px] font-bold text-slate-500 mb-1 uppercase tracking-wide">About</p>
            <p className="text-[13px] text-slate-700 leading-relaxed">{app.desc}</p>
          </div>

          {/* Application details */}
          {[
            ["Expo Applied For", app.expo],
            ["Booth Preference", app.booth],
            ["Applied Date", app.appliedAt],
            ["Employees", app.employees],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-3 py-2 border-b border-slate-50 text-[13px]">
              <span className="font-semibold text-slate-400 w-36 shrink-0">{label}</span>
              <span className="text-slate-700">{val}</span>
            </div>
          ))}

          {app.rejectReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-[11.5px] font-bold text-red-500 uppercase mb-1">Rejection Reason</p>
              <p className="text-[13px] text-red-700">{app.rejectReason}</p>
            </div>
          )}

          {/* Reject reason input */}
          {showReject && (
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1">Rejection Reason</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Explain why this application is being rejected…"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-red-400 resize-none transition-all" />
            </div>
          )}

          {/* Actions — only for pending */}
          {app.status === "Pending" && (
            <div className="flex gap-3 pt-2">
              {showReject ? (
                <>
                  <button onClick={() => setShowReject(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={() => onReject(app.id, rejectReason)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-colors">
                    Confirm Rejection
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowReject(true)} className="flex-1 py-2.5 rounded-lg border border-red-200 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                    <X size={13} /> Reject
                  </button>
                  <button onClick={() => onApprove(app.id)} className="flex-1 py-2.5 rounded-lg bg-green-500 text-white text-[13px] font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5">
                    <Check size={13} /> Approve
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Applications() {
  const [apps, setApps]       = useState(APPLICATIONS);
  const [search, setSearch]   = useState("");
  const [activeTab, setTab]   = useState("All");
  const [selected, setSelected] = useState(null);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

  const tabs = ["All", "Pending", "Approved", "Rejected"];
  const counts = Object.fromEntries(tabs.map(t => [t, t === "All" ? apps.length : apps.filter(a => a.status === t).length]));

  const filtered = apps.filter(a => {
    const matchSearch = a.company.toLowerCase().includes(search.toLowerCase()) || a.expo.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "All" || a.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleApprove = (id) => {
    setApps(p => p.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    showToast("Application approved.");
    setSelected(null);
  };

  const handleReject = (id, reason) => {
    setApps(p => p.map(a => a.id === id ? { ...a, status: "Rejected", rejectReason: reason || "No reason provided." } : a));
    showToast("Application rejected.", "error");
    setSelected(null);
  };

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] ${toast.type === "error" ? "bg-red-500" : "bg-green-500"} text-white px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold flex items-center gap-2`}>
          <span>{toast.type === "error" ? "✕" : "✓"}</span> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Exhibitor Applications</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">{counts["Pending"]} pending review · {counts["Approved"]} approved</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-5">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setTab(tab)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all -mb-px ${
              activeTab === tab ? "border-orange-500 text-orange-500" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}>
            {tab}
            <span className={`ml-1.5 text-[10.5px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400"
            }`}>{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-sm mb-5">
        <Search size={14} className="text-slate-400 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company or expo…"
          className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No applications found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Company","Contact","Expo","Applied","Booth","Status","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">
                          {app.company.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700 whitespace-nowrap">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{app.contact}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">{app.expo}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{app.appliedAt}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-slate-500">{app.booth}</td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(app)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 text-[12px] font-semibold hover:bg-orange-100 transition-colors">
                        <Eye size={12} /> Review
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
        <AppDetail
          app={selected}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
