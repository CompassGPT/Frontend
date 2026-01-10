/**
 * Get the backend API base URL from environment variables
 */
export const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
};

/**
 * Create the full API endpoint URL
 *
 * The backend uses NestJS with a global "/api" prefix set via app.setGlobalPrefix('api').
 * This function constructs the full URL by appending the "/api" prefix to the base URL.
 *
 * @param endpoint - The API endpoint path (must start with "/" and NOT include "/api")
 *                   Examples: "/modules", "/user/profile", "/auth/login"
 * @returns The full API URL (e.g., "http://localhost:4000/api/modules")
 *
 * @example
 * createApiUrl("/modules") -> "http://localhost:4000/api/modules"
 * createApiUrl("user/profile") -> "http://localhost:4000/api/user/profile"
 */
export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}/api${cleanEndpoint}`;
};
