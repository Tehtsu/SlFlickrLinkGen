import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;
  const kind = body?.kind as "link" | "short" | undefined;
  if (!id || !kind) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (kind === "link") {
    await prisma.link.deleteMany({ where: { id, userId: session.user.id } });
  } else {
    await prisma.shortLink.deleteMany({ where: { id, userId: session.user.id } });
  }

  return NextResponse.json({ ok: true });
}