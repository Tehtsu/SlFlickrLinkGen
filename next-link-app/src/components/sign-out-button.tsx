"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="btn"
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
    >
      Sign out
    </button>
  );
}
