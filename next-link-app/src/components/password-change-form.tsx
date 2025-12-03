"use client";

import { useState, useTransition } from "react";

export function PasswordChangeForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(
          data?.error ?? "Could not change password"
        );
        return;
      }
      setMessage("Password changed. Please sign in again.");
      setOldPassword("");
      setNewPassword("");
      // sessions will be invalidated server-side; client will refetch
      window.location.href = "/?passwordChanged=1";
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="panel" style={{ padding: 12 }}>
      <p className="badge">Change password</p>
      <div
        style={{ display: "grid", gap: 10, marginTop: 10 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted">Current password</span>
          <input
            className="input"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Old password"
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted">New password</span>
          <input
            className="input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="At least 6 characters"
          />
        </label>
        <button
          className="btn"
          onClick={submit}
          disabled={isPending}
        >
          {isPending ? "Save..." : "Save password"}
        </button>
        {message && (
          <p className="muted" style={{ fontSize: 12 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
