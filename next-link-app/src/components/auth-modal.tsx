"use client";

import { useState } from "react";
import { AuthPanel } from "./auth-panel";

export function AuthModal({
  triggerLabel = "Login / Register",
  className,
}: {
  triggerLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`btn ${className ?? ""}`.trim()}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>
      {open && (
        <div
          className="modal-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <button
                className="modal__close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <AuthPanel />
          </div>
        </div>
      )}
    </>
  );
}
