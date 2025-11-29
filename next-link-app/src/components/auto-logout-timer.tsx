"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

export function AutoLogoutTimer() {
  const { data: session } = useSession();
  const [now, setNow] = useState<Date>(() => new Date());

  // Derive a stable Date for the session expiry (NextAuth gives an ISO string).
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const expiresAt = useMemo(() => {
    if (!session?.expires) return null;
    const d = new Date(session.expires);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [session?.expires]);

  // Keep a 1s heartbeat so the countdown updates while the page is open.
  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) return null;

  const diffMs = expiresAt.getTime() - now.getTime();
  if (diffMs <= 0) {
    return (
      <span className="muted" style={{ fontSize: 12 }}>
        Session expired
      </span>
    );
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Only surface the timer when less than 5 minutes remain.
  if (minutes >= 115) return null;

  return (
    <span className="muted" style={{ fontSize: 12 }}>
      Auto logout in {minutes}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
}
