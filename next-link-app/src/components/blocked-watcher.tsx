"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export function BlockedWatcher({ status }: { status?: string }) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (status === "BLOCKED" && !triggered) {
      setTriggered(true);
      void signOut({ callbackUrl: "/?blocked=1" });
    }
  }, [status, triggered]);

  return null;
}
