import { LoginForm } from "../../components/auth/login-form";
import { ThemeToggle } from "../../components/ThemeToggle";

export function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
