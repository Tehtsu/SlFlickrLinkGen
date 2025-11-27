"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });
      if (res?.error) {
        setMessage(res.error);
        return;
      }
      setMessage("Signed in. Reloading...");
      window.location.reload();
    });
  };

  const handleSignUp = () => {
    setMessage(null);
    if (!email.trim() || !password.trim()) {
      setMessage("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "Sign up failed");
        return;
      }
      setMessage("Signed up. Logging you in...");
      await signIn("credentials", { email, password, redirect: false });
      window.location.reload();
    });
  };

  return (
    <div className="panel" style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <p className="badge" style={{ marginBottom: 10 }}>
        Login / Signup
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Welcome</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        Sign in or create an account to store your link history.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          className="btn"
          style={{ background: mode === "login" ? undefined : "transparent", color: mode === "login" ? "#0b1120" : "var(--text)", border: mode === "login" ? "none" : "1px solid var(--border)" }}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className="btn"
          style={{ background: mode === "signup" ? undefined : "transparent", color: mode === "signup" ? "#0b1120" : "var(--text)", border: mode === "signup" ? "none" : "1px solid var(--border)" }}
          onClick={() => setMode("signup")}
        >
          Registrieren
        </button>
      </div>

      {mode === "signup" && (
        <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
          <span className="muted">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display Name" />
        </label>
      )}

      <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        <span className="muted">Email</span>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
      </label>

      <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
        <span className="muted">Password</span>
        <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••" />
      </label>

      <button className="btn" onClick={mode === "login" ? handleSignIn : handleSignUp} disabled={isPending}>
        {isPending ? "Submitting..." : mode === "login" ? "Sign in" : "Sign up"}
      </button>

      {message && (
        <p className="muted" style={{ marginTop: 12 }}>
          {message}
        </p>
      )}
    </div>
  );
}
