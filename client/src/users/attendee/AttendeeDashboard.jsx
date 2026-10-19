import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Overview        from "./pages/Overview";
import ExploreEvents   from "./pages/ExploreEvents";
import MyEvents        from "./pages/MyEvents";
import MySchedule      from "./pages/MySchedule";
import ExhibitorsPage  from "./pages/Exhibitors";
import SavedItems      from "./pages/SavedItems";
import Notifications   from "./pages/Notifications";
import MyProfile       from "./pages/MyProfile";

export default function AttendeeDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index             element={<Overview />} />
        <Route path="explore"     element={<ExploreEvents />} />
        <Route path="my-events"   element={<MyEvents />} />
        <Route path="schedule"    element={<MySchedule />} />
        <Route path="exhibitors"  element={<ExhibitorsPage />} />
        <Route path="saved"       element={<SavedItems />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile"     element={<MyProfile />} />
        <Route path="*" element={<Navigate to="/users/dashboard/attendee" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
