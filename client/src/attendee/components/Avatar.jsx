/**
 * Avatar — shows image if src provided, otherwise initials fallback.
 */
export default function Avatar({ src, initials = "?", size = "md", className = "" }) {
  const sizes = {
    sm: "w-7 h-7 text-[11px]",
    md: "w-9 h-9 text-[13px]",
    lg: "w-12 h-12 text-[16px]",
    xl: "w-16 h-16 text-[20px]",
  };

  const base = `${sizes[size] || sizes.md} rounded-full flex items-center justify-center shrink-0 font-bold select-none overflow-hidden ${className}`;

  if (src) {
    return <img src={src} alt={initials} className={`${base} object-cover`} />;
  }

  return (
    <div
      className={base}
      style={{ background: "var(--color-navy)", color: "var(--color-accent)" }}
    >
      {initials}
    </div>
  );
}
