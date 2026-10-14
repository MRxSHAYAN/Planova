import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/expos',      label: 'Explore Expos' },
  { to: '/exhibitors', label: 'Exhibitors'     },
  { to: '/schedule',   label: 'Schedule'       },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-mint' : 'text-gray-500 hover:text-navy'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-navy font-bold text-xl">
          <span className="text-mint text-2xl leading-none">◈</span>
          <span>EventSphere</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-navy hover:text-mint transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-navy text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-navy-light transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-navy p-1"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <hr className="border-gray-200" />
          <Link
            to="/login"
            className="text-sm font-semibold text-navy"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-navy text-white text-sm font-semibold px-5 py-2 rounded-lg text-center"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
