"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { BackendError } from "../../hooks/useBackend";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogin(evt: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    clearError();
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setErrorMessage("Please enter your credentials.");
      setIsLoading(false);
      return;
    }

    try {
      await login({ email, password });
      setSuccessMessage("Login successful!");
      setErrorMessage("");

      // Redirect to home page after successful login
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      if (err instanceof BackendError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An error occurred during login.");
      }
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      {errorMessage && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="text-green-600 dark:text-green-400 text-sm">
          {successMessage}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          required
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>
      <button
        disabled={isLoading}
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {isLoading ? (
          <>
            <span className="loader"></span>
            <span className="ml-2">Logging in...</span>
          </>
        ) : (
          <span>Login</span>
        )}
      </button>
    </form>
  );
}
