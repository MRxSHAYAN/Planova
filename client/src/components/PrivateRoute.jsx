import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protects user dashboard routes — redirects to /login if not logged in
export function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}

// Protects admin routes — redirects to /admin/login if not admin
export function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;

  return children;
}
