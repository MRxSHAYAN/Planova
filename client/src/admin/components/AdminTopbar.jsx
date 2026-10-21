import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import { ADMIN_USER, NOTIFICATIONS } from "../data/adminData";

export default function AdminTopbar({ title, onMenuToggle }) {
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="h-[56px] shrink-0 flex items-center gap-3 px-5 bg-white border-b border-slate-200">

      {/* Hamburger — mobile only */}
      <button
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-cyan-400 hover:text-cyan-500 transition-colors"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu size={17} />
      </button>

      {/* Page title */}
      <span className="flex-1 font-bold text-[15px] text-slate-800 truncate">{title}</span>

      {/* Notifications */}
      <button
        className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-cyan-400 hover:text-cyan-500 transition-colors"
        onClick={() => navigate("/admin/notifications")}
        aria-label="Notifications"
      >
        <Bell size={15} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500 border-[1.5px] border-white" />
        )}
      </button>

      {/* Profile */}
      <div className="relative">
        <button
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-50 transition-colors"
          onClick={() => setDropOpen((v) => !v)}
        >
          <div className="w-7 h-7 rounded-full bg-cyan-500/15 text-cyan-600 text-[11px] font-black flex items-center justify-center border-2 border-cyan-200">
            {ADMIN_USER.initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[12.5px] font-bold text-slate-800 leading-tight">{ADMIN_USER.name}</span>
            <span className="text-[10.5px] text-slate-400 leading-tight">{ADMIN_USER.role}</span>
          </div>
          <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
        </button>

        {dropOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
            <div className="absolute right-0 top-[calc(100%+6px)] z-20 bg-white border border-slate-200 rounded-xl shadow-xl w-[200px] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[13px] font-bold text-slate-800">{ADMIN_USER.name}</p>
                <p className="text-[11.5px] text-slate-400">{ADMIN_USER.email}</p>
              </div>
              {[
                { label: "Settings", icon: Settings, path: "/admin/settings" },
                { label: "Sign out", icon: LogOut, path: "/admin/login", danger: true },
              ].map(({ label, icon: Icon, path, danger }) => (
                <button key={label}
                  onClick={() => { navigate(path); setDropOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors ${danger ? "text-red-500" : "text-slate-700"}`}>
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
