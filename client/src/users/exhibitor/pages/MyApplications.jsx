import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, CalendarDays, MapPin, FileText, Loader2 } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

const TABS = [
  { key: "all",      label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending",  label: "Pending" },
  { key: "rejected", label: "Not Accepted" },
];

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AppCard({ app, onBoothChange }) {
  const [open, setOpen] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [booths, setBooths] = useState([]);
  const [loadingBooths, setLoadingBooths] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState("");
  const expo = app.event || {};

  async function loadBooths() {
    if (booths.length > 0) return;
    setLoadingBooths(true);
    try {
      const res = await fetch(`/api/booths/expo/${expo._id}`);
      const data = await res.json();
      setBooths(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoadingBooths(false); }
  }

  async function submitChange() {
    if (!selectedBooth) return;
    await onBoothChange(app._id, selectedBooth);
    setShowChange(false);
    setSelectedBooth("");
  }

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
            <StatusBadge status={app.status} />
          </div>
          <h3 className="text-[14px] font-bold leading-snug mb-1.5" style={{ color: "#09152E" }}>
            {expo.title || "Expo"}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {expo.dateStart && (
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
                <CalendarDays size={11} style={{ color: "#3478F6" }} />
                {formatDate(expo.dateStart)}
              </span>
            )}
            {expo.city && (
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
                <MapPin size={11} style={{ color: "#3478F6" }} />
                {expo.city}
              </span>
            )}
          </div>
          <p className="text-[11.5px] mt-1" style={{ color: "#94A3B8" }}>
            Applied {formatDate(app.appliedAt)}
          </p>
        </div>
        <button onClick={() => setOpen(!open)}
          className="shrink-0 self-start mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "#F0F3FA", color: "#64748B" }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid #F0F3FA" }}>
          <div className="px-5 py-3.5 flex flex-wrap gap-x-8 gap-y-2" style={{ background: "#FAFBFF" }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>Booth Preference</p>
              <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "#09152E" }}>{app.booth || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>Category</p>
              <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "#09152E" }}>{app.category}</p>
            </div>
            {app.reviewedAt && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>Reviewed</p>
                <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "#09152E" }}>{formatDate(app.reviewedAt)}</p>
              </div>
            )}
          </div>

          {app.rejectReason && (
            <div className="px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>Organizer Note</p>
              <div className="rounded-lg px-3.5 py-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <p className="text-[13px] leading-relaxed" style={{ color: "#991B1B" }}>{app.rejectReason}</p>
              </div>
            </div>
          )}

          <div className="px-5 py-3.5" style={{ borderTop: "1px solid #F0F3FA" }}>
            {app.status === "pending" && (
              <span className="text-[12px] font-medium" style={{ color: "#94A3B8" }}>
                Awaiting organizer review
              </span>
            )}
            {app.status === "approved" && (
              <div className="space-y-3">
                <span className="text-[12px] font-semibold" style={{ color: "#12875A" }}>
                  Approved — check My Booths for your assignment
                </span>
                {!showChange ? (
                  <button onClick={() => { setShowChange(true); loadBooths(); }}
                    className="block text-[12px] font-semibold transition-colors"
                    style={{ color: "#3478F6" }}>
                    Request Booth Change →
                  </button>
                ) : (
                  <div className="space-y-2">
                    {loadingBooths ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 size={13} className="animate-spin" style={{ color: "#94A3B8" }} />
                        <span className="text-[12px]" style={{ color: "#94A3B8" }}>Loading booths...</span>
                      </div>
                    ) : booths.length > 0 ? (
                      <select value={selectedBooth} onChange={e => setSelectedBooth(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                        style={{ background: "#F5F8FF", border: "1.5px solid #DCEAFF", color: "#09152E" }}>
                        <option value="">Select a new booth...</option>
                        {booths.map(b => (
                          <option key={b._id} value={b.boothId}>{b.boothId} - {b.type} ({b.size})</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[12px]" style={{ color: "#94A3B8" }}>No available booths for this expo.</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => { setShowChange(false); setSelectedBooth(""); }}
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "#F0F3FA", color: "#64748B" }}>
                        Cancel
                      </button>
                      <button onClick={submitChange} disabled={!selectedBooth}
                        className="text-[12px] font-bold px-3 py-1.5 rounded-lg text-white transition-colors disabled:opacity-40"
                        style={{ background: "#3478F6" }}>
                        Send Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {app.status === "rejected" && (
              <span className="text-[12px] font-medium" style={{ color: "#94A3B8" }}>
                You may apply to other expos from Explore Expos.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    fetch("/api/applications/mine", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setApplications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const list = tab === "all"
    ? applications
    : applications.filter(a => a.status === tab);

  async function handleBoothChange(appId, newBooth) {
    const token = localStorage.getItem("planova_token");
    const res = await fetch(`/api/applications/${appId}/booth-change`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ boothPreference: newBooth }),
    });
    if (res.ok) {
      // Refresh list
      fetch("/api/applications/mine", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => setApplications(Array.isArray(data) ? data : []));
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {TABS.map(({ key, label }) => {
          const count = key === "all"
            ? applications.length
            : applications.filter(a => a.status === key).length;
          return (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
              style={tab === key ? { background: "#09152E", color: "#fff" } : { color: "#94A3B8" }}>
              {label}
              <span className="text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                style={tab === key
                  ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                  : { background: "#F0F3FA", color: "#94A3B8" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[12px]" style={{ color: "#94A3B8" }}>
        Applications are reviewed by the expo organizer.
      </p>

      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map(app => <AppCard key={app._id} app={app} onBoothChange={handleBoothChange} />)}
        </div>
      ) : (
        <EmptyState
          icon={<FileText size={22} />}
          title="No applications"
          message="You have no applications in this category yet."
          action={
            <button onClick={() => navigate("/users/dashboard/exhibitor/explore")}
              className="text-[13px] font-bold" style={{ color: "#3478F6" }}>
              Explore expos →
            </button>
          }
        />
      )}
    </div>
  );
}
