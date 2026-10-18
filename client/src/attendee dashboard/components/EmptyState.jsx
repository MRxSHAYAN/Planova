/**
 * EmptyState — friendly placeholder when a list is empty.
 */
export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-[#F5F7FA] flex items-center justify-center mb-4 text-[#7A8AA5]">
          {icon}
        </div>
      )}
      <h3 className="text-[15px] font-bold text-[#09152E] mb-1.5">{title}</h3>
      {message && <p className="text-[13px] text-[#7A8AA5] max-w-xs leading-relaxed">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
