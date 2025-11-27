import { format } from "date-fns";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { AuthPanel } from "@/components/auth-panel";
import { CopyButton } from "@/components/copy-button";
import { HistoryFilters } from "@/components/history-filters";
import { buildLink } from "@/lib/link-generator";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const PAGE_SIZE = 10;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
        <AuthPanel />
      </main>
    );
  }

  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const from = typeof searchParams.from === "string" ? searchParams.from : undefined;
  const to = typeof searchParams.to === "string" ? searchParams.to : undefined;
  const page = Math.max(1, Number(searchParams.page ?? 1));

  const where: any = { userId: session.user.id };
  if (type === "flickr" || type === "secondlife") where.type = type;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [items, total] = await Promise.all([
    prisma.link.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.link.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const createPageLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.set("page", String(targetPage));
    return `/history?${params.toString()}`;
  };

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div>
          <p className="badge">History</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>Created links</h1>
          <p className="muted" style={{ marginTop: 4 }}>
            Filter by date and type, newest first.
          </p>
        </div>
        <Link href="/" className="btn" style={{ textDecoration: "none" }}>
          Back to generator
        </Link>
      </div>

      <HistoryFilters initialType={(type as any) ?? "all"} initialFrom={from} initialTo={to} />

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {items.map((item) => {
          const html = buildLink({
            url: item.url,
            title: item.title,
            type: item.type as "flickr" | "secondlife",
          });
          return (
            <div key={item.id} className="panel" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge">{item.type}</span>
                  <span className="muted">{format(item.createdAt, "dd.MM.yyyy HH:mm")}</span>
                </div>
                <CopyButton text={html} />
              </div>
              <div style={{ marginTop: 8, wordBreak: "break-word" }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</div>
                <a href={item.url} target="_blank" rel="noreferrer" className="muted">
                  {item.url}
                </a>
              </div>
              <div className="panel" style={{ marginTop: 12, padding: 12, borderStyle: "dashed" }}>
                <code style={{ color: "#c4d4ff" }}>{html}</code>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="panel" style={{ padding: 16 }}>
            <p className="muted">No entries found.</p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
        <span className="muted">
          Page {page} / {totalPages} · {total} entries
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href={createPageLink(Math.max(1, page - 1))}
            className="btn"
            aria-disabled={page === 1}
            style={{ opacity: page === 1 ? 0.5 : 1, pointerEvents: page === 1 ? "none" : "auto" }}
          >
            Back
          </Link>
          <Link
            href={createPageLink(Math.min(totalPages, page + 1))}
            className="btn"
            aria-disabled={page >= totalPages}
            style={{ opacity: page >= totalPages ? 0.5 : 1, pointerEvents: page >= totalPages ? "none" : "auto" }}
          >
            Next
          </Link>
        </div>
      </div>
    </main>
  );
}
