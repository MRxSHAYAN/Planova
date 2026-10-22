import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  CalendarDays,
  Building2,
  Bookmark,
  UserCircle2,
  LogOut,
} from "lucide-react";
import iconImg from "../../../assets/Icon.png";
import { CURRENT_USER } from "../data/mockData";

const BASE = "/users/dashboard/attendee";

const NAV_GROUPS = [
  {
    group: null,
    items: [
      { label: "Overview",       path: `${BASE}`,                    icon: LayoutDashboard },
    ],
  },
  {
    group: "Discover",
    items: [
      { label: "Explore Events", path: `${BASE}/explore`,            icon: Compass },
      { label: "Exhibitors",     path: `${BASE}/exhibitors`,         icon: Building2 },
    ],
  },
  {
    group: "My Hub",
    items: [
      { label: "My Events",      path: `${BASE}/my-events`,          icon: CalendarCheck },
      { label: "My Schedule",    path: `${BASE}/schedule`,           icon: CalendarDays },
      { label: "Saved Items",    path: `${BASE}/saved`,              icon: Bookmark },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "My Profile",     path: `${BASE}/profile`,            icon: UserCircle2 },
    ],
  },
];

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  return (
    <aside className="flex flex-col h-full w-full overflow-y-auto" style={{ background: "#0A1628" }}>

      {/* Logo */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={iconImg} alt="Planova" className="w-7 h-7 object-contain brightness-0 invert opacity-90" />
          <span className="font-black text-white text-[17px] tracking-tight">Planova</span>
        </div>
        <p className="text-[10.5px] font-medium mt-3 px-0.5" style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.04em" }}>
          ATTENDEE HUB
        </p>
      </div>

      <nav className="flex-1 px-3 pb-3 space-y-5" aria-label="Dashboard navigation">
        {NAV_GROUPS.map(({ group, items }) => (
          <div key={group || "_top"}>
            {group && (
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                {group}
              </p>
            )}
            <ul className="space-y-0.5" role="list">
              {items.map(({ label, path, icon: Icon, badge }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={path === BASE}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        isActive
                          ? "text-white"
                          : "hover:text-white"
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { background: "rgba(52,120,246,0.18)", color: "#fff" }
                        : { color: "rgba(255,255,255,0.48)" }
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Left accent bar */}
                        <span
                          className="absolute left-3 w-0.5 rounded-full transition-all duration-150"
                          style={{
                            height: isActive ? "16px" : "0",
                            background: "#3478F6",
                            opacity: isActive ? 1 : 0,
                          }}
                        />
                        <Icon
                          size={15}
                          strokeWidth={isActive ? 2.3 : 1.8}
                          className="shrink-0 transition-colors"
                          style={{ color: isActive ? "#3478F6" : "inherit" }}
                        />
                        <span className="flex-1">{label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
          style={{ color: "rgba(255,255,255,0.55)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          onClick={() => { navigate(`${BASE}/profile`); onClose?.(); }}
        >
          {/* Initials avatar */}
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
            style={{ background: "#1a2d4d", color: "#3478F6" }}
          >
            {CURRENT_USER.initials}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate leading-none">{CURRENT_USER.name}</p>
            <p className="text-[10.5px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
              {CURRENT_USER.email}
            </p>
          </div>
        </button>

        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] transition-colors mt-0.5"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
          onClick={() => navigate("/login")}
        >
          <LogOut size={13} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
