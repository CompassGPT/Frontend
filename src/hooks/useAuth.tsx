import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useBackend, BackendError } from "../hooks/useBackend";
import type { User, LoginRequest, LoginResponse, LogoutResponse } from "../types/api.types";

interface AuthContextType {
	user: User | null | undefined; // undefined = nog niet geladen
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => Promise<void>;
	checkSession: () => Promise<void>;
	error: string | null;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true); // start als loading
	const [error, setError] = useState<string | null>(null);
	const backend = useBackend();

	// Check if there's an active session on mount
	const checkSession = useCallback(async () => {
		try {
			const response = await backend.get<{ user: User }>("/api/user/profile");
			setUser(response.user);
		} catch {
			setUser(null); // geen user gevonden
		} finally {
			setIsLoading(false); // loading klaar
		}
	}, [backend]);

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

	// Login
	const login = async (credentials: LoginRequest) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await backend.post<LoginResponse>("/api/auth/login", credentials);
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
			await backend.post<LogoutResponse>("/api/auth/logout");
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
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Hook to use the Auth context
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};
