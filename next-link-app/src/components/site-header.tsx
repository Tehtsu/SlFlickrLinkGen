"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const [showSeasonal] = useState(() => {
    const now = new Date();
    const month = now.getMonth(); // 0 Jan
    const day = now.getDate();
    // Show from 1 Dec through 5 Jan (aligned with snow season)
    const inDecember = month === 11 && day >= 15;
    const inJanuary = month === 0 && day <= 5;
    return inDecember || inJanuary;
  });

  const navItems = [
    { href: "/", label: "Generator", show: true },
    { href: "/shortener", label: "Shortener", show: true },
    {
      href: "/history",
      label: "History",
      show: isAuthenticated,
    },
    {
      href: "/profile",
      label: "Profile",
      show: isAuthenticated,
    },
    { href: "/admin", label: "Admin", show: isAdmin },
  ].filter((item) => item.show);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

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
        justifyContent: "center",
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

      <button
        className="nav-toggle"
        aria-expanded={mobileNavOpen}
        aria-label="Navigation umschalten"
        onClick={() => setMobileNavOpen((prev) => !prev)}
        type="button"
      >
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
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {showSeasonal && (
        <div
          style={{
            minWidth: 260,
            maxWidth: 480,
            flex: "0 1 auto",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            padding: "4px 0",
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              display: "inline-block",
              animation: "marquee 12s linear infinite",
              color: "rgba(255,255,255,0.9)",
              fontSize: 14,
            }}
          >
            Merry Christmas & Happy New Year | Merry
            Christmas & Happy New Year | Merry Christmas &
            Happy New Year
          </div>
          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      )}

      <nav
        className={`site-nav ${
          mobileNavOpen ? "site-nav--open" : ""
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="badge nav-link"
            onClick={() => setMobileNavOpen(false)}
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

      {isAuthenticated && (
        <div
          className={`site-user ${
            mobileNavOpen ? "site-nav--open" : ""
          }`}
        >
          <div className="site-user__meta">
            <span className="badge">
              Signed in as {userName ?? "User"}
            </span>
            {isAdmin && userRole && (
              <span
                className="muted"
                style={{ fontSize: 12 }}
              >
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
              transition:
                "background 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "rgba(255,255,255,0.06)";
            }}
          >
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
