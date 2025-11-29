import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const normalized = slug?.toLowerCase();
  if (!normalized) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const record = await prisma.shortLink.findUnique({ where: { slug: normalized } });
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(record.targetUrl, 302);
}
