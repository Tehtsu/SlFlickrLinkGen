import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SignOutButton } from "@/components/sign-out-button";
import { AutoLogoutTimer } from "@/components/auto-logout-timer";
import { DataManagement } from "@/components/data-management";
import { authOptions } from "@/lib/auth";
import { PasswordChangeForm } from "@/components/password-change-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect("/");
  }

  const isAdmin =
    (session?.user as { role?: string } | undefined)
      ?.role === "ADMIN";

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "28px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="badge">Profile</p>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            Signed in as {session.user.name}
          </h1>
          {isAdmin && (
            <p className="muted" style={{ marginTop: 4 }}>
              Rolle: Admin
            </p>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gap: 6,
            justifyItems: "end",
          }}
        >
          <AutoLogoutTimer />
          <SignOutButton />
        </div>
      </div>

      <div
        className="panel"
        style={{ padding: 12, marginBottom: 12 }}
      >
        <p className="badge">Daten & Konto</p>
        <div style={{ marginTop: 10 }}>
          <DataManagement />
        </div>
      </div>

      <PasswordChangeForm />

      {/* <div className="panel" style={{ padding: 12 }}>
        <p className="badge">NavigationXXX</p>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <Link href="/history" className="btn">
            History
          </Link>
          <Link href="/" className="btn">
            Generator
          </Link>
          <Link href="/shortener" className="btn">
            Shortener
          </Link>
          {isAdmin && (
            <Link href="/admin" className="btn">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div> */}
    </main>
  );
}
