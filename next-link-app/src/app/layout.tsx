import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
const title = `${variant} Link Generator`;

export const metadata: Metadata = {
  title,
  description: "", //"Link generator with history and login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <div style={{ flex: "1 1 auto" }}>{children}</div>
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
              {(() => {
                const year = new Date().getFullYear();
                const label =
                  year > 2025 ? `© 2025-${year} by ` : "© 2025 by ";
                return (
                  <span className="muted" style={{ fontSize: 12 }}>
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
                );
              })()}
              <a
                href="mailto:support@mrjyn.info"
                className="muted"
                style={{ fontSize: 12, textDecoration: "underline" }}
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
