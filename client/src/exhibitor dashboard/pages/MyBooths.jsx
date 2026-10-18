import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Clock, AlertCircle, Mail } from "lucide-react";
import { BOOTHS, APPLICATIONS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

// Approved apps without a confirmed booth yet
const PENDING_BOOTH = APPLICATIONS.filter(
  (a) => a.status === "approved" && !BOOTHS.find((b) => b.applicationId === a.id)
);

function BoothCard({ booth }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      {/* Expo strip */}
      <div className="relative h-[110px] overflow-hidden" style={{ background: "#E5EEFF" }}>
        <img src={booth.expoImage} alt={booth.expoTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(9,21,46,0.65) 0%, transparent 55%)" }} />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <StatusBadge status={booth.status} />
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4">
        <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>
          {booth.expoTitle}
        </p>
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-[22px] font-black" style={{ color: "#09152E" }}>Booth {booth.boothNumber}</h3>
          <span className="text-[13px] font-medium" style={{ color: "#64748B" }}>{booth.hall}</span>
        </div>

        {/* Booth specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Size",  value: booth.size },
            { label: "Type",  value: booth.type },
            { label: "Level", value: booth.level },
            { label: "Expo",  value: booth.expoDate },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg px-3 py-2.5" style={{ background: "#F5F8FF" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{label}</p>
              <p className="text-[12.5px] font-semibold mt-0.5" style={{ color: "#09152E" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Deadlines */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2.5">
            <Clock size={14} className="shrink-0 mt-0.5" style={{ color: "#D97706" }} />
            <div>
              <p className="text-[11.5px] font-semibold" style={{ color: "#09152E" }}>Setup deadline</p>
              <p className="text-[12px]" style={{ color: "#64748B" }}>{booth.setupDeadline}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock size={14} className="shrink-0 mt-0.5" style={{ color: "#64748B" }} />
            <div>
              <p className="text-[11.5px] font-semibold" style={{ color: "#09152E" }}>Dismantle by</p>
              <p className="text-[12px]" style={{ color: "#64748B" }}>{booth.dismantleDeadline}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-lg px-3.5 py-3 mb-4" style={{ background: "#F0F3FA" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>
            Setup Instructions
          </p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#3E506D" }}>{booth.instructions}</p>
        </div>

        {/* Contact */}
        <a href={`mailto:${booth.organiserContact}`}
          className="flex items-center gap-2 text-[12.5px] font-semibold transition-colors"
          style={{ color: "#3478F6" }}>
          <Mail size={13} /> Contact organizer: {booth.organiserContact}
        </a>
      </div>
    </div>
  );
}

export default function MyBooths() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">

      {/* Pending assignment notice */}
      {PENDING_BOOTH.length > 0 && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "#FFF4DE", border: "1px solid #FDE68A" }}>
          <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#D97706" }} />
          <div>
            <p className="text-[13px] font-bold" style={{ color: "#92400E" }}>
              Booth assignment pending
            </p>
            <p className="text-[12.5px] mt-0.5" style={{ color: "#A16207" }}>
              Your application for <strong>{PENDING_BOOTH[0].expoTitle}</strong> is approved. The organizer
              will assign your booth shortly.
            </p>
          </div>
        </div>
      )}

      {BOOTHS.length > 0 ? (
        <div className="space-y-4">
          {BOOTHS.map((b) => <BoothCard key={b.id} booth={b} />)}
        </div>
      ) : (
        <EmptyState
          icon={<MapPin size={22} />}
          title="No booths assigned yet"
          message="Once an organizer approves your application and assigns a booth, all details will appear here."
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
