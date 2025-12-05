"use client";

import { useState } from "react";
import { AuthPanel } from "./auth-panel";
import { SignOutButton } from "./sign-out-button";

export function MobileAuthMenu({
  isAuthenticated,
  email,
}: {
  isAuthenticated: boolean;
  email?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-auth">
      <button
        className="btn mobile-auth__toggle"
        onClick={() => setOpen((value) => !value)}
      >
        {isAuthenticated ? "Account" : "Login / Register"}
      </button>

      {open && (
        <div className="mobile-auth__content">
          {isAuthenticated ? (
            <div className="panel info-panel">
              <p className="badge">Signed in</p>
              <p style={{ marginTop: 10, fontWeight: 600 }}>
                Signed in as {email ?? "user"}.
              </p>
              <p className="muted" style={{ marginTop: 6 }}>
                Your links are saved to history.
              </p>
              {/* <div style={{ marginTop: 10 }}>
                <SignOutButton />
              </div> */}
            </div>
          ) : (
            <AuthPanel />
          )}
        </div>
      )}
    </div>
  );
}
