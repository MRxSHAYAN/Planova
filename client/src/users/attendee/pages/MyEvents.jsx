import { useState, useEffect } from "react";
import { MapPin, CalendarDays, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CAT_COLORS = {
  Technology:  { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:  { bg: "#DDF7E7", text: "#16804A" },
  Energy:      { bg: "#FEF3C7", text: "#92620A" },
  Agriculture: { bg: "#ECFDF5", text: "#065F46" },
  Fashion:     { bg: "#FCE7F3", text: "#9D174D" },
  Food:        { bg: "#FEF3C7", text: "#92620A" },
};

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function EventCard({ reg, onCancel }) {
  const expo = reg.event || {};
  const cat  = CAT_COLORS[expo.category] || { bg: "#EEF1F8", text: "#3E506D" };
  const navigate = useNavigate();
  const isPast = expo.dateEnd && new Date(expo.dateEnd) < new Date();

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="flex gap-4 p-4 sm:p-5">
        {expo.image ? (
          <img src={expo.image} alt={expo.title} className="w-[68px] h-[68px] rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-[68px] h-[68px] rounded-lg shrink-0" style={{ background: "#E5EEFF" }} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.text }}>
              {expo.category}
            </span>
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: isPast ? "#EEF1F8" : "#E6F9F1", color: isPast ? "#3E506D" : "#12875A" }}>
              {isPast ? "Attended" : "Confirmed"}
            </span>
          </div>
          <h3 className="text-[14px] font-bold leading-snug mb-1.5" style={{ color: "#09152E" }}>{expo.title}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
              <CalendarDays size={11} style={{ color: "#3478F6" }} />
              {formatDate(expo.dateStart)}{expo.dateEnd ? `  ${formatDate(expo.dateEnd)}` : ""}
            </span>
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
              <MapPin size={11} style={{ color: "#3478F6" }} />
              {expo.city}
            </span>
          </div>
          <p className="text-[11.5px] mt-1" style={{ color: "#94A3B8" }}>
            Registered {formatDate(reg.registeredAt)}
          </p>
        </div>
      </div>
      {!isPast && (
        <div className="px-5 py-3 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
          <button onClick={() => navigate("/users/dashboard/attendee/schedule")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1D5FE0"}
            onMouseLeave={e => e.currentTarget.style.background = "#3478F6"}>
            View Schedule
          </button>
          <button onClick={() => onCancel(reg._id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors"
            style={{ background: "#F0F3FA", color: "#94A3B8", border: "1px solid #E8EEF8" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.borderColor = "#FECACA"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#F0F3FA"; e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "#E8EEF8"; }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default function MyEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  function fetchRegistrations() {
    const token = localStorage.getItem("planova_token");
    fetch("/api/registrations/mine", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setRegistrations(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchRegistrations(); }, []);

  async function cancelRegistration(id) {
    const token = localStorage.getItem("planova_token");
    await fetch(`/api/registrations/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchRegistrations();
  }

  const now = new Date();
  const upcoming = registrations.filter(r => !r.event?.dateEnd || new Date(r.event.dateEnd) >= now);
  const past      = registrations.filter(r => r.event?.dateEnd && new Date(r.event.dateEnd) < now);
  const list = tab === "upcoming" ? upcoming : past;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {[
          { key: "upcoming", label: `Upcoming (${upcoming.length})` },
          { key: "past",     label: `Past (${past.length})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
            style={tab === key ? { background: "#09152E", color: "#fff" } : { color: "#94A3B8" }}>
            {label}
          </button>
        ))}
      </div>

      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map(reg => <EventCard key={reg._id} reg={reg} onCancel={cancelRegistration} />)}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <CalendarDays size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>
            {tab === "upcoming" ? "No upcoming events" : "No past events"}
          </p>
          <p className="text-[13px]" style={{ color: "#94A3B8" }}>
            {tab === "upcoming" ? "Register for expos to see them here." : "Events you've attended appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
