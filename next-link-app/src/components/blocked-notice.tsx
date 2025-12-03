"use client";

import { useEffect, useState } from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";

export function BlockedNotice() {
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const blocked = searchParams?.get("blocked");
    if (blocked === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      // Drop the query param to avoid showing again on navigation.
      const url = new URL(window.location.href);
      url.searchParams.delete("blocked");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div
      style={{
        margin: "0 20px 12px",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(248, 113, 113, 0.4)",
        background: "rgba(248, 113, 113, 0.08)",
        color: "#fecaca",
      }}
    >
      Your account has been blocked. You have been logged
      out..
    </div>
  );
}
