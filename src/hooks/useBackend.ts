import { createApiUrl } from "../lib/api";
import type { ApiError } from "../types/api.types";

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Custom hook for making API requests to the backend
 * Handles authentication, error handling, and JSON serialization
 */
export const useBackend = () => {
  /**
   * Make an API request with automatic JSON handling and credentials
   */
  const request = async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const url = createApiUrl(endpoint);
    const { body, headers = {}, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        "X-API-Version": "1",
        ...headers,
      },
      credentials: "include", // Important: Include cookies for session management
    };

    // Serialize body to JSON if present
    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            statusCode: response.status,
            message: response.statusText || "An error occurred",
          };
        }
        throw new BackendError(
          errorData.message || "Request failed",
          errorData.statusCode,
          errorData
        );
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof BackendError) {
        throw error;
      }
      throw new BackendError(
        error instanceof Error ? error.message : "Network error",
        0
      );
    }
  };

  /**
   * Make a GET request
   */
  const get = <T = unknown>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T> => {
    return request<T>(endpoint, { ...options, method: "GET" });
  };

  /**
   * Make a POST request
   */
  const post = <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> => {
    return request<T>(endpoint, { ...options, method: "POST", body });
  };

  /**
   * Make a PUT request
   */
  const put = <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> => {
    return request<T>(endpoint, { ...options, method: "PUT", body });
  };

  /**
   * Make a PATCH request
   */
  const patch = <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> => {
    return request<T>(endpoint, { ...options, method: "PATCH", body });
  };

  /**
   * Make a DELETE request
   */
  const del = <T>(endpoint: string, options?: FetchOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: "DELETE" });
  };

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};

/**
 * Custom error class for backend API errors
 */
export class BackendError extends Error {
  public readonly statusCode: number;
  public readonly data?: ApiError;

  constructor(message: string, statusCode: number, data?: ApiError) {
    super(message);
    this.name = "BackendError";
    this.statusCode = statusCode;
    this.data = data;
  }

  /**
   * Check if the error is an authentication error
   */
  isAuthError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if the error is a validation error
   */
  isValidationError(): boolean {
    return this.statusCode === 400;
  }

  /**
   * Check if the error is a not found error
   */
  isNotFoundError(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if the error is a server error
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}
