import { LoginForm } from "../../components/auth/login-form";

export function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
