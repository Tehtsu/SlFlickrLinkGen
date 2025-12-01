"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
  role: "USER" | "ADMIN";
};

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${user.length > 2 ? "***" : ""}@${domain}`;
}

export function AdminUserRow({
  user,
  selfId,
}: {
  user: UserRow;
  selfId: string;
}) {
  const [status, setStatus] = useState(user.status);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isSelf = selfId === user.id;
  const isProtected = isSelf || user.role === "ADMIN";

  const updateStatus = async (next: "ACTIVE" | "BLOCKED") => {
    if (isProtected) {
      setMessage("Aktion nicht erlaubt");
      return;
    }
    setLoading("status");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus(next);
        setMessage(next === "BLOCKED" ? "Blocked" : "Unblocked");
      } else {
        setMessage(data.error ?? "Failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed");
    }
    setLoading(null);
  };

  const clearHistory = async () => {
    if (isProtected) {
      setMessage("Aktion nicht erlaubt");
      return;
    }
    setLoading("clear");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/clear-history`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(
          `History cleared (links: ${data.deletedLinks ?? 0}, short: ${
            data.deletedShortLinks ?? 0
          })`
        );
      } else {
        setMessage(data.error ?? "Failed to clear history");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to clear history");
    }
    setLoading(null);
  };

  const setPassword = async () => {
    if (isProtected) {
      setMessage("Aktion nicht erlaubt");
      return;
    }
    const pwd = prompt("Neues temporäres Passwort (min. 6 Zeichen)");
    if (!pwd) return;
    if (pwd.length < 6) {
      setMessage("Passwort zu kurz");
      return;
    }
    setLoading("password");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage("Passwort gesetzt. Nutzer informieren.");
      } else {
        setMessage(data.error ?? "Failed to set password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to set password");
    }
    setLoading(null);
  };

  return (
    <div
      className="panel"
      style={{
        padding: 10,
        display: "grid",
        gap: 8,
        border: status === "BLOCKED" ? "1px solid #ef4444" : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>
            {user.name ?? "Kein Name"}
          </div>
          <div className="muted">{maskEmail(user.email)}</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Status: {status} {user.role === "ADMIN" ? "(Admin)" : ""}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {status === "ACTIVE" ? (
            <button
              className="btn"
              onClick={() => updateStatus("BLOCKED")}
              disabled={loading === "status" || isProtected}
            >
              Block
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => updateStatus("ACTIVE")}
              disabled={loading === "status" || isProtected}
            >
              Unblock
            </button>
          )}
          <button
            className="btn"
            onClick={clearHistory}
            disabled={loading === "clear" || isProtected}
          >
            History löschen
          </button>
          <button
            className="btn"
            onClick={setPassword}
            disabled={loading === "password" || isProtected}
          >
            Temp-Passwort
          </button>
        </div>
      </div>
      {message && (
        <div className="muted" style={{ fontSize: 12 }}>
          {message}
        </div>
      )}
    </div>
  );
}
