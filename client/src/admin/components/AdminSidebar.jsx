import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarRange, ClipboardList, Map,
  Users, CalendarClock, ShieldCheck, BarChart2,
  Settings, LogOut,
} from "lucide-react";
import { ADMIN_USER } from "../data/adminData";
import logo from "../../assets/Icon.png";

const BASE = "/admin";

const NAV_GROUPS = [
  {
    group: null,
    items: [
      { label: "Overview",               path: BASE,                         icon: LayoutDashboard },
    ],
  },
  {
    group: "Expo Operations",
    items: [
      { label: "Expo Management",        path: `${BASE}/expos`,              icon: CalendarRange },
      { label: "Exhibitor Applications", path: `${BASE}/applications`,       icon: ClipboardList, badge: "apps" },
      { label: "Booth & Floor Plan",     path: `${BASE}/booths`,             icon: Map },
    ],
  },
  {
    group: "People",
    items: [
      { label: "Attendees",              path: `${BASE}/attendees`,          icon: Users },
      { label: "Schedule & Sessions",    path: `${BASE}/schedule`,           icon: CalendarClock },
      { label: "Users & Roles",          path: `${BASE}/users`,              icon: ShieldCheck },
    ],
  },
  {
    group: "Insights & System",
    items: [
      { label: "Reports & Analytics",    path: `${BASE}/reports`,            icon: BarChart2 },
      { label: "Settings",               path: `${BASE}/settings`,           icon: Settings },
    ],
  },
];

export default function AdminSidebar({ onClose }) {
  const navigate = useNavigate();
  const pendingApps = 3;

  const getBadge = (key) => {
    if (key === "apps") return pendingApps;
    return 0;
  };

  return (
    <aside className="flex flex-col h-full w-full overflow-y-auto" style={{ background: "#0F172A" }}>

      {/* Logo */}
      <div className="px-5 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 overflow-hidden">
            <img src={logo} alt="Planova" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-black text-white text-[17px] tracking-tight">Planova</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/25">
          <ShieldCheck size={9} className="text-cyan-400" />
          <span className="text-[9.5px] font-bold tracking-widest uppercase text-cyan-400">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-5" aria-label="Admin navigation">
        {NAV_GROUPS.map(({ group, items }) => (
          <div key={group || "_top"}>
            {group && (
              <p className="px-3 mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "rgba(255,255,255,0.22)" }}>
                {group}
              </p>
            )}
            <ul className="space-y-0.5" role="list">
              {items.map(({ label, path, icon: Icon, badge }) => {
                const count = badge ? getBadge(badge) : 0;
                return (
                  <li key={path}>
                    <NavLink
                      to={path}
                      end={path === BASE}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
                          isActive ? "text-white" : "hover:text-white"
                        }`
                      }
                      style={({ isActive }) =>
                        isActive
                          ? { background: "rgba(6,182,212,0.18)", color: "#fff" }
                          : { color: "rgba(255,255,255,0.45)" }
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={15}
                            strokeWidth={isActive ? 2.3 : 1.8}
                            className="shrink-0"
                            style={{ color: isActive ? "#06B6D4" : "inherit" }}
                          />
                          <span className="flex-1">{label}</span>
                          {count > 0 && (
                            <span className="h-4 min-w-[16px] px-1 rounded-full text-[9px] font-black flex items-center justify-center"
                              style={{ background: "#06B6D4", color: "#fff" }}>
                              {count}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          onClick={() => { navigate(`${BASE}/settings`); onClose?.(); }}
        >
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 bg-cyan-500/20 text-cyan-400">
            {ADMIN_USER.initials}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate leading-none">{ADMIN_USER.name}</p>
            <p className="text-[10.5px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.28)" }}>{ADMIN_USER.role}</p>
          </div>
        </button>

        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] transition-all mt-0.5"
          style={{ color: "rgba(255,255,255,0.28)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.28)"; }}
          onClick={() => navigate("/admin/login")}
        >
          <LogOut size={13} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
