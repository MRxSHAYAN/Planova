import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Platform: [
    { to: '/expos',      label: 'Explore Expos'  },
    { to: '/exhibitors', label: 'Exhibitors'      },
    { to: '/schedule',   label: 'Schedule'        },
  ],
  'For Organizers': [
    { to: '/register', label: 'Create an Expo'   },
    { to: '/login',    label: 'Organizer Login'  },
  ],
  'For Exhibitors': [
    { to: '/register', label: 'Apply as Exhibitor' },
    { to: '/login',    label: 'Exhibitor Portal'   },
  ],
  'For Attendees': [
    { to: '/expos',    label: 'Find an Expo'  },
    { to: '/register', label: 'Sign Up Free'  },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top row: brand + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand blurb */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <span className="text-mint text-2xl">◈</span> EventSphere
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The modern platform for organizers, exhibitors, and attendees to connect through world-class expos.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-300 hover:text-mint transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} EventSphere Management. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with React · MERN Stack · Aptech eProject
          </p>
        </div>
      </div>
    </footer>
  );
}
