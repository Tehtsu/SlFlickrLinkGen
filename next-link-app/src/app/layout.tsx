import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getGlobalStats } from "@/lib/stats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { BlockedWatcher } from "@/components/blocked-watcher";
import { BlockedNotice } from "@/components/blocked-notice";
import { MustChangePasswordNotice } from "@/components/must-change-password-notice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const variant =
  process.env.APP_VARIANT?.toLowerCase() === "secondlife"
    ? "SecondLife"
    : "Flickr";
const title = `Link Generator and Link Shortener`;

export const metadata: Metadata = {
  title,
  description: "", //"Link generator with history and login",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalStats = await getGlobalStats();
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mustChangePassword = (session?.user as any)
    ?.mustChangePassword;

  const year = new Date().getFullYear();
  const label =
    year > 2025 ? `(c) 2025-${year} by ` : "(c) 2025 by ";

  return (
    <html
      lang="de"
      data-variant={variant.toLowerCase()}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
        suppressHydrationWarning
      >
        <Providers>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SiteHeader
              title={title}
              isAuthenticated={Boolean(session?.user?.id)}
              isAdmin={isAdmin}
              userName={session?.user?.name ?? undefined}
              userRole={
                isAdmin && session?.user?.role
                  ? session.user.role.toLowerCase()
                  : undefined
              }
            />
            <MustChangePasswordNotice
              required={Boolean(mustChangePassword)}
            />
            <BlockedNotice />
            <BlockedWatcher
              status={session?.user?.status}
            />
            <div style={{ flex: "1 1 auto" }}>
              {children}
            </div>
            <footer
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--border)",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="muted"
                style={{ fontSize: 12 }}
              >
                {label}
                <a
                  href="https://tmlr.eu"
                  target="_blank"
                  rel="noreferrer"
                  className="muted"
                  style={{ textDecoration: "underline" }}
                >
                  TMLR
                </a>
              </span>
              <span
                className="muted"
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  flex: "1 1 auto",
                }}
              >
                Total links: {globalStats.totalLinks} |
                Short links: {globalStats.totalShortLinks}
              </span>
              <a
                href="mailto:support@mrjyn.info"
                className="muted"
                style={{
                  fontSize: 12,
                  textDecoration: "underline",
                }}
              >
                support@mrjyn.info
              </a>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
