import { createContext } from "react";
import type { User, LoginRequest } from "../types/api.types";

export interface AuthContextType {
  user: User | null | undefined; // undefined = nog niet geladen
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
