import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "./AppLayout";

/**
 * Component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 * Uses Outlet to render nested routes
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white via-slate-50 to-sky-50">
        <div className="text-center px-6 py-8 rounded-lg shadow-lg bg-white/70 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-sky-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">CompassGPT</h1>
          <p className="mt-2 text-sm text-slate-600">
            Loading your personalized experience…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ message: "Please log in to continue" }}
      />
    );
  }

  return <AppLayout />;
}
