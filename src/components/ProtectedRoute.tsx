import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 * Uses Outlet to render nested routes
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <p className="text-gray-900 dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="fixed top-0 right-0 p-4 z-50">
        <ThemeToggle />
      </header>
      <Outlet />
    </div>
  );
}
