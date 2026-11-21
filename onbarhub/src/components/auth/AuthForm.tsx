"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "check-email" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) {
      setStatus("error");
      setMessage("Sign-in is not available right now.");
      return;
    }
    setStatus("working");
    setMessage("");
    try {
      if (mode === "signup") {
        const emailRedirectTo =
          typeof window !== "undefined" ? `${window.location.origin}/account` : undefined;
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        });
        if (error) throw error;
        // If email confirmation is on, there is no active session yet.
        if (!data.session) {
          setStatus("check-email");
          return;
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      // onAuthStateChange in the provider will flip the view to the dashboard.
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "check-email") {
    return (
      <div className="rounded-xl border border-line bg-wash p-6 max-w-md">
        <h2 className="font-bold text-lg">Confirm your email</h2>
        <p className="text-muted mt-2 text-sm">
          We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and sign in.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold text-brand underline">
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMode("signup")}
          className={`rounded-md px-4 py-2 text-sm font-semibold border ${
            mode === "signup" ? "border-brand bg-wash text-brand" : "border-line text-muted"
          }`}
        >
          Create account
        </button>
        <button
          onClick={() => setMode("signin")}
          className={`rounded-md px-4 py-2 text-sm font-semibold border ${
            mode === "signin" ? "border-brand bg-wash text-brand" : "border-line text-muted"
          }`}
        >
          Sign in
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-line px-3 py-2.5 text-base"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-line px-3 py-2.5 text-base"
            placeholder="At least 6 characters"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </label>
        <button
          type="submit"
          disabled={status === "working"}
          className="rounded-md bg-brand text-white font-semibold px-5 py-2.5 disabled:opacity-60"
        >
          {status === "working" ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
        </button>
        {status === "error" && <p className="text-sm text-red-700">{message}</p>}
      </form>
    </div>
  );
}
