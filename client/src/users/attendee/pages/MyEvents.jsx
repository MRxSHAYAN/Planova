import { useState } from "react";
import { MapPin, CalendarDays, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { EVENTS, CATEGORY_COLORS } from "../data/mockData";
import { useNavigate } from "react-router-dom";

const UPCOMING = EVENTS.filter((e) => e.upcoming && e.registrationStatus);
const PAST     = EVENTS.filter((e) => !e.upcoming && e.registrationStatus === "Attended");

const STATUS_STYLE = {
  Confirmed: { bg: "#E6F9F1", text: "#12875A" },
  Pending:   { bg: "#FFF4DE", text: "#A16207" },
  Attended:  { bg: "#EEF1F8", text: "#3E506D" },
};

function EventRow({ event }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const cat   = CATEGORY_COLORS[event.category] || { bg: "#EEF1F8", text: "#3E506D" };
  const stat  = STATUS_STYLE[event.registrationStatus] || { bg: "#EEF1F8", text: "#3E506D" };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      {/* Main row */}
      <div className="flex gap-4 p-4 sm:p-5">
        {/* Thumbnail */}
        <div className="w-[68px] h-[68px] rounded-lg overflow-hidden shrink-0" style={{ background: "#E5EEFF" }}>
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.text }}>{event.category}</span>
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: stat.bg, color: stat.text }}>{event.registrationStatus}</span>
          </div>
          <h3 className="text-[14px] font-bold leading-snug mb-2" style={{ color: "#09152E" }}>{event.title}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
              <CalendarDays size={11} style={{ color: "#3478F6" }} /> {event.date}
            </span>
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#64748B" }}>
              <MapPin size={11} style={{ color: "#3478F6" }} /> {event.location}
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="shrink-0 self-start mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "#F0F3FA", color: "#64748B" }}
          aria-expanded={open}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded details */}
      {open && (
        <div style={{ borderTop: "1px solid #F0F3FA" }}>
          {/* Metadata strip */}
          <div className="px-5 py-3.5 flex flex-wrap gap-x-8 gap-y-2" style={{ background: "#FAFBFF" }}>
            {[
              { label: "Venue",      value: event.venue },
              { label: "Address",    value: event.address },
              { label: "Exhibitors", value: event.exhibitors },
              { label: "Attendees",  value: event.attendees.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B0BCC8" }}>{label}</p>
                <p className="text-[12.5px] font-medium mt-0.5" style={{ color: "#09152E" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description + tags */}
          <div className="px-5 py-4">
            <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#3E506D" }}>{event.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((t) => (
                <span key={t} className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "#F0F3FA", color: "#3E506D" }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-3.5 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
            {event.upcoming && (
              <>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold text-white transition-colors"
                  style={{ background: "#3478F6" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#1D5FE0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#3478F6"}
                >
                  <CalendarDays size={12} /> Add to Calendar
                </button>
                <button
                  onClick={() => navigate("/users/dashboard/attendee/exhibitors")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ background: "#F0F3FA", color: "#3E506D", border: "1px solid #E8EEF8" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3478F6"; e.currentTarget.style.color = "#3478F6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EEF8"; e.currentTarget.style.color = "#3E506D"; }}
                >
                  <Building2 size={12} /> View Exhibitors
                </button>
              </>
            )}
            {!event.upcoming && (
              <span className="text-[12px] font-medium" style={{ color: "#B0BCC8" }}>
                This event has ended.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyEvents() {
  const [tab, setTab] = useState("upcoming");
  const list = tab === "upcoming" ? UPCOMING : PAST;

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
        {[
          { key: "upcoming", label: `Upcoming (${UPCOMING.length})` },
          { key: "past",     label: `Past (${PAST.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
            style={
              tab === key
                ? { background: "#09152E", color: "#fff" }
                : { color: "#94A3B8" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((ev) => <EventRow key={ev.id} event={ev} />)}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center" style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
          <CalendarDays size={24} style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#09152E" }}>
            {tab === "upcoming" ? "No upcoming events" : "No past events"}
          </p>
          <p className="text-[13px]" style={{ color: "#94A3B8" }}>
            {tab === "upcoming" ? "Register for events to see them here." : "Events you've attended appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
