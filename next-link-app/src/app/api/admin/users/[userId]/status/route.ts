import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

export async function PATCH(
  request: Request,
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
      { error: "Cannot change status for this user" },
      { status: 400 }
    );
  }

  try {
    const { status } = (await request.json().catch(() => null)) ?? {};
    if (status !== "ACTIVE" && status !== "BLOCKED") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, status: true },
    });

    if (status === "BLOCKED") {
      await prisma.session.deleteMany({ where: { userId } });
    }

    return NextResponse.json({ ok: true, user: updated });
  } catch (error) {
    console.error("Failed to update status", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
