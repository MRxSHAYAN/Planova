export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl"
      style={{ background: "#fff", border: "1px solid #E8EEF8" }}>
      {icon && (
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#F0F3FA", color: "#94A3B8" }}>
          {icon}
        </div>
      )}
      <p className="text-[14px] font-bold mb-1" style={{ color: "#09152E" }}>{title}</p>
      {message && <p className="text-[13px] max-w-xs leading-relaxed" style={{ color: "#94A3B8" }}>{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
