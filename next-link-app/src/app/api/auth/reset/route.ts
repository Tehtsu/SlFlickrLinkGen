import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const tokenRecord = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (!tokenRecord || tokenRecord.expires < new Date()) {
    return NextResponse.json({ error: "Ungültiger oder abgelaufener Token" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: tokenRecord.identifier },
  });

  if (!user) {
    await prisma.verificationToken.deleteMany({ where: { identifier: tokenRecord.identifier } });
    return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 400 });
  }

  const passwordHash = await hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.verificationToken.deleteMany({ where: { identifier: tokenRecord.identifier } }),
  ]);

  return NextResponse.json({ ok: true });
}