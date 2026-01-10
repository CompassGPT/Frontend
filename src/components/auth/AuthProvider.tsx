import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useBackend, BackendError } from "../../hooks/useBackend";
import { AuthContext } from "../../context/AuthContext";
import type {
  User,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
} from "../../types/api.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backend = useBackend();

  // Single checkSession function for both initial load and manual calls
  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await backend.get<{ user: User }>("/user/profile");
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // NOTE: backend is excluded because useBackend returns a stable memoized object
  }, []);

  // Check if there's an active session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Login
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await backend.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      setUser(response.user);
    } catch (err) {
      setError(err instanceof BackendError ? err.message : "Failed to login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await backend.post<LogoutResponse>("/auth/logout");
      setUser(null);
    } catch (err) {
      setError(err instanceof BackendError ? err.message : "Failed to logout");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkSession,
        error,
        clearError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
