"use client";

import Link from "next/link";

export function MustChangePasswordNotice({
  required,
}: {
  required?: boolean;
}) {
  if (!required) return null;
  return (
    <div
      style={{
        margin: "0 20px 12px",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(251, 191, 36, 0.6)",
        background: "rgba(251, 191, 36, 0.08)",
        color: "#fef08a",
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span>
        Dein Passwort wurde vom Admin gesetzt. Bitte ändere es jetzt.
      </span>
      <Link href="/profile" className="btn" style={{ padding: "6px 10px" }}>
        Passwort ändern
      </Link>
    </div>
  );
}
