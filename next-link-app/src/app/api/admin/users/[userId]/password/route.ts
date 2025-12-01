import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { sendAdminSetPasswordEmail } from "@/lib/mail";

export async function POST(
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
    select: { id: true, role: true, email: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (target.id === session.user.id || target.role === "ADMIN") {
    return NextResponse.json(
      { error: "Cannot set password for this user" },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = body?.password;
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }

  try {
    const passwordHash = await hash(password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash, mustChangePassword: true },
    });
    await prisma.session.deleteMany({ where: { userId } });
    try {
      await sendAdminSetPasswordEmail(target.email, password);
    } catch (error) {
      console.error("Failed to send password email", error);
      return NextResponse.json(
        {
          error:
            "Password set, but email could not be sent. Please notify the user manually.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to set password", error);
    return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
  }
}
