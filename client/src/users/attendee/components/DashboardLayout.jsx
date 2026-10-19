import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const BASE = "/users/dashboard/attendee";

const PAGE_TITLES = {
  [BASE]:                      "Overview",
  [`${BASE}/explore`]:         "Explore Events",
  [`${BASE}/my-events`]:       "My Events",
  [`${BASE}/schedule`]:        "My Schedule",
  [`${BASE}/exhibitors`]:      "Exhibitors",
  [`${BASE}/saved`]:           "Saved Items",
  [`${BASE}/notifications`]:   "Notifications",
  [`${BASE}/profile`]:         "My Profile",
};

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const title = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F0F3FA" }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[216px] xl:w-[232px] shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0"
            style={{ background: "rgba(9,21,46,0.55)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative z-10 w-[224px] h-full shadow-2xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopHeader
          title={title}
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
          mobileMenuOpen={mobileOpen}
        />
        <main
          className="flex-1 overflow-y-auto"
          id="main-content"
          tabIndex={-1}
        >
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
