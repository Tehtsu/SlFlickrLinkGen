"use client";

import { useState, useTransition } from "react";

export function DataManagement() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClearHistory = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/history/clear", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "Could not clear history.");
        return;
      }
      setMessage("History cleared.");
      setConfirmOpen(false);
      window.location.reload();
    });
  };

  const handleDeleteAccount = () => {
    if (!confirm("Delete account and all data? This cannot be undone.")) return;
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "Could not delete account.");
        return;
      }
      setMessage("Account deleted. Signing out...");
      window.location.href = "/";
    });
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => setConfirmOpen(true)} disabled={isPending}>
          Clear history
        </button>
        <button
          className="btn"
          style={{ background: "transparent", color: "#fca5a5", border: "1px solid #fca5a5" }}
          onClick={handleDeleteAccount}
          disabled={isPending}
        >
          Delete account
        </button>
      </div>
      {message && <p className="muted">{message}</p>}

      {confirmOpen && (
        <div className="modal-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <p className="badge">Confirm</p>
              <button
                className="modal__close"
                onClick={() => setConfirmOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <p style={{ fontWeight: 600 }}>Delete all history entries?</p>
              <p className="muted">This will remove all links and short links.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn" onClick={handleClearHistory} disabled={isPending}>
                  {isPending ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  className="btn"
                  style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}