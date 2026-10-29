import { useState, useEffect } from "react";
import { Bookmark, CalendarDays, Clock, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE = "/users/dashboard/attendee";

const CAT_COLORS = {
  Keynote:  { bg: "#DCE8FF", text: "#09152E" },
  Panel:    { bg: "#E5EEFF", text: "#3478F6" },
  Workshop: { bg: "#FEF3C7", text: "#92620A" },
  Talk:     { bg: "#DDF7E7", text: "#16804A" },
};

export default function SavedItems() {
  const navigate = useNavigate();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("planova_token");
  const auth  = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch("/api/saved-sessions", { headers: auth })
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function remove(sessionId) {
    setItems(p => p.filter(i => String(i.session?._id || i.session) !== String(sessionId)));
    await fetch(`/api/saved-sessions/${sessionId}`, { method: "DELETE", headers: auth }).catch(() => {});
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={20} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  if (items.length === 0) return (
    <div className="rounded-xl px-6 py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#E5EEFF" }}>
        <Bookmark size={20} style={{ color: "#3478F6" }} />
      </div>
      <p className="text-[15px] font-black mb-1" style={{ color: "#09152E" }}>No saved sessions</p>
      <p className="text-[13px] mb-6" style={{ color: "#94A3B8" }}>
        Bookmark sessions from My Schedule to see them here.
      </p>
      <button onClick={() => navigate(`${BASE}/my-schedule`)}
        className="px-5 py-2 rounded-lg text-[13px] font-bold text-white"
        style={{ background: "#3478F6" }}>
        Go to My Schedule
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-[13px] font-semibold" style={{ color: "#64748B" }}>
        {items.length} saved session{items.length !== 1 ? "s" : ""}
      </p>
      {items.map(item => {
        const s   = item.session || {};
        const cat = CAT_COLORS[s.type] || { bg: "#EEF1F8", text: "#3E506D" };
        return (
          <div key={item._id} className="flex gap-4 items-start p-4 rounded-xl"
            style={{ background: "#fff", border: "1px solid #E8EEF8" }}>

            <div className="w-[52px] text-center py-2.5 rounded-lg shrink-0" style={{ background: "#F5F8FF" }}>
              <p className="text-[12px] font-bold" style={{ color: "#3478F6" }}>{s.time}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
                {s.date ? new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full mb-1.5"
                style={{ background: cat.bg, color: cat.text }}>
                {s.type}
              </span>
              <p className="text-[13.5px] font-bold leading-snug mb-1" style={{ color: "#09152E" }}>{s.title}</p>
              <p className="text-[12px]" style={{ color: "#64748B" }}>{s.speaker}</p>
              <p className="text-[11.5px] mt-1 flex items-center gap-1" style={{ color: "#94A3B8" }}>
                <Clock size={10} /> {s.room}
                {s.event?.title && <span> · {s.event.title}</span>}
              </p>
            </div>

            <button
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ color: "#CBD5E1" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
              onClick={() => remove(s._id)}
              aria-label="Remove">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
