import Link from "next/link";
import { getServerSession } from "next-auth";
import { AuthModal } from "@/components/auth-modal";
import { LinkShortener } from "@/components/link-shortener";
import { AutoLogoutTimer } from "@/components/auto-logout-timer";
import { authOptions } from "@/lib/auth";

export default async function ShortenerPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="home">
      <header className="home__header">
        <div className="home__headline">
          <p className="badge">Link shortener</p>
          <h1 className="home__title">Shorten any URL</h1>
          <p className="muted home__subtitle">
            Erstelle kurze Slugs, optional mit Login.
          </p>
        </div>
        <div className="home__actions">
          {session?.user ? (
            <>
              <Link href="/history" className="btn">
                History
              </Link>
              <div style={{ display: "grid", gap: 4 }}>
                <div className="badge">
                  Signed in as {session.user.name}
                </div>
                <AutoLogoutTimer />
              </div>
            </>
          ) : (
            <AuthModal
              triggerLabel="Login / Register"
              className="home__auth-trigger"
            />
          )}
        </div>
      </header>

      <div className="home__grid">
        <div className="panel" style={{ padding: 12, width: "100%" }}>
          <p className="badge">Shortener</p>
          <div style={{ marginTop: 10 }}>
            <LinkShortener />
          </div>
        </div>
      </div>
    </main>
  );
}
