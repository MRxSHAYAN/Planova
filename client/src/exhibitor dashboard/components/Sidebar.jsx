import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  FileText,
  MapPin,
  Building2,
  Package,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import iconImg from "../../assets/Icon.png";
import { CURRENT_COMPANY, NOTIFICATIONS } from "../data/mockData";

const NAV_GROUPS = [
  {
    group: null,
    items: [
      { label: "Overview",          path: "/exhibitor",                    icon: LayoutDashboard },
    ],
  },
  {
    group: "Expos",
    items: [
      { label: "Explore Expos",     path: "/exhibitor/explore",            icon: Compass },
      { label: "My Applications",   path: "/exhibitor/applications",       icon: FileText },
      { label: "My Booths",         path: "/exhibitor/booths",             icon: MapPin },
    ],
  },
  {
    group: "Company",
    items: [
      { label: "Company Profile",   path: "/exhibitor/profile",            icon: Building2 },
      { label: "Products & Services", path: "/exhibitor/products",         icon: Package },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "Messages",          path: "/exhibitor/messages",           icon: MessageSquare, badge: "messages" },
      { label: "Notifications",     path: "/exhibitor/notifications",      icon: Bell,          badge: "notifications" },
      { label: "Settings",          path: "/exhibitor/settings",           icon: Settings },
    ],
  },
];

export default function Sidebar({ onClose }) {
  const navigate  = useNavigate();
  const unreadN   = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <aside
      className="flex flex-col h-full w-full overflow-y-auto"
      style={{ background: "#0A1628" }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={iconImg} alt="Planova" className="w-7 h-7 object-contain brightness-0 invert opacity-90" />
          <span className="font-black text-white text-[17px] tracking-tight">Planova</span>
        </div>
        <p
          className="text-[10.5px] font-medium mt-3 px-0.5"
          style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.04em" }}
        >
          EXHIBITOR WORKSPACE
        </p>
      </div>

      <nav className="flex-1 px-3 pb-3 space-y-5" aria-label="Exhibitor navigation">
        {NAV_GROUPS.map(({ group, items }) => (
          <div key={group || "_top"}>
            {group && (
              <p
                className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {group}
              </p>
            )}
            <ul className="space-y-0.5" role="list">
              {items.map(({ label, path, icon: Icon, badge }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={path === "/exhibitor"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        isActive ? "text-white" : "hover:text-white"
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
                        <Icon
                          size={15}
                          strokeWidth={isActive ? 2.3 : 1.8}
                          className="shrink-0"
                          style={{ color: isActive ? "#3478F6" : "inherit" }}
                        />
                        <span className="flex-1">{label}</span>
                        {badge === "notifications" && unreadN > 0 && (
                          <span
                            className="h-4 min-w-4 px-1 rounded-full text-white font-black flex items-center justify-center"
                            style={{ background: "#3478F6", fontSize: "9px" }}
                          >
                            {unreadN}
                          </span>
                        )}
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
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          onClick={() => { navigate("/exhibitor/profile"); onClose?.(); }}
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
            style={{ background: CURRENT_COMPANY.logoColor, color: "#fff" }}
          >
            {CURRENT_COMPANY.initials}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate leading-none">
              {CURRENT_COMPANY.name}
            </p>
            <p className="text-[10.5px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
              {CURRENT_COMPANY.email}
            </p>
          </div>
        </button>

        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] transition-colors mt-0.5"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.3)";
          }}
          onClick={() => navigate("/login")}
        >
          <LogOut size={13} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
