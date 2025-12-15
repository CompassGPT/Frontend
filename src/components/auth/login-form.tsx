"use client";

import { useState } from "react";
import { redirect } from "react-router";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogin(evt: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      setErrorMessage("Please enter your credentials.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (result.ok) {
        setSuccessMessage("Login successful!");
        setErrorMessage("");
        setIsLoading(false);
        redirect("/");
      } else {
        const errorData = await result.json();
        setErrorMessage(errorData.message || "Login failed.");
        setSuccessMessage("");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("An error occurred during login.");
      setSuccessMessage("");
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      {errorMessage && (
        <div className="text-red-600 text-sm">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-600 text-sm">{successMessage}</div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button
        disabled={isLoading}
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
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
