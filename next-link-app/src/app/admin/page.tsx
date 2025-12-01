import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGlobalStats } from "@/lib/stats";
import { AdminUserRow } from "@/components/admin-user-row";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${user.length > 2 ? "***" : ""}@${domain}`;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const [
    userCount,
    linkPerDayRaw,
    shortPerDayRaw,
    globalStats,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE(createdAt) as day, COUNT(*) as count
      FROM Link
      GROUP BY DATE(createdAt)
      ORDER BY day DESC
      LIMIT 14
    `,
    prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE(createdAt) as day, COUNT(*) as count
      FROM ShortLink
      GROUP BY DATE(createdAt)
      ORDER BY day DESC
      LIMIT 14
    `,
    getGlobalStats(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        status: true,
        role: true,
      },
    }),
  ]);

  const perDayMap = new Map<string, number>();
  [...linkPerDayRaw, ...shortPerDayRaw].forEach((row) => {
    const key = formatDate(new Date(row.day));
    const countNum =
      typeof row.count === "bigint" ? Number(row.count) : (row.count as number);
    perDayMap.set(key, (perDayMap.get(key) ?? 0) + countNum);
  });

  const perDay = Array.from(perDayMap.entries()).sort(
    ([a], [b]) => (a < b ? 1 : -1)
  );

  return (
    <main
      style={{
        maxWidth: 1080,
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
          <p className="badge">Admin</p>
          <h1
            style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}
          >
            Dashboard
          </h1>
          <p className="muted" style={{ marginTop: 2 }}>
            Überblick über Nutzer und Link-Volumen (global).
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <div className="panel" style={{ padding: 12 }}>
          <p className="muted" style={{ fontSize: 12 }}>
            Users
          </p>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {userCount}
          </div>
        </div>
        <div className="panel" style={{ padding: 12 }}>
          <p className="muted" style={{ fontSize: 12 }}>
            Links total
          </p>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {globalStats.totalLinks}
          </div>
        </div>
        <div className="panel" style={{ padding: 12 }}>
          <p className="muted" style={{ fontSize: 12 }}>
            Short links total
          </p>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {globalStats.totalShortLinks}
          </div>
        </div>
      </div>

      <div
        className="panel"
        style={{ padding: 12, marginTop: 16 }}
      >
        <p className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
          Links pro Tag (letzte 14 Tage, inkl. Short)
        </p>
        <div
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {perDay.length === 0 && (
            <span className="muted">Keine Daten</span>
          )}
          {perDay.map(([day, count]) => (
            <div
              key={day}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px dashed var(--border)",
                paddingBottom: 4,
              }}
            >
              <span className="muted">{day}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="panel"
        style={{ padding: 12, marginTop: 16 }}
      >
        <p className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
          Letzte registrierte Nutzer (maskierte E-Mails)
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {recentUsers.map((user) => (
            <AdminUserRow
              key={user.id}
              user={{
                ...user,
                createdAt: user.createdAt.toISOString(),
              }}
              selfId={session.user.id}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
