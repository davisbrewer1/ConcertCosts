"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setMessage(
        "Account created! Check your email to confirm, or try logging in if confirmation is turned off.",
      );
      setMode("login");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card w-full max-w-md bg-base-100/95 shadow-2xl border border-base-content/10 backdrop-blur">
      <div className="card-body gap-5">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm opacity-70">
            {mode === "signup"
              ? "Start tracking concerts, costs, and fun in one place."
              : "Log in to see your concerts and dashboard."}
          </p>
        </div>

        <div className="join w-full">
          <button
            type="button"
            className={`btn join-item flex-1 ${mode === "signup" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setMode("signup");
              setError(null);
              setMessage(null);
            }}
          >
            Sign up
          </button>
          <button
            type="button"
            className={`btn join-item flex-1 ${mode === "login" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setMode("login");
              setError(null);
              setMessage(null);
            }}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
            <label htmlFor="email" className="text-sm font-medium text-right">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>

          <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
            <label htmlFor="password" className="text-sm font-medium text-right">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <div role="alert" className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div role="alert" className="alert alert-success text-sm">
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
