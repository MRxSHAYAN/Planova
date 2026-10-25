import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  // Also check localStorage directly so navigation after login
  // doesn't bounce before React state has re-rendered
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("planova_user")); } catch { return null; }
  })();

  const activeUser = user || stored;

  if (!activeUser) return <Navigate to="/login" replace />;
  if (role && activeUser.role !== role) return <Navigate to="/login" replace />;

  return children;
}

export function AdminRoute({ children }) {
  const { user } = useAuth();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("planova_user")); } catch { return null; }
  })();

  const activeUser = user || stored;

  if (!activeUser || activeUser.role !== "admin") return <Navigate to="/admin/login" replace />;

  return children;
}
