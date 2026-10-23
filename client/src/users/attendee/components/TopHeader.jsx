import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

export default function TopHeader({ title, onMenuToggle, mobileMenuOpen }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  const abbr = getInitials(user?.name);

  return (
    <header className="h-[52px] shrink-0 flex items-center gap-3 px-5 sm:px-6"
      style={{ background: "#fff", borderBottom: "1px solid #EEF1F8", zIndex: 10 }}>
      <button className="lg:hidden -ml-1 p-1.5 rounded-md transition-colors" style={{ color: "#94A3B8" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F7FA"; e.currentTarget.style.color = "#09152E"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
        onClick={onMenuToggle}>
        {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>

      <h1 className="flex-1 font-black text-[15px] truncate" style={{ color: "#09152E" }}>{title}</h1>

      <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-colors"
        style={{ background: "#F5F7FA" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#EEF1F8")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F7FA")}
        onClick={() => navigate("/users/dashboard/attendee/profile")}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
        ) : (
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
            style={{ background: "#09152E", color: "#3478F6" }}>
            {abbr}
          </span>
        )}
        <span className="hidden sm:block text-[12px] font-semibold" style={{ color: "#09152E" }}>{firstName}</span>
      </button>
    </header>
  );
}
