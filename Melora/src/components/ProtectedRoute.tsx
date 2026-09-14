import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}