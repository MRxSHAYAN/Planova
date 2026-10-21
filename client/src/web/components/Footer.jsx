import { Link } from "react-router-dom";
import iconImg from "../../assets/Icon.png";

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-8">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_1fr] gap-10 mb-12">

          {/* Brand */}
          <div className="sm:pr-10">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={iconImg} alt="Planova" className="w-9 h-9 object-contain brightness-0 invert opacity-80" />
              <span className="font-black text-[19px] text-white leading-none tracking-tight">Planova</span>
            </div>
            <p className="text-[12.5px] text-white/28 leading-relaxed max-w-[170px]">
              Expo management for Pakistan's organizers, exhibitors, and attendees.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10.5px] font-bold text-white/35 uppercase tracking-[0.18em] mb-4">Platform</p>
            <ul className="space-y-2.5">
              {[["Explore Expos", "/explore-expos"], ["Exhibitor Directory", "/exhibitors"], ["Session Schedule", "/schedule"]].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-[13px] text-white/40 hover:text-white/70 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10.5px] font-bold text-white/35 uppercase tracking-[0.18em] mb-4">Company</p>
            <ul className="space-y-2.5">
              {[["About Us", "/about"], ["Contact", "/contact"], ["Support", "/support"], ["Privacy Policy", "/privacy"]].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-[13px] text-white/40 hover:text-white/70 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Get involved */}
          <div>
            <p className="text-[10.5px] font-bold text-white/35 uppercase tracking-[0.18em] mb-4">Get involved</p>
            <ul className="space-y-2.5">
              {[["Register as Attendee", "/register"], ["Apply as Exhibitor", "/register"], ["Log In", "/login"]].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-[13px] text-white/40 hover:text-white/70 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[11.5px] text-white/20">
          <span>© 2026 Planova Management. All rights reserved.</span>
          <span>Built with MERN Stack</span>
        </div>
      </div>
    </footer>
  );
}
