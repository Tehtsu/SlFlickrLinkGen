"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

type Mode = "login" | "signup" | "reset";

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState("");
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

  const handleForgot = () => {
    setMessage(null);
    if (!email.trim()) {
      setMessage("Please enter an email.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "Could not trigger password reset.");
        return;
      }
      setMessage(
        "If the email exists, a reset link was sent."
      );
    });
  };

  const handleReset = () => {
    setMessage(null);
    if (!resetToken.trim() || !resetPassword.trim()) {
      setMessage("Token and new password are required.");
      return;
    }
    if (resetPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken.trim(),
          password: resetPassword,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "Password could not be updated.");
        return;
      }
      setMessage("Password updated. You can sign in now.");
      setMode("login");
      setPassword("");
      setResetPassword("");
      setResetToken("");
    });
  };

  return (
    <div
      className="panel"
      style={{
        padding: 24,
        maxWidth: 520,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <p className="badge" style={{ marginBottom: 10 }}>
        {mode === "reset" ? "Forgot password" : "Login / Register"}
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
        {mode === "reset" ? "Reset password" : "Welcome"}
      </h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        {mode === "reset"
          ? "Request a reset token and set a new password."
          : "Sign in or create an account to store your link history."}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
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
          Register
        </button>
        <button
          className="btn"
          style={{ background: mode === "reset" ? undefined : "transparent", color: mode === "reset" ? "#0b1120" : "var(--text)", border: mode === "reset" ? "none" : "1px solid var(--border)" }}
          onClick={() => setMode("reset")}
        >
          Forgot password
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

      {mode !== "reset" && (
        <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          <span className="muted">Password</span>
          <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="******" />
        </label>
      )}

      {mode === "reset" ? (
        <>
          <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            <button className="btn" onClick={handleForgot} disabled={isPending}>
              {isPending ? "Sending reset..." : "Request reset"}
            </button>
            <p className="muted" style={{ fontSize: 12 }}>
              For security we return a generic message. Please paste the token from your email.
            </p>
          </div>
          <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            <span className="muted">Reset token</span>
            <input
              className="input"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Token from the email"
            />
          </label>
          <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
            <span className="muted">New password</span>
            <input
              className="input"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              type="password"
              placeholder="New password"
            />
          </label>
          <button className="btn" onClick={handleReset} disabled={isPending}>
            {isPending ? "Saving..." : "Save password"}
          </button>
        </>
      ) : (
        <button className="btn" onClick={mode === "login" ? handleSignIn : handleSignUp} disabled={isPending}>
          {isPending ? "Submitting..." : mode === "login" ? "Sign in" : "Sign up"}
        </button>
      )}

      {message && (
        <p className="muted" style={{ marginTop: 12 }}>
          {message}
        </p>
      )}
    </div>
  );
}
