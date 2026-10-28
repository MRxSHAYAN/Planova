import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Loader2 } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function BoothCard({ booth, expo }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="px-5 py-4">
        <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>
          {expo?.title || "Expo"}
        </p>
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-[22px] font-black" style={{ color: "#09152E" }}>Booth {booth.boothId}</h3>
          <span className="text-[13px] font-medium" style={{ color: "#64748B" }}>{booth.type}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Size",  value: booth.size || "" },
            { label: "Type",  value: booth.type || "" },
            { label: "Status", value: booth.status },
            { label: "Expo Date", value: formatDate(expo?.dateStart) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg px-3 py-2.5" style={{ background: "#F5F8FF" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{label}</p>
              <p className="text-[12.5px] font-semibold mt-0.5" style={{ color: "#09152E" }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={booth.status} />
          <span className="text-[11.5px]" style={{ color: "#94A3B8" }}>
            Assigned to {booth.exhibitor}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyBooths() {
  const navigate = useNavigate();
  const [booths,  setBooths]  = useState([]);
  const [expos,   setExpos]   = useState({});
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/booths/mine", { headers }),
      fetch("/api/applications/mine", { headers }),
    ]).then(async ([bRes, aRes]) => {
      const boothData = await bRes.json();
      const appData   = await aRes.json();

      const myBooths = Array.isArray(boothData) ? boothData : [];
      setBooths(myBooths);

      // Expo info is already populated from /api/booths/mine
      const expoMap = {};
      myBooths.forEach(b => {
        const id = b.event?._id || b.event;
        if (id && b.event?.title) expoMap[id] = b.event;
      });
      setExpos(expoMap);

      // Approved apps without a booth yet
      const assignedEventIds = new Set(myBooths.map(b => String(b.event?._id || b.event)));
      const approvedApps = (Array.isArray(appData) ? appData : []).filter(
        a => a.status === "approved" && !assignedEventIds.has(String(a.event?._id || a.event))
      );
      setApps(approvedApps);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  return (
    <div className="space-y-5">

      {apps.length > 0 && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "#FFF4DE", border: "1px solid #FDE68A" }}>
          <span className="text-[14px] shrink-0 mt-0.5">!</span>
          <div>
            <p className="text-[13px] font-bold" style={{ color: "#92400E" }}>
              Booth assignment pending
            </p>
            <p className="text-[12.5px] mt-0.5" style={{ color: "#A16207" }}>
              Your application for <strong>{apps[0].event?.title}</strong> is approved.
              The organizer will assign your booth shortly.
            </p>
          </div>
        </div>
      )}

      {booths.length > 0 ? (
        <div className="space-y-4">
          {booths.map(b => {
            const expoId = b.event?._id || b.event;
            return <BoothCard key={b._id} booth={b} expo={expos[expoId]} />;
          })}
        </div>
      ) : (
        <EmptyState
          icon={<MapPin size={22} />}
          title="No booths assigned yet"
          message="Once an organizer approves your application and assigns a booth, all details will appear here."
          action={
            <button onClick={() => navigate("/users/dashboard/exhibitor/explore")}
              className="text-[13px] font-bold" style={{ color: "#3478F6" }}>
              Explore expos 
            </button>
          }
        />
      )}
    </div>
  );
}
