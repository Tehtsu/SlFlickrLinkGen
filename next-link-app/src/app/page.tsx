import Link from "next/link";
import { getServerSession } from "next-auth";
import { AuthModal } from "@/components/auth-modal";
import { AutoLogoutTimer } from "@/components/auto-logout-timer";
import { authOptions } from "@/lib/auth";
import { LinkGenerator } from "@/components/link-generator";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const variant =
    process.env.APP_VARIANT?.toLowerCase() === "secondlife"
      ? "SecondLife"
      : "FlickR and SecondLife Link";

  return (
    <main className="home">
      <header className="home__header">
        <div className="home__headline">
          <p className="badge">{variant} Generator</p>
          <h1 className="home__title">
            Link builder with history
          </h1>
          <p className="muted home__subtitle">
            Create Flickr or SecondLife links without login.
            Saving to history is available after login.
          </p>
        </div>
        <div className="home__actions">
          {session?.user ? (
            <>
              <AutoLogoutTimer />
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
        <div
          id="generator"
          className="panel"
          style={{ padding: 12, width: "100%" }}
        >
          <p className="badge">Link generator</p>
          <div style={{ marginTop: 10 }}>
            <LinkGenerator variant={variant} />
          </div>
        </div>
        <div className="panel info-panel desktop-auth">
          {session?.user ? (
            <>
              <p className="badge">Signed in</p>
              <p style={{ marginTop: 10, fontWeight: 600 }}>
                Du bist eingeloggt.
              </p>
              <p className="muted" style={{ marginTop: 6 }}>
                Profil und alle Aktionen findest du auf der
                Profile-Seite.
              </p>
              <div style={{ marginTop: 10 }}>
                <Link href="/profile" className="btn">
                  Zum Profil
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="badge">
                Optional: login for history
              </p>
              <p style={{ marginTop: 10, fontWeight: 600 }}>
                Save your generated links.
              </p>
              <p
                className="muted"
                style={{ marginTop: 6, marginBottom: 12 }}
              >
                Generate & copy without login. With login,
                links go to your history.
              </p>
              <AuthModal
                triggerLabel="Login / Register"
                className="home__auth-trigger"
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
