import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE = "/users/dashboard/attendee";

export default function SavedItems() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl px-6 py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "#E5EEFF" }}>
        <Bookmark size={20} style={{ color: "#3478F6" }} />
      </div>
      <p className="text-[15px] font-black mb-1" style={{ color: "#09152E" }}>Saved Items</p>
      <p className="text-[13px] mb-6 max-w-xs mx-auto" style={{ color: "#94A3B8" }}>
        Bookmarking sessions and exhibitors is coming soon. For now, explore your registered events and schedule.
      </p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate(`${BASE}/my-events`)}
          className="px-4 py-2 rounded-lg text-[13px] font-semibold"
          style={{ background: "#F5F8FF", border: "1px solid #E8EEF8", color: "#3478F6" }}>
          My Events
        </button>
        <button onClick={() => navigate(`${BASE}/my-schedule`)}
          className="px-4 py-2 rounded-lg text-[13px] font-bold text-white"
          style={{ background: "#3478F6" }}>
          My Schedule
        </button>
      </div>
    </div>
  );
}
