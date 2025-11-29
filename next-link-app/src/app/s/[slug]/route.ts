import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug?.toLowerCase();
  if (!slug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const record = await prisma.shortLink.findUnique({ where: { slug } });
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(record.targetUrl, 302);
}