import { Link } from "react-router-dom";
import iconImg from "../../assets/Icon.png";

const COLS = [
  {
    heading: "Platform",
    links: [
      ["Explore Expos",       "/explore-expos"],
      ["Exhibitor Directory",  "/exhibitors"],
      ["Session Schedule",    "/schedule"],
      ["Floor Plans",         "/floor-plans"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About Us",        "/about"],
      ["Contact",         "/contact"],
      ["Support",         "/support"],
      ["Privacy Policy",  "/privacy"],
    ],
  },
  {
    heading: "Get Involved",
    links: [
      ["Register as Attendee", "/register?role=attendee"],
      ["Apply as Exhibitor",   "/register?role=exhibitor"],
      ["Organizer Portal",     "/register?role=organizer"],
      ["Log In",               "/login"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white/35">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-8">

        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <img src={iconImg} alt="Planova" className="w-11 h-11 object-contain brightness-0 invert" />
            <div className="flex items-baseline gap-0">
              <span className="font-black text-[22px] text-white leading-none">Plan</span>
              <span className="font-black text-[22px] text-[#6B9FFF] leading-none">ova</span>
            </div>
          </div>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-[12.5px] text-white/28 leading-relaxed max-w-[200px]">
              Pakistan's expo and trade show management platform — for organizers,
              exhibitors, and attendees.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white/50 text-[10.5px] font-bold uppercase tracking-[0.18em] mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-[12.5px] hover:text-white/75 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[11.5px] text-white/20">
          <span>© 2026 Planova Management. All rights reserved.</span>
          <span>MERN Stack · Aptech eProject</span>
        </div>
      </div>
    </footer>
  );
}
