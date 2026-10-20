import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

const BASE = "/admin";

const TITLES = {
  [BASE]:                       "Overview",
  [`${BASE}/expos`]:            "Expo Management",
  [`${BASE}/applications`]:     "Exhibitor Applications",
  [`${BASE}/booths`]:           "Booth & Floor Plan",
  [`${BASE}/attendees`]:        "Attendees & Registrations",
  [`${BASE}/schedule`]:         "Schedule & Sessions",
  [`${BASE}/users`]:            "Users & Roles",
  [`${BASE}/reports`]:          "Reports & Analytics",
  [`${BASE}/notifications`]:    "Notifications",
  [`${BASE}/settings`]:         "Settings",
};

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const title = TITLES[pathname]
    || (pathname.startsWith(`${BASE}/expos/`)        ? "Expo Details"
    :   pathname.startsWith(`${BASE}/applications/`) ? "Application Review"
    :   "Admin");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[220px] xl:w-[236px] shrink-0 h-full">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative z-10 w-[224px] h-full shadow-2xl">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <AdminTopbar
          title={typeof title === "string" ? title : "Admin"}
          onMenuToggle={() => setMobileOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto" id="admin-main" tabIndex={-1}>
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
