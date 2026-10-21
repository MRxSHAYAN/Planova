const styles = {
  // Expo status
  Published:   "bg-blue-50 text-blue-700 border-blue-200",
  Draft:       "bg-slate-100 text-slate-500 border-slate-200",
  Archived:    "bg-slate-100 text-slate-400 border-slate-200",
  // Application status
  Pending:     "bg-cyan-50 text-cyan-600 border-cyan-200",
  Approved:    "bg-green-50 text-green-700 border-green-200",
  Rejected:    "bg-red-50 text-red-600 border-red-200",
  // User
  Active:      "bg-green-50 text-green-700 border-green-200",
  Inactive:    "bg-slate-100 text-slate-400 border-slate-200",
  Admin:       "bg-cyan-50 text-cyan-700 border-cyan-200",
  Attendee:    "bg-blue-50 text-blue-600 border-blue-200",
  Exhibitor:   "bg-violet-50 text-violet-700 border-violet-200",
  // Booth
  Available:   "bg-green-50 text-green-700 border-green-200",
  Occupied:    "bg-blue-50 text-blue-700 border-blue-200",
  // Registration
  Confirmed:   "bg-green-50 text-green-700 border-green-200",
  Cancelled:   "bg-red-50 text-red-600 border-red-200",
  // Session type
  Keynote:     "bg-slate-800 text-white border-slate-800",
  Talk:        "bg-green-50 text-green-700 border-green-200",
  Workshop:    "bg-amber-50 text-amber-700 border-amber-200",
  Panel:       "bg-blue-50 text-blue-600 border-blue-200",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}
