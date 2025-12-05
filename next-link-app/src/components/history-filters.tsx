"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type LinkType = "flickr" | "secondlife" | "short" | "all";

export function HistoryFilters({
  initialType,
  initialFrom,
  initialTo,
  initialPageSize = 10,
}: {
  initialType: LinkType;
  initialFrom?: string;
  initialTo?: string;
  initialPageSize?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<LinkType>(initialType);
  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [isPending, startTransition] = useTransition();

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    if (from) params.set("from", from);
    else params.delete("from");
    if (to) params.set("to", to);
    else params.delete("to");
    if (pageSize) params.set("pageSize", String(pageSize));
    params.set("page", "1");

    startTransition(() => {
      router.push(`/history?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setType("all");
    setFrom("");
    setTo("");
    setPageSize(initialPageSize);
    startTransition(() => {
      router.push("/history");
    });
  };

  return (
    <div className="panel" style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          Filter
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          <label style={{ display: "grid", gap: 4 }}>
            <span className="muted">Type</span>
            <select className="input" value={type} onChange={(e) => setType(e.target.value as LinkType)}>
              <option value="all">All</option>
              <option value="flickr">Flickr</option>
              <option value="secondlife">SecondLife</option>
              <option value="short">Short links</option>
            </select>
          </label>
          <label style={{ display: "grid", gap: 4 }}>
            <span className="muted">From</span>
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 4 }}>
            <span className="muted">To</span>
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 4 }}>
            <span className="muted">Per page</span>
            <select
              className="input"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[1, 3, 5, 10, 25].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="filters-actions">
        <button className="btn" onClick={applyFilters} disabled={isPending}>
          {isPending ? "Loading..." : "Apply filters"}
        </button>
        <button
          className="btn"
          style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
          onClick={resetFilters}
          disabled={isPending}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
