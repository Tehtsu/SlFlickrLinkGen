import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const oldPassword = body?.oldPassword;
  const newPassword = body?.newPassword;

  if (
    typeof oldPassword !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < 6
  ) {
    return NextResponse.json(
      { error: "Invalid input (password min 6 chars)" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await compare(oldPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
  }

  const passwordHash = await hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash, mustChangePassword: false },
  });
  await prisma.session.deleteMany({ where: { userId: session.user.id } });

  return NextResponse.json({ ok: true });
}
