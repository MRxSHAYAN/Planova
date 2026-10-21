import { useState } from "react";
import { Bell, CheckCheck, Calendar, Users, Map, Settings } from "lucide-react";
import { NOTIFICATIONS } from "../data/adminData";

const typeIcon = { application: ClipboardIcon, expo: Calendar, attendee: Users, booth: Map, system: Settings };

function ClipboardIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  );
}

const typeColor = { application: "bg-cyan-100 text-cyan-600", expo: "bg-blue-100 text-blue-600", attendee: "bg-green-100 text-green-600", booth: "bg-violet-100 text-violet-600", system: "bg-slate-100 text-slate-500" };

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[1.15rem] font-black text-slate-800">Notifications</h1>
          <p className="text-slate-400 text-[13px] mt-0.5">{unread > 0 ? `${unread} unread` : "All caught up!"}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:border-cyan-400 hover:text-cyan-500 transition-colors">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-20 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
            <Bell size={20} className="text-slate-400" />
          </div>
          <p className="text-slate-400 font-semibold">No notifications</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-50 overflow-hidden">
          {notifs.map(n => {
            const Icon = typeIcon[n.type] || Bell;
            return (
              <div key={n.id}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? "bg-cyan-50/40" : ""}`}
                onClick={() => markRead(n.id)}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColor[n.type] || "bg-slate-100 text-slate-500"}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-snug ${!n.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                    {n.message}
                  </p>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">{n.time}</p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
