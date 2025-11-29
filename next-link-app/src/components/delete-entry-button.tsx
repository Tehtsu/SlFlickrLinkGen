"use client";

import { useTransition } from "react";

export function DeleteEntryButton({ id, kind }: { id: string; kind: "link" | "short" }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await fetch("/api/history/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, kind }),
      });
      window.location.reload();
    });
  };

  return (
    <button
      className="btn"
      style={{ background: "transparent", color: "#fca5a5", border: "1px solid #fca5a5" }}
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}