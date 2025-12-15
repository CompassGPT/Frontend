/**
 * Get the backend API base URL from environment variables
 */
export const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
};

/**
 * Create the full API endpoint URL
 */
export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
