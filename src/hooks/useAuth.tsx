import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useBackend, BackendError } from "../hooks/useBackend";
import type {
  User,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
} from "../types/api.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backend = useBackend();

  /**
   * Check if there's an active session on mount
   */
  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await backend.get<{ user: User }>("/user/profile");
      setUser(response.user);
    } catch {
      // Session doesn't exist or expired - not an error
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /**
   * Login user with email and password
   */
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await backend.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      setUser(response.user);
    } catch (err) {
      const errorMessage =
        err instanceof BackendError ? err.message : "Failed to login";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await backend.post<LogoutResponse>("/auth/logout");
      setUser(null);
    } catch (err) {
      const errorMessage =
        err instanceof BackendError ? err.message : "Failed to logout";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    checkSession,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication state and methods
 * Must be used within AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
