import { useState, useEffect } from "react";
import { Search, Trash2, Mail, MailOpen, X, Loader2, CornerUpLeft } from "lucide-react";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MessageDetail({ msg, onClose, onReplied, onDelete }) {
  if (!msg) return null;

  const replyUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent("Re: " + msg.subject)}&body=${encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out.\n\n---\nYour message:\n${msg.message}\n`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[15px] text-slate-800">{msg.subject}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={14} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-black text-slate-600 shrink-0">
              {msg.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-800">{msg.name}</p>
              <p className="text-[12px] text-slate-400">{msg.email}</p>
            </div>
            <span className="ml-auto text-[11px] text-slate-400">{formatDate(msg.createdAt)}</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
          </div>

          <div className="flex gap-2">
            <a href={replyUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => onReplied(msg._id)}
              className="flex-1 py-2.5 rounded-lg bg-indigo-500 text-white text-[13px] font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
              <CornerUpLeft size={14} /> Reply via Gmail
            </a>
            <button onClick={() => onDelete(msg._id)}
              className="px-3 py-2.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-[13px] font-semibold transition-colors flex items-center gap-1.5">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function fetchMsgs() {
    setLoading(true);
    fetch("/api/contacts", { headers: authHeader() })
      .then(r => r.json())
      .then(data => setMsgs(Array.isArray(data) ? data : []))
      .catch(() => showToast("Failed to load", "err"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchMsgs(); }, []);

  async function handleReplied(id) {
    await fetch(`/api/contacts/${id}/replied`, { method: "PUT", headers: authHeader() });
    showToast("Marked as replied");
    setSelected(null);
    fetchMsgs();
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/contacts/${id}`, { method: "DELETE", headers: authHeader() });
    if (!res.ok) return showToast("Delete failed", "err");
    showToast("Message deleted");
    setSelected(null);
    fetchMsgs();
  }

  async function handleMarkRead(id) {
    await fetch(`/api/contacts/${id}/read`, { method: "PUT", headers: authHeader() });
    fetchMsgs();
  }

  const tabs = ["All", "New", "Read", "Replied"];
  const counts = {
    All: msgs.length,
    New: msgs.filter(m => m.status === "new").length,
    Read: msgs.filter(m => m.status === "read").length,
    Replied: msgs.filter(m => m.status === "replied").length,
  };

  const filtered = msgs.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase())
      || m.email?.toLowerCase().includes(search.toLowerCase())
      || m.subject?.toLowerCase().includes(search.toLowerCase());
    const matchTab = filter === "All" || m.status === filter.toLowerCase();
    return matchSearch && matchTab;
  });

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
        <h1 className="text-[1.15rem] font-black text-slate-800">Contact Messages</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">
          {counts.New} new · {counts.Replied} replied · {msgs.length} total
        </p>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-5">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-all ${
              filter === tab ? "border-indigo-500 text-indigo-500" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}>
            {tab}
            <span className={`ml-1.5 text-[10.5px] px-1.5 py-0.5 rounded-full font-bold ${filter === tab ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-sm mb-5">
        <Search size={14} className="text-slate-400 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, or subject"
          className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder-slate-400" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-slate-400 font-semibold">No messages found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Name", "Subject", "Date", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(msg => (
                  <tr key={msg._id} className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => { setSelected(msg); if (msg.status === "new") handleMarkRead(msg._id); }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {msg.status === "new" && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                        <div>
                          <p className="font-semibold text-slate-700">{msg.name}</p>
                          <p className="text-[11px] text-slate-400">{msg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{msg.subject}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                        msg.status === "new" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                        msg.status === "read" ? "bg-slate-50 text-slate-500 border-slate-100" :
                        "bg-green-50 text-green-700 border-green-100"
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setSelected(msg); }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[12px] font-semibold hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                          View
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
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

      {selected && (
        <MessageDetail
          msg={selected}
          onClose={() => setSelected(null)}
          onReplied={handleReplied}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
