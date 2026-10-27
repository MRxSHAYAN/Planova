/**
 * StatCard  summary metric tile used on the Overview page.
 */
export default function StatCard({ icon, label, value, sub, accent = false }) {
  return (
    <div
      className="bg-white rounded-xl border border-[#E1E9F7] p-5 flex flex-col gap-3"
      style={accent ? { borderColor: "var(--color-accent)", borderWidth: "1.5px" } : {}}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#7A8AA5] uppercase tracking-wide">{label}</span>
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[14px]"
          style={{ background: accent ? "var(--color-accent)" : "var(--color-navy)" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <div className="text-[1.75rem] font-black text-[#09152E] leading-none">{value}</div>
        {sub && <div className="text-[12px] text-[#7A8AA5] mt-1">{sub}</div>}
      </div>
    </div>
  );
}
