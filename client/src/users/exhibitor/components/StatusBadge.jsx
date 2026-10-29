 const STATUS_META = {
  approved:  { bg: "#E6F9F1", text: "#12875A", label: "Approved" },
  pending:   { bg: "#FFF4DE", text: "#A16207", label: "Pending" },
  rejected:  { bg: "#FEE2E2", text: "#B91C1C", label: "Not Accepted" },
  confirmed: { bg: "#E6F9F1", text: "#12875A", label: "Confirmed" },
  withdrawn: { bg: "#F1F5F9", text: "#64748B", label: "Withdrawn" },
};

const CATEGORY_COLORS = {
  Technology:   { bg: "#DCE8FF", text: "#09152E" },
  Healthcare:   { bg: "#DDF7E7", text: "#16804A" },
  Energy:       { bg: "#FEF3C7", text: "#92620A" },
  Agriculture:  { bg: "#ECFDF5", text: "#065F46" },
  Fashion:      { bg: "#FCE7F3", text: "#9D174D" },
  Food:         { bg: "#FEF3C7", text: "#92620A" },
  "Enterprise Software": { bg: "#EDE9FE", text: "#5B21B6" },
  "Business Intelligence": { bg: "#CFFAFE", text: "#155E75" },
  Cybersecurity: { bg: "#FEE2E2", text: "#991B1B" },
  Cloud:        { bg: "#DBEAFE", text: "#1E40AF" },
  Fintech:      { bg: "#DDF7E7", text: "#16804A" },
  SaaS:         { bg: "#DCE8FF", text: "#09152E" },
  Other:        { bg: "#EEF1F8", text: "#3E506D" },
};

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
