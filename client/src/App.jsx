import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ScrollToTop         from "./ScrollToTop";
import Splash              from "./web/Splash";
import Home                from "./web/pages/Home";
import ExploreExpos        from "./web/pages/ExploreExpos";
import Exhibitors          from "./web/pages/Exhibitors";
import Schedule            from "./web/pages/Schedule";
import About               from "./web/pages/About";
import Contact             from "./web/pages/Contact";
import Support             from "./web/pages/Support";
import Privacy             from "./web/pages/Privacy";
import Login               from "./web/pages/auth/Login";
import Register            from "./web/pages/auth/Register";
import AttendeeDashboard   from "./users/attendee/AttendeeDashboard";
import ExhibitorDashboard  from "./users/exhibitor/ExhibitorDashboard";
import AdminLogin          from "./admin/pages/AdminLogin";
import AdminDashboard      from "./admin/AdminDashboard";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-5 text-center">
      <div className="text-[#6B9FFF] font-black text-[5rem] leading-none mb-4">404</div>
      <h1 className="text-white font-black text-[1.5rem] mb-2">Page not found</h1>
      <p className="text-white/40 text-[14px] mb-8">This page doesn't exist or was moved.</p>
      <Link to="/"
        className="px-6 py-3 rounded-lg bg-[#6B9FFF] text-[#0A1628] font-bold text-[13px] hover:bg-[#4A82F5] hover:text-white transition-colors">
        Back to home
      </Link>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
      <ScrollToTop />

      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/explore-expos" element={<ExploreExpos />} />
        <Route path="/exhibitors"    element={<Exhibitors />} />
        <Route path="/schedule"      element={<Schedule />} />
        <Route path="/about"         element={<About />} />
        <Route path="/contact"       element={<Contact />} />
        <Route path="/support"       element={<Support />} />
        <Route path="/privacy"       element={<Privacy />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/users/dashboard/attendee/*"  element={<AttendeeDashboard />} />
        <Route path="/users/dashboard/exhibitor/*" element={<ExhibitorDashboard />} />
        <Route path="/admin/login"   element={<AdminLogin />} />
        <Route path="/admin/*"       element={<AdminDashboard />} />
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </>
  );
}
