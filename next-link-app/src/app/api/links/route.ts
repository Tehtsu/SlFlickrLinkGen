import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { LinkType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { buildLink, linkInputSchema } from "@/lib/link-generator";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json().catch(() => null);
  const parsed = linkInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const html = buildLink(parsed.data);

  // Ohne Session: nur HTML zurückgeben, nichts speichern
  if (!session?.user?.id) {
    return NextResponse.json({ html, saved: false });
  }

  const link = await prisma.link.create({
    data: {
      title: parsed.data.title && parsed.data.title.length > 0 ? parsed.data.title : parsed.data.url,
      url: parsed.data.url,
      type: parsed.data.type as LinkType,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ link, html, saved: true });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));

  const where: any = { userId: session.user.id };
  if (typeParam && (typeParam === "flickr" || typeParam === "secondlife")) {
    where.type = typeParam as LinkType;
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [items, total] = await Promise.all([
    prisma.link.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.link.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, limit });
}
