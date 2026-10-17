import { useState } from "react";
import { Bookmark, MapPin, Calendar, Users } from "lucide-react";
import Badge from "./Badge";

/**
 * EventCard — used on Explore Events and My Events pages.
 * onSave: (eventId) => void
 * onView: (event) => void
 * onRegister: (event) => void
 */
export default function EventCard({ event, onSave, onView, onRegister, compact = false }) {
  const [saved, setSaved] = useState(event.saved);

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
    onSave?.(event.id);
  };

  return (
    <article
      className="group bg-white rounded-xl border border-[#E1E9F7] overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => onView?.(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onView?.(event)}
      aria-label={`View ${event.title}`}
    >
      {/* Image */}
      <div className="relative h-[148px] overflow-hidden bg-[#E5EEFF] shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09152E]/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge label={event.category} variant="category" />
        </div>
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
          aria-label={saved ? "Remove bookmark" : "Bookmark event"}
        >
          <Bookmark
            size={13}
            className={saved ? "text-[#3478F6] fill-[#3478F6]" : "text-[#7A8AA5]"}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[#09152E] font-bold text-[13.5px] leading-snug mb-2.5 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[12px] text-[#3E506D]">
            <Calendar size={12} className="shrink-0 text-[#3478F6]" />
            {event.date}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#3E506D]">
            <MapPin size={12} className="shrink-0 text-[#3478F6]" />
            {event.location}
          </div>
          {!compact && (
            <div className="flex items-center gap-1.5 text-[12px] text-[#3E506D]">
              <Users size={12} className="shrink-0 text-[#3478F6]" />
              {event.attendees.toLocaleString()} attending · {event.exhibitors} exhibitors
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
          {event.registrationStatus ? (
            <Badge label={event.registrationStatus} variant="status" />
          ) : (
            <span className="text-[11px] text-[#7A8AA5]">Not registered</span>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {(!event.registrationStatus || event.registrationStatus === "Browse") && (
              <button
                onClick={(e) => { e.stopPropagation(); onRegister?.(event); }}
                className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-[#3478F6] text-white hover:bg-[#1D5FE0] transition-colors"
              >
                Register
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onView?.(event); }}
              className="text-[12px] font-semibold text-[#3478F6] hover:text-[#1D5FE0] transition-colors"
            >
              View →
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
