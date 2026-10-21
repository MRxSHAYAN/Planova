import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout  from "./components/DashboardLayout";
import Overview         from "./pages/Overview";
import ExploreExpos     from "./pages/ExploreExpos";
import MyApplications   from "./pages/MyApplications";
import MyBooths         from "./pages/MyBooths";
import CompanyProfile   from "./pages/CompanyProfile";
import ProductsServices from "./pages/ProductsServices";
import Notifications    from "./pages/Notifications";
import Settings         from "./pages/Settings";

export default function ExhibitorDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index                  element={<Overview />} />
        <Route path="explore"         element={<ExploreExpos />} />
        <Route path="applications"    element={<MyApplications />} />
        <Route path="booths"          element={<MyBooths />} />
        <Route path="profile"         element={<CompanyProfile />} />
        <Route path="products"        element={<ProductsServices />} />
        <Route path="notifications"   element={<Notifications />} />
        <Route path="settings"        element={<Settings />} />
        <Route path="*" element={<Navigate to="/users/dashboard/exhibitor" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
