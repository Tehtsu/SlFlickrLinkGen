// import Link from "next/link";
// import { getServerSession } from "next-auth";
import { LinkGenerator } from "@/components/link-generator";
// import { AuthPanel } from "@/components/auth-panel";
// import { SignOutButton } from "@/components/sign-out-button";
// import { authOptions } from "@/lib/auth";

export default async function Home() {
  // const session = await getServerSession(authOptions);
  const variant = "FlickR und SL Link";
  const hasSidebar = false; // set true when auth panel is active
  const columns = hasSidebar ? "2fr 1fr" : "minmax(0, 720px)";

  return (
    <main
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "40px 20px",
        display: "grid",
        gap: 16,
        justifyContent: "center",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="badge">{variant} Generator</p>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              marginTop: 6,
            }}
          >
            Link builder with history
          </h1>
          <p className="muted" style={{ marginTop: 4 }}>
            Create Flickr or SecondLife links without login.
            Saving to history is available after login.
          </p>
        </div>
        {/* <div style={{ display: "flex", gap: 10 }}>
          <Link href="/history" className="btn" style={{ textDecoration: "none" }}>
            History
          </Link>
          {session?.user ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div className="badge">Signed in as {session.user.email}</div>
              <SignOutButton />
            </div>
          ) : (
            <div className="badge">Not signed in</div>
          )}
        </div> */}
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: columns,
          gap: 16,
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <LinkGenerator variant={variant} />
        {/* <div className="panel" style={{ padding: 20 }}> */}
        {/* {session?.user ? ( */}
        {/* <> */}
        {/* <p className="badge">Signed in</p> */}
        {/* <p style={{ marginTop: 10, fontWeight: 600 }}> */}
        {/* Your links will be saved. */}
        {/* </p> */}
        {/* <p className="muted" style={{ marginTop: 6 }}> */}
        {/* View your history and filter by date/type. */}
        {/* </p> */}
        {/* <div style={{ marginTop: 10 }}> */}
        {/* <SignOutButton /> */}
        {/* </div> */}
        {/* </> */}
        {/* ) : ( */}
        {/* <> */}
        {/* <p className="badge"> */}
        {/* Optional: login for history */}
        {/* </p> */}
        {/* <p style={{ marginTop: 10, fontWeight: 600 }}> */}
        {/* Save your generated links. */}
        {/* </p> */}
        {/* <p */}
        {/* className="muted" */}
        {/* style={{ marginTop: 6, marginBottom: 12 }} */}
        {/* > */}
        {/* Generate & copy without login. With login, */}
        {/* links go to your history. */}
        {/* </p> */}
        {/* <AuthPanel /> */}
        {/* </> */}
        {/* )} */}
        {/* </div> */}
      </div>
    </main>
  );
}
