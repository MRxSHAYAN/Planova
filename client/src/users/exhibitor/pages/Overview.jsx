import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../../../context/AuthContext";

const BASE = "/users/dashboard/exhibitor";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Overview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    fetch("/api/applications/mine", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setApps(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.company || user?.name || "Exhibitor";
  const approved = apps.filter(a => a.status === "approved").length;
  const pending  = apps.filter(a => a.status === "pending").length;
  const rejected = apps.filter(a => a.status === "rejected").length;
  const latestApp = apps[0];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin" style={{ color: "#3478F6" }} />
    </div>
  );

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium" style={{ color: "#3478F6" }}>Welcome back,</p>
          <h2 className="text-[22px] font-black leading-tight mt-0.5" style={{ color: "#09152E" }}>{displayName}</h2>
          <p className="text-[13px] mt-1" style={{ color: "#64748B" }}>
            {approved} approved  {pending} pending  {rejected} not accepted
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => navigate(`${BASE}/explore`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: "#fff", border: "1px solid #E8EEF8", color: "#3E506D" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#3478F6"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E8EEF8"}>
            Explore Expos
          </button>
          <button onClick={() => navigate(`${BASE}/applications`)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-colors"
            style={{ background: "#3478F6" }}>
            Applications
          </button>
        </div>
      </div>

      <div className="rounded-xl px-5 py-4 flex flex-wrap gap-x-8 gap-y-3"
        style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {[
          { icon: FileText,    label: "Applications", value: apps.length,    color: "#3478F6" },
          { icon: CheckCircle2, label: "Approved",     value: approved,      color: "#12875A" },
          { icon: Clock,        label: "Pending",      value: pending,       color: "#D97706" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={15} style={{ color, flexShrink: 0 }} />
            <span className="text-[13px] font-semibold" style={{ color: "#09152E" }}>{value}</span>
            <span className="text-[12.5px]" style={{ color: "#94A3B8" }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">

          {latestApp ? (
            <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <div className="px-5 py-4">
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "#3478F6" }}>
                  Latest application
                </p>
                <h3 className="text-[15px] font-black leading-snug mb-2" style={{ color: "#09152E" }}>
                  {latestApp.event?.title || "Expo"}
                </h3>
                <p className="text-[12px] mb-3" style={{ color: "#64748B" }}>
                  Applied {formatDate(latestApp.appliedAt)}
                </p>
                <div className="mb-3">
                  <StatusBadge status={latestApp.status} />
                </div>
                {latestApp.status === "rejected" && latestApp.rejectReason && (
                  <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <p className="text-[11.5px] font-semibold mb-0.5" style={{ color: "#B91C1C" }}>Rejection reason</p>
                    <p className="text-[12.5px]" style={{ color: "#991B1B" }}>{latestApp.rejectReason}</p>
                  </div>
                )}
                {latestApp.status === "approved" && (
                  <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: "#E6F9F1", border: "1px solid #A7F3D0" }}>
                    <p className="text-[12.5px] font-semibold" style={{ color: "#12875A" }}>
                      Approved! Check My Booths for your assignment.
                    </p>
                  </div>
                )}
                <button onClick={() => navigate(`${BASE}/applications`)}
                  className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#3478F6" }}>
                  All applications <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-5 flex items-start gap-3"
              style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
              <AlertCircle size={15} className="shrink-0 mt-0.5" style={{ color: "#94A3B8" }} />
              <div>
                <p className="text-[13px] font-semibold mb-0.5" style={{ color: "#09152E" }}>No applications yet</p>
                <p className="text-[12.5px]" style={{ color: "#94A3B8" }}>
                  Browse expos and apply to exhibit. Your applications will appear here.
                </p>
                <button onClick={() => navigate(`${BASE}/explore`)}
                  className="mt-3 text-[12px] font-bold" style={{ color: "#3478F6" }}>
                  Explore expos 
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
            <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #F0F3FA" }}>
              <p className="text-[13px] font-black" style={{ color: "#09152E" }}>Quick links</p>
            </div>
            <div className="divide-y" style={{ borderColor: "#F0F3FA" }}>
              {[
                { label: "View my applications", path: `${BASE}/applications` },
                { label: "Explore upcoming expos", path: `${BASE}/explore` },
                { label: "Manage my booths", path: `${BASE}/booths` },
                { label: "Update company profile", path: `${BASE}/profile` },
                { label: "Products & Services", path: `${BASE}/products` },
              ].map(({ label, path }) => (
                <button key={path} onClick={() => navigate(path)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors"
                  style={{ color: "#09152E" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span className="text-[13px] font-medium">{label}</span>
                  <ArrowRight size={13} style={{ color: "#94A3B8" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
