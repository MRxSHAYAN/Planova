import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, CalendarDays, MapPin, FileText } from "lucide-react";
import { APPLICATIONS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

const TABS = [
  { key: "all",      label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending",  label: "Pending" },
  { key: "rejected", label: "Not Accepted" },
];

function AppCard({ app }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      {/* Main row */}
      <div className="flex gap-4 p-4 sm:p-5">
        <img src={app.expoImage} alt={app.expoTitle}
          className="w-[68px] h-[68px] rounded-lg object-cover shrink-0" style={{ background: "#E5EEFF" }} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <StatusBadge status={app.status} />
          </div>
          <h3 className="text-[14px] font-bold leading-snug mb-1.5" style={{ color: "#09152E" }}>{app.expoTitle}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
              <CalendarDays size={11} style={{ color: "#3478F6" }} /> {app.expoDate}
            </span>
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
              <MapPin size={11} style={{ color: "#3478F6" }} /> {app.expoCity}
            </span>
          </div>
          <p className="text-[11.5px] mt-1" style={{ color: "#94A3B8" }}>Applied {app.appliedDateLabel}</p>
        </div>
        <button onClick={() => setOpen(!open)}
          className="shrink-0 self-start mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "#F0F3FA", color: "#64748B" }}
          aria-expanded={open}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ borderTop: "1px solid #F0F3FA" }}>
          <div className="px-5 py-3.5 flex flex-wrap gap-x-8 gap-y-2" style={{ background: "#FAFBFF" }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>Booth Preference</p>
              <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "#09152E" }}>{app.boothPreference || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>Category</p>
              <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "#09152E" }}>{app.category}</p>
            </div>
            {app.reviewedDateLabel && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>Reviewed</p>
                <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "#09152E" }}>{app.reviewedDateLabel}</p>
              </div>
            )}
          </div>

          {app.organiserNote && (
            <div className="px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>
                Organizer Note
              </p>
              <div className="rounded-lg px-3.5 py-3" style={{
                background: app.status === "rejected" ? "#FEF2F2" : "#F0FDF4",
                border: `1px solid ${app.status === "rejected" ? "#FECACA" : "#BBF7D0"}`,
              }}>
                <p className="text-[13px] leading-relaxed" style={{
                  color: app.status === "rejected" ? "#991B1B" : "#166534",
                }}>
                  {app.organiserNote}
                </p>
              </div>
            </div>
          )}

          <div className="px-5 py-3.5 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
            {app.status === "pending" && (
              <span className="text-[12px] font-medium" style={{ color: "#94A3B8" }}>
                Awaiting organizer review · No action required
              </span>
            )}
            {app.status === "approved" && (
              <span className="text-[12px] font-semibold" style={{ color: "#12875A" }}>
                ✓ Approved — check My Booths for your assignment
              </span>
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
  const navigate  = useNavigate();
  const [tab, setTab] = useState("all");

  const list = tab === "all"
    ? APPLICATIONS
    : APPLICATIONS.filter((a) => a.status === tab);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {TABS.map(({ key, label }) => {
          const count = key === "all"
            ? APPLICATIONS.length
            : APPLICATIONS.filter((a) => a.status === key).length;
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

      {/* Note */}
      <p className="text-[12px]" style={{ color: "#94A3B8" }}>
        Demo data — applications cannot be approved by exhibitors.
      </p>

      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((app) => <AppCard key={app.id} app={app} />)}
        </div>
      ) : (
        <EmptyState
          icon={<FileText size={22} />}
          title="No applications"
          message="You have no applications in this category yet."
          action={
            <button onClick={() => navigate("/exhibitor/explore")}
              className="text-[13px] font-bold" style={{ color: "#3478F6" }}>
              Explore expos →
            </button>
          }
        />
      )}
    </div>
  );
}
