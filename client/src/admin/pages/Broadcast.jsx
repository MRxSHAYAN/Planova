import { useState, useEffect } from "react";
import { Send, Users, CalendarDays, Loader2, CheckCircle2 } from "lucide-react";

function authHeader() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("planova_token")}` };
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Broadcast() {
  const [expos,    setExpos]    = useState([]);
  const [selected, setSelected] = useState("");
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");

  useEffect(() => {
    fetch("/api/broadcast/expos", { headers: authHeader() })
      .then(r => r.json())
      .then(data => setExpos(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const selectedExpo = expos.find(e => String(e._id) === selected);

  async function handleSend(e) {
    e.preventDefault();
    if (!selected || !subject.trim() || !message.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/broadcast/send", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ expoId: selected, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to send"); return; }
      setResult(data);
      setSubject("");
      setMessage("");
      setSelected("");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[1.15rem] font-black text-slate-800">Email Broadcast</h1>
        <p className="text-slate-400 text-[13px] mt-0.5">Send an email to all registered attendees of an expo.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">

            {result && (
              <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-700 text-[13.5px]">Email sent</p>
                  <p className="text-[12.5px] text-green-600 mt-0.5">
                    {result.sent} delivered · {result.failed} failed · {result.total} total recipients
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSend} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">Expo</label>
                <select value={selected} onChange={e => setSelected(e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400 bg-white">
                  <option value="">Select expo...</option>
                  {expos.map(ex => (
                    <option key={ex._id} value={ex._id}>
                      {ex.title} — {ex.count} attendee{ex.count !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} required
                  placeholder="e.g. Important update about your upcoming expo"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400" />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={8}
                  placeholder="Write your message to all attendees..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-700 outline-none focus:border-indigo-400 resize-none" />
                <p className="text-[11.5px] text-slate-400 mt-1">
                  Each recipient will receive this with their name personalised in the greeting.
                </p>
              </div>

              <button type="submit" disabled={loading || !selected || !subject || !message}
                className="w-full py-2.5 rounded-lg bg-indigo-500 text-white text-[13.5px] font-bold hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={15} /> Send to {selectedExpo?.count ?? 0} attendee{selectedExpo?.count !== 1 ? "s" : ""}</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Expo list */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100">
              <p className="font-bold text-[13.5px] text-slate-700">Expos & Attendees</p>
            </div>
            {expos.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-slate-400">No expos found.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {expos.map(expo => (
                  <div key={expo._id}
                    className={`px-4 py-3.5 cursor-pointer transition-colors ${selected === String(expo._id) ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                    onClick={() => setSelected(String(expo._id))}>
                    <p className="text-[13px] font-semibold text-slate-700 leading-snug">{expo.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11.5px] text-slate-400">
                        <CalendarDays size={11} /> {formatDate(expo.dateStart)}
                      </span>
                      <span className="flex items-center gap-1 text-[11.5px] text-slate-400">
                        <Users size={11} /> {expo.count} registered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
