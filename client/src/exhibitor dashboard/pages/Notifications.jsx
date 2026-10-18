import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { NOTIFICATIONS } from "../data/mockData";

const TYPE_META = {
  approved:     { dot: "#12875A", bg: "#E6F9F1", text: "#12875A",  label: "Approved" },
  booth:        { dot: "#3478F6", bg: "#DCE8FF", text: "#1D4ED8",  label: "Booth" },
  deadline:     { dot: "#D97706", bg: "#FFF4DE", text: "#A16207",  label: "Deadline" },
  profile:      { dot: "#7C3AED", bg: "#F3E8FF", text: "#6D28D9",  label: "Profile" },
  rejected:     { dot: "#B91C1C", bg: "#FEE2E2", text: "#B91C1C",  label: "Not Accepted" },
  announcement: { dot: "#64748B", bg: "#F1F5F9", text: "#475569",  label: "Announcement" },
};

const FILTER_TABS = [
  { key: "all",       label: "All" },
  { key: "unread",    label: "Unread" },
  { key: "approved",  label: "Approvals" },
  { key: "booth",     label: "Booths" },
  { key: "deadline",  label: "Deadlines" },
  { key: "announcement", label: "Announcements" },
];

export default function Notifications() {
  const [items,  setItems]  = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const filtered = items.filter((n) => {
    if (filter === "all")    return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unread      = items.filter((n) => !n.read).length;
  const markAllRead = () => setItems((p) => p.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setItems((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const remove      = (id) => setItems((p) => p.filter((n) => n.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px]" style={{ color: "#64748B" }}>
          {unread > 0
            ? <><span style={{ color: "#09152E", fontWeight: 700 }}>{unread}</span> unread</>
            : "All caught up"}
        </p>
        {unread > 0 && (
          <button className="flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors"
            style={{ color: "#3478F6" }} onClick={markAllRead}>
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {FILTER_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold border shrink-0 transition-all"
            style={filter === key
              ? { background: "#09152E", color: "#fff", borderColor: "#09152E" }
              : { background: "#fff", color: "#3E506D", borderColor: "#E8EEF8" }}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((n) => {
            const meta = TYPE_META[n.type] || { dot: "#94A3B8", bg: "#F1F5F9", text: "#64748B", label: n.type };
            return (
              <div key={n.id} className="rounded-xl overflow-hidden"
                style={{ background: "#fff", border: `1px solid ${!n.read ? "#DCEAFF" : "#E8EEF8"}` }}>
                <div className="flex gap-4 p-4">
                  <span className="w-2 h-2 rounded-full shrink-0 mt-[5px]"
                    style={{ background: n.read ? "#E8EEF8" : meta.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold leading-snug mb-0.5" style={{ color: "#09152E" }}>
                      {n.title}
                      {!n.read && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle" style={{ background: "#3478F6" }} />}
                    </p>
                    <p className="text-[12.5px] leading-relaxed mb-2" style={{ color: "#64748B" }}>{n.message}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: meta.bg, color: meta.text }}>{meta.label}</span>
                      <span className="text-[11px]" style={{ color: "#B0BCC8" }}>{n.timeLabel}</span>
                      {!n.read && (
                        <button className="text-[12px] font-semibold ml-auto transition-colors"
                          style={{ color: "#3478F6" }} onClick={() => markRead(n.id)}>
                          Mark as read
                        </button>
                      )}
                      <button className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                        style={{ color: "#CBD5E1" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
                        onClick={() => remove(n.id)} aria-label="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <CheckCheck size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold" style={{ color: "#09152E" }}>
            {filter === "unread" ? "No unread notifications" : "No notifications"}
          </p>
          <p className="text-[12.5px] mt-1" style={{ color: "#94A3B8" }}>
            {filter === "unread" ? "You're all caught up." : "Notifications appear here."}
          </p>
          {filter !== "all" && (
            <button className="mt-4 text-[12.5px] font-semibold" style={{ color: "#3478F6" }}
              onClick={() => setFilter("all")}>View all</button>
          )}
        </div>
      )}
    </div>
  );
}
