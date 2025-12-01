import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const session = await requireAdminSession().catch(() => null);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (target.id === session.user.id || target.role === "ADMIN") {
    return NextResponse.json(
      { error: "Cannot clear history for this user" },
      { status: 400 }
    );
  }

  try {
    const [linkResult, shortResult] = await Promise.all([
      prisma.link.deleteMany({ where: { userId } }),
      prisma.shortLink.deleteMany({ where: { userId } }),
    ]);
    return NextResponse.json({
      ok: true,
      deletedLinks: linkResult.count,
      deletedShortLinks: shortResult.count,
    });
  } catch (error) {
    console.error("Failed to clear history", error);
    return NextResponse.json({ error: "Failed to clear history" }, { status: 500 });
  }
}
