"use client";

import { useState, useTransition } from "react";
import { CopyButton } from "./copy-button";

export function LinkShortener() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setMessage(null);
    setResult(null);
    if (!url.trim()) {
      setMessage("Please enter a URL.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), slug: slug.trim() || undefined }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "Could not shorten link.");
        return;
      }
      setResult(data.shortUrl);
      setMessage("Short link created.");
    });
  };

  return (
    <div className="panel" style={{ padding: 16, display: "grid", gap: 10 }}>
      <p className="badge">Link Shortener</p>
      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted">Target URL</span>
          <input
            className="input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
            type="url"
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted">Custom slug (optional)</span>
          <input
            className="input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-link"
          />
        </label>
        <button className="btn" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : "Shorten link"}
        </button>
      </div>
      {message && <p className="muted">{message}</p>}
      {result && (
        <div style={{ display: "grid", gap: 6 }}>
          <span className="muted">Short URL</span>
          <div className="panel" style={{ padding: 10, borderStyle: "dashed", wordBreak: "break-word" }}>
            <code style={{ color: "#c4d4ff" }}>{result}</code>
          </div>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}