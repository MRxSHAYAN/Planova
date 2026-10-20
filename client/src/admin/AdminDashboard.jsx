import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout     from "./layouts/AdminLayout";
import Overview        from "./pages/Overview";
import ExpoManagement  from "./pages/ExpoManagement";
import Applications    from "./pages/Applications";
import Booths          from "./pages/Booths";
import Attendees       from "./pages/Attendees";
import Schedule        from "./pages/Schedule";
import Users           from "./pages/Users";
import Reports         from "./pages/Reports";
import Notifications   from "./pages/Notifications";
import Settings        from "./pages/Settings";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index                   element={<Overview />} />
        <Route path="expos"            element={<ExpoManagement />} />
        <Route path="applications"     element={<Applications />} />
        <Route path="booths"           element={<Booths />} />
        <Route path="attendees"        element={<Attendees />} />
        <Route path="schedule"         element={<Schedule />} />
        <Route path="users"            element={<Users />} />
        <Route path="reports"          element={<Reports />} />
        <Route path="notifications"    element={<Notifications />} />
        <Route path="settings"         element={<Settings />} />
        <Route path="*"                element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
