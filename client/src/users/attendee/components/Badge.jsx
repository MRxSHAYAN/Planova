import { CATEGORY_COLORS } from "../data/mockData";

export default function Badge({ label, variant = "category", className = "" }) {
  if (variant === "category") {
    const colors = CATEGORY_COLORS[label];
    if (colors) {
      return (
        <span
          className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${className}`}
          style={{ background: colors.bg, color: colors.text }}
        >
          {label}
        </span>
      );
    }
  }

  if (variant === "status") {
    const map = {
      Confirmed:  "bg-[#DDF7E7] text-[#16804A]",
      Pending:    "bg-[#FEF3C7] text-[#92620A]",
      Attended:   "bg-[#E5EEFF] text-[#09152E]",
      Registered: "bg-[#DDF7E7] text-[#16804A]",
      Browse:     "bg-[#F1F5F9] text-[#64748B]",
    };
    const cls = map[label] || "bg-[#F1F5F9] text-[#64748B]";
    return (
      <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cls} ${className}`}>
        {label}
      </span>
    );
  }

  // default neutral
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] ${className}`}>
      {label}
    </span>
  );
}
