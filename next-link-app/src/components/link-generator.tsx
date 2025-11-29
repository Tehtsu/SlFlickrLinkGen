"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";

type LinkType = "flickr" | "secondlife";

export function LinkGenerator({
  variant,
}: {
  variant: string;
}) {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LinkType>(
    variant === "secondlife" ? "secondlife" : "flickr"
  );
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState<string | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setMessage(null);
    if (!url.trim()) {
      setMessage("Please enter a valid URL.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          title: title.trim(),
          type,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setMessage(data?.error ?? "Error while saving");
        return;
      }

      const data = await res.json();
      setOutput(data.html);
      setMessage(
        data.saved
          ? "Link saved and generated."
          : "Link generated (not saved)."
      );
    });
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setMessage("Code has been copied!");
  };

  return (
    <div className="panel generator-panel">
      <div className="generator-heading">
        <div>
          <p className="badge">Generator - {variant}</p>
          <h1 className="generator-title">Create links</h1>
          <p className="muted" style={{ marginTop: 4 }}>
            Generate Flickr links as &lt;a&gt; or SecondLife
            links in [url title] format.
          </p>
        </div>
        {/* <Link
          href="/history"
          className="btn text-center"
          style={{ textDecoration: "none" }}
        >
          View history
        </Link> */}
      </div>

      <div className="generator-form">
        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted">URL</span>
          <input
            className="input"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted">Title (optional)</span>
          <input
            className="input"
            placeholder="Title or text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted">Type</span>
          <select
            className="input"
            value={type}
            onChange={(e) =>
              setType(e.target.value as LinkType)
            }
          >
            <option value="flickr">
              Flickr (&lt;a&gt;-Tag)
            </option>
            <option value="secondlife">
              SecondLife ([url title])
            </option>
          </select>
        </label>

        <button
          className="btn"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : isAuthenticated
            ? "Save and generate link"
            : "Generate link"}
        </button>
      </div>

      {message && (
        <p className="muted" style={{ marginTop: 12 }}>
          {message}
        </p>
      )}

      {output && (
        <div style={{ marginTop: 20 }}>
          <div
            className="badge"
            style={{ marginBottom: 8 }}
          >
            Result
          </div>
          <div
            className="panel"
            style={{
              padding: 12,
              borderStyle: "dashed",
              wordBreak: "break-word",
            }}
          >
            <code style={{ color: "#c4d4ff" }}>
              {output}
            </code>
          </div>
          <div className="generator-footer">
            <button className="btn" onClick={handleCopy}>
              Copy
            </button>
            {/* <Link
              href="/history"
              className="btn"
              style={{ textDecoration: "none" }}
            >
              View history
            </Link>
            {saved === false && (
              <span className="muted">
                Sign in to store the link in your history.
              </span>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
