import { useNavigate } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { CURRENT_COMPANY, NOTIFICATIONS } from "../data/mockData";

export default function TopHeader({ title, onMenuToggle, mobileMenuOpen }) {
  const navigate = useNavigate();
  const unread   = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header
      className="h-[52px] shrink-0 flex items-center gap-3 px-5 sm:px-6"
      style={{ background: "#fff", borderBottom: "1px solid #EEF1F8", zIndex: 10 }}
    >
      {/* Mobile hamburger */}
      <button
        className="lg:hidden -ml-1 p-1.5 rounded-md transition-colors"
        style={{ color: "#94A3B8" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F7FA"; e.currentTarget.style.color = "#09152E"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
        onClick={onMenuToggle}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>

      {/* Title */}
      <h1 className="flex-1 font-black text-[15px] truncate" style={{ color: "#09152E", letterSpacing: "-0.01em" }}>
        {title}
      </h1>

      {/* Bell */}
      <button
        className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
        style={{ color: "#94A3B8" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F7FA"; e.currentTarget.style.color = "#09152E"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
        onClick={() => navigate("/users/dashboard/exhibitor/notifications")}
        aria-label={`${unread} unread notifications`}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-[7px] h-[7px] rounded-full" style={{ background: "#3478F6" }} />
        )}
      </button>

      {/* Company chip */}
      <button
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-colors"
        style={{ background: "#F5F7FA" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#EEF1F8")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F7FA")}
        onClick={() => navigate("/users/dashboard/exhibitor/profile")}
        aria-label="Company profile"
      >
        <span
          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 text-white"
          style={{ background: CURRENT_COMPANY.logoColor }}
        >
          {CURRENT_COMPANY.initials}
        </span>
        <span className="hidden sm:block text-[12px] font-semibold" style={{ color: "#09152E" }}>
          {CURRENT_COMPANY.name.split(" ")[0]}
        </span>
      </button>
    </header>
  );
}
