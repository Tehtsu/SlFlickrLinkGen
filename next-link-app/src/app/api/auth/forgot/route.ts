import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
  const token = randomBytes(32).toString("hex");

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    try {
      await sendPasswordResetEmail(email, token);
    } catch (error) {
      console.error("sendPasswordResetEmail failed", error);
      return NextResponse.json(
        { error: "Email konnte nicht gesendet werden." },
        { status: 500 }
      );
    }
  }

  // Always return generic success (no token leakage).
  return NextResponse.json({ ok: true });
}
