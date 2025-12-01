import { AuthModal } from "@/components/auth-modal";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { CopyButton } from "@/components/copy-button";
import { HistoryFilters } from "@/components/history-filters";
import { buildLink } from "@/lib/link-generator";
import { LocalTime } from "@/components/local-time";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { getGlobalStats } from "@/lib/stats";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [1, 3, 5, 10, 25];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const globalStatsPromise = getGlobalStats();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const globalStats = await globalStatsPromise;
    return (
      <main
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div>
            <p className="badge">History</p>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              Created links
            </h1>
            <p className="muted" style={{ marginTop: 4 }}>
              Please sign in to view your history.
            </p>
          </div>
          <Link
            href="/"
            className="btn"
            style={{ textDecoration: "none" }}
          >
            Back to generator
          </Link>
        </div>
        <div style={{ maxWidth: 520 }}>
          <AuthModal triggerLabel="Login / Register" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <span className="muted">
            Total links: {globalStats.totalLinks} | Short links:{" "}
            {globalStats.totalShortLinks}
          </span>
        </div>
      </main>
    );
  }

  const resolvedParams = await searchParams;

  const typeParam =
    typeof resolvedParams.type === "string"
      ? resolvedParams.type.toLowerCase()
      : undefined;
  const type =
    typeParam === "flickr" ||
    typeParam === "secondlife" ||
    typeParam === "short"
      ? typeParam
      : undefined;
  const from =
    typeof resolvedParams.from === "string"
      ? resolvedParams.from
      : undefined;
  const to =
    typeof resolvedParams.to === "string"
      ? resolvedParams.to
      : undefined;
  const pageRaw = Number(resolvedParams.page ?? 1);
  const page =
    Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const pageSizeRaw = Number(
    resolvedParams.pageSize ?? PAGE_SIZE
  );
  const pageSize = PAGE_SIZE_OPTIONS.includes(pageSizeRaw)
    ? pageSizeRaw
    : PAGE_SIZE;

  const where: {
    userId: string;
    type?: "flickr" | "secondlife";
    createdAt?: { gte?: Date; lte?: Date };
  } = { userId: session.user.id };
  if (type === "flickr" || type === "secondlife")
    where.type = type;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const linkWhere = { ...where };
  const shortWhere: {
    userId: string;
    createdAt?: { gte?: Date; lte?: Date };
  } = { userId: session.user.id };
  if (from || to) {
    shortWhere.createdAt = {};
    if (from) shortWhere.createdAt.gte = new Date(from);
    if (to) shortWhere.createdAt.lte = new Date(to);
  }

  const [links, shortLinks] = await Promise.all([
    type === "short"
      ? []
      : prisma.link.findMany({
          where: linkWhere,
          orderBy: { createdAt: "desc" },
        }),
    type && type !== "short"
      ? []
      : prisma.shortLink.findMany({
          where: shortWhere,
          orderBy: { createdAt: "desc" },
        }),
  ]);
  const globalStats = await globalStatsPromise;

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://linkgen.mrjyn.info";

  const combined = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...links.map((item: any) => ({
      kind: "link" as const,
      id: item.id,
      createdAt: item.createdAt,
      type: item.type,
      url: item.url,
      title: item.title,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...shortLinks.map((item: any) => ({
      kind: "short" as const,
      id: item.id,
      createdAt: item.createdAt,
      slug: item.slug,
      shortUrl: `${baseUrl}/s/${item.slug}`,
      targetUrl: item.targetUrl,
    })),
  ].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const total = combined.length;
  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );
  const paged = combined.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalLinkCount = globalStats.totalLinks;
  const totalShortLinkCount = globalStats.totalShortLinks;

  const createPageLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (pageSize) params.set("pageSize", String(pageSize));
    params.set("page", String(targetPage));
    return `/history?${params.toString()}`;
  };

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
        }}
      >
        <div>
          <p className="badge">History</p>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            Created links
          </h1>
          <p className="muted" style={{ marginTop: 2 }}>
            Filter by date and type, newest first.
          </p>
        </div>
        <Link
          href="/"
          className="btn"
          style={{ textDecoration: "none" }}
        >
          Back to generator
        </Link>
      </div>

      <HistoryFilters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialType={(type as any) ?? "all"}
        initialFrom={from}
        initialTo={to}
        initialPageSize={pageSize}
      />

      <div
        style={{ display: "grid", gap: 10, marginTop: 14 }}
      >
        {paged.map((item) => {
          if (item.kind === "short") {
            return (
              <div
                key={item.id}
                className="panel"
                style={{ padding: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="badge">short</span>
                    <span className="muted">
                      <LocalTime
                        value={item.createdAt.toISOString()}
                      />
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <CopyButton text={item.shortUrl} />
                    <DeleteEntryButton
                      id={item.id}
                      kind="short"
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    wordBreak: "break-word",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    {item.shortUrl}
                  </div>
                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="muted"
                  >
                    {item.targetUrl}
                  </a>
                </div>
              </div>
            );
          }

          const html = buildLink({
            url: item.url,
            title: item.title,
            type: item.type as "flickr" | "secondlife",
          });
          return (
            <div
              key={item.id}
              className="panel"
              style={{ padding: 12 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span className="badge">{item.type}</span>
                  <span className="muted">
                    <LocalTime
                      value={item.createdAt.toISOString()}
                    />
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <CopyButton text={html} />
                  <DeleteEntryButton
                    id={item.id}
                    kind="link"
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: 8,
                  wordBreak: "break-word",
                }}
              >
                <div
                  style={{ fontWeight: 600, fontSize: 16 }}
                >
                  {item.title}
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="muted"
                >
                  {item.url}
                </a>
              </div>
              <div
                className="panel"
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderStyle: "dashed",
                }}
              >
                <code style={{ color: "#c4d4ff" }}>
                  {html}
                </code>
              </div>
            </div>
          );
        })}
        {paged.length === 0 && (
          <div className="panel" style={{ padding: 12 }}>
            <p className="muted">No entries found.</p>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span className="muted">
          Page {page} / {totalPages} - {total} entries
        </span>
        <span
          className="muted"
          style={{ flex: 1, textAlign: "center" }}
        >
          Total links: {totalLinkCount} | Short links:{" "}
          {totalShortLinkCount}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href={createPageLink(Math.max(1, page - 1))}
            className="btn"
            aria-disabled={page === 1}
            style={{
              opacity: page === 1 ? 0.5 : 1,
              pointerEvents: page === 1 ? "none" : "auto",
            }}
          >
            Back
          </Link>
          <Link
            href={createPageLink(
              Math.min(totalPages, page + 1)
            )}
            className="btn"
            aria-disabled={page >= totalPages}
            style={{
              opacity: page >= totalPages ? 0.5 : 1,
              pointerEvents:
                page >= totalPages ? "none" : "auto",
            }}
          >
            Next
          </Link>
        </div>
      </div>
    </main>
  );
}
