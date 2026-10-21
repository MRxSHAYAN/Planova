import { useState } from "react";
import { Search, X } from "lucide-react";
import { ATTENDEES, EXPOS } from "../data/adminData";
import StatusBadge from "../components/StatusBadge";

const PER_PAGE = 5;

function AttendeeDetail({ att, onClose }) {
  if (!att) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[14px] font-black text-white shrink-0">
            {att.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="font-black text-slate-800">{att.name}</h2>
            <p className="text-[12.5px] text-slate-400">{att.email}</p>
          </div>
          <StatusBadge status={att.status} />
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors ml-1">
            <X size={14} />
          </button>
        </div>
        <div className="p-5 space-y-0">
          {[
            ["Registered Expo",  att.expo],
            ["Registration Date",att.registeredAt],
            ["Status",           att.status],
            ["Sessions Booked",  att.sessions],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-3 py-2.5 border-b border-slate-50 text-[13px]">
              <span className="font-semibold text-slate-400 w-36 shrink-0">{label}</span>
              <span className="text-slate-700">{val}</span>
            </div>
          ))}
        </div>
        <div className="p-5 pt-0">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[12.5px] text-blue-700">
            📋 Full session history and participation details are available in the attendee's profile.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Attendees() {
  const [search, setSearch]   = useState("");
  const [filterExpo, setExpo] = useState("All");
  const [filterSt, setSt]     = useState("All");
  const [page, setPage]       = useState(1);
  const [selected, setSel]    = useState(null);

  const expoNames = ["All", ...EXPOS.map(e => e.title)];

  const filtered = ATTENDEES.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchExpo   = filterExpo === "All" || a.expo === filterExpo;
    const matchSt     = filterSt === "All" || a.status === filterSt;
    return matchSearch && matchExpo && matchSt;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Attendees & Registrations</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">{filtered.length} attendees · {ATTENDEES.filter(a=>a.status==="Confirmed").length} confirmed</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or email…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
        </div>
        <select value={filterExpo} onChange={e => { setExpo(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400 max-w-[220px]">
          {expoNames.map(n => <option key={n}>{n}</option>)}
        </select>
        <select value={filterSt} onChange={e => { setSt(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-600 outline-none focus:border-cyan-400">
          {["All","Confirmed","Pending","Cancelled"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No attendees found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Attendee","Email","Expo","Registered","Sessions","Status","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                          {att.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700 whitespace-nowrap">{att.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{att.email}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{att.expo}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{att.registeredAt}</td>
                    <td className="px-4 py-3 text-slate-500 text-center">{att.sessions}</td>
                    <td className="px-4 py-3"><StatusBadge status={att.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSel(att)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[12px] font-semibold hover:border-cyan-400 hover:text-cyan-500 transition-colors">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-[13px]">
          <span className="text-slate-400">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-[12.5px] font-semibold transition-colors ${page===p ? "bg-cyan-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-cyan-400"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && <AttendeeDetail att={selected} onClose={() => setSel(null)} />}
    </div>
  );
}
