import { STATUS_META, CATEGORY_COLORS } from "../data/mockData";

export function StatusBadge({ status, className = "" }) {
  const meta = STATUS_META[status] || { bg: "#F1F5F9", text: "#64748B", label: status };
  return (
    <span
      className={`inline-flex items-center text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full ${className}`}
      style={{ background: meta.bg, color: meta.text }}
    >
      {meta.label}
    </span>
  );
}

export function CategoryBadge({ label, className = "" }) {
  const c = CATEGORY_COLORS[label] || { bg: "#EEF1F8", text: "#3E506D" };
  return (
    <span
      className={`inline-flex items-center text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full ${className}`}
      style={{ background: c.bg, color: c.text }}
    >
      {label}
    </span>
  );
}
