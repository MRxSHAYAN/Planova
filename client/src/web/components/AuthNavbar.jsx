import { Link } from "react-router-dom";

export default function AuthNavbar() {
  return (
    <div className="flex items-center z-50 justify-between px-10 h-[62px] border-b border-border-card bg-surface shrink-0">
      <div></div>

      <Link
        to="/"
        className="flex items-center gap-1.5 text-[13px] text-muted hover:text-dark transition-colors group"
      >
        <svg
          className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Return to website
      </Link>
    </div>
  );
}
