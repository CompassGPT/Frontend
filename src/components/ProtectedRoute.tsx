import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

/**
 * Component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 * Uses Outlet to render nested routes
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
