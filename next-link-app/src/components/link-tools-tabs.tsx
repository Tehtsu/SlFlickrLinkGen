"use client";

import { useState } from "react";
import { LinkGenerator } from "./link-generator";
import { LinkShortener } from "./link-shortener";

export function LinkToolsTabs({ variant }: { variant: string }) {
  const [tab, setTab] = useState<"generator" | "shortener">("generator");

  return (
    <div className="panel" style={{ padding: 12, width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 6,
          borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn"
          style={{
            background:
              tab === "generator"
                ? undefined
                : "linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))",
            color: tab === "generator" ? "#0b1120" : "var(--text)",
            border: tab === "generator" ? "none" : "1px solid var(--border)",
            flex: 1,
            minWidth: 120,
          }}
          onClick={() => setTab("generator")}
        >
          Link generator
        </button>
        <button
          className="btn"
          style={{
            background:
              tab === "shortener"
                ? undefined
                : "linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))",
            color: tab === "shortener" ? "#0b1120" : "var(--text)",
            border: tab === "shortener" ? "none" : "1px solid var(--border)",
            flex: 1,
            minWidth: 120,
          }}
          onClick={() => setTab("shortener")}
        >
          Link shortener
        </button>
      </div>

      {tab === "generator" ? (
        <LinkGenerator variant={variant} />
      ) : (
        <LinkShortener />
      )}
    </div>
  );
}