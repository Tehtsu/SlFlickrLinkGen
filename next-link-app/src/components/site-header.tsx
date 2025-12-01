"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {
  title: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName?: string;
  userRole?: string;
};

export function SiteHeader({
  title,
  isAuthenticated,
  isAdmin,
  userName,
  userRole,
}: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Generator", show: true },
    { href: "/shortener", label: "Shortener", show: true },
    { href: "/history", label: "History", show: isAuthenticated },
    { href: "/profile", label: "Profile", show: isAuthenticated },
    { href: "/admin", label: "Admin", show: isAdmin },
  ].filter((item) => item.show);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header
      style={{
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          className="btn"
          style={{
            textDecoration: "none",
            padding: "8px 12px",
          }}
        >
          {title}
        </Link>
        <nav
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="badge nav-link"
              style={
                isActive(item.href)
                  ? {
                      background:
                        "linear-gradient(120deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))",
                      color: "#0b1120",
                    }
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {isAuthenticated && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ display: "grid", gap: 2, textAlign: "right" }}>
            <span className="badge">
              Signed in as {userName ?? "User"}
            </span>
            {isAdmin && userRole && (
              <span className="muted" style={{ fontSize: 12 }}>
                Role: {userRole}
              </span>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
            aria-label="Sign out"
            style={{
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.06)",
              color: "var(--text)",
              borderRadius: 999,
              padding: "8px 10px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.06)";
            }}
          >
            {/* simple power icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v10" />
              <path d="M7.5 4.5a8 8 0 1 0 9 0" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
