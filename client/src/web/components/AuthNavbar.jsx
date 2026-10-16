import { Link } from "react-router-dom";
import iconImg from "../../assets/Icon.png";

export default function AuthNavbar() {
  return (
    <div className="flex items-center z-index: 50 justify-between px-10 h-[62px] border-b border-[#F1F5F9] bg-white shrink-0">
      <div></div>

      <Link
        to="/"
        className="flex items-center gap-1.5 text-[13px] text-[#94A3B8] hover:text-[#0A1628] transition-colors group"
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
