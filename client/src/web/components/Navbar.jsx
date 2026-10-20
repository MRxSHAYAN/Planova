import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import iconImg from "../../assets/Icon.png";

const ROUTES = {
  home: "/",
  exploreExpos: "/explore-expos",
  exhibitors: "/exhibitors",
  schedule: "/schedule",
  about: "/about",
  login: "/login",
  register: "/register",
};

const NAV_LINKS = [
  ["Explore Expos", ROUTES.exploreExpos],
  ["Exhibitors",    ROUTES.exhibitors],
  ["Schedule",      ROUTES.schedule],
  ["About",         ROUTES.about],
];

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname }            = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const headerBackground = scrolled
    ? "color-mix(in srgb, var(--color-navy) 97%, transparent)"
    : "color-mix(in srgb, var(--color-navy) 85%, transparent)";

  const headerBorderBottom = scrolled
    ? "1px solid color-mix(in srgb, var(--color-accent) 12%, transparent)"
    : "1px solid transparent";

  const headerBoxShadow = scrolled ? "0 1px 20px rgba(0,0,0,0.4)" : "none";

  // Hamburger bar transforms
  const topBarStyle = {
    transform: open ? "translateY(6.5px) rotate(45deg)" : "none",
  };
  const middleBarStyle = {
    opacity: open ? 0 : 1,
  };
  const bottomBarStyle = {
    transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none",
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background:     headerBackground,
        backdropFilter: "blur(12px)",
        borderBottom:   headerBorderBottom,
        boxShadow:      headerBoxShadow,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[62px]">

          <Link to={ROUTES.home} className="select-none flex items-center gap-2">
            <img src={iconImg} alt="Planova" className="w-10 h-10 object-contain brightness-0 invert" />
            <span className="font-black text-[18px] leading-none text-white">
              Planova
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={label} to={href}
                className={`px-3.5 py-1.5 rounded-md text-[13.5px] transition-colors duration-150 ${
                  pathname === href
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/[0.08]"
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to={ROUTES.login}
              className="text-[13px] text-white/50 hover:text-white px-3.5 py-1.5 rounded-md hover:bg-white/[0.08] transition-colors">
              Log in
            </Link>
            <Link to={ROUTES.register}
              className="text-[13px] font-bold px-5 py-2 rounded-lg bg-accent text-navy hover:bg-accent-hover hover:text-white transition-colors">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className="block h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center"
                style={topBarStyle} />
              <span className="block h-[1.5px] bg-current rounded-full transition-all duration-300"
                style={middleBarStyle} />
              <span className="block h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center"
                style={bottomBarStyle} />
            </div>
          </button>
        </div>

        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{ maxHeight: open ? "400px" : "0", opacity: open ? 1 : 0 }}
        >
          <div className="border-t border-white/[0.08] py-3 flex flex-col gap-0.5">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={label} to={href} onClick={() => setOpen(false)}
                className={`text-[14px] px-2.5 py-3 rounded-md transition-colors hover:bg-white/[0.08] ${
                  pathname === href ? "text-white" : "text-white/55 hover:text-white"
                }`}>
                {label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 pb-1">
              <Link to={ROUTES.login} onClick={() => setOpen(false)}
                className="flex-1 text-center text-[13px] font-semibold py-3 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors min-h-[44px] flex items-center justify-center">
                Log in
              </Link>
              <Link to={ROUTES.register} onClick={() => setOpen(false)}
                className="flex-1 text-center text-[13px] font-bold py-3 rounded-lg bg-accent text-navy hover:bg-accent-hover hover:text-white transition-colors min-h-[44px] flex items-center justify-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
