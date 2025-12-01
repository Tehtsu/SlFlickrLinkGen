import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { incrementTotalShortLinks } from "@/lib/stats";

const bodySchema = z.object({
  url: z.string().url(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]{3,32}$/)
    .optional(),
});

const slugChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function randomSlug(length = 7) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += slugChars[Math.floor(Math.random() * slugChars.length)];
  }
  return out;
}

async function generateUniqueSlug(candidate?: string): Promise<string> {
  const normalized = candidate?.toLowerCase();
  if (normalized) {
    const exists = await prisma.shortLink.findUnique({ where: { slug: normalized } });
    if (!exists) return normalized;
  }
  for (let i = 0; i < 5; i += 1) {
    const attempt = randomSlug(7).toLowerCase();
    const exists = await prisma.shortLink.findUnique({ where: { slug: attempt } });
    if (!exists) return attempt;
  }
  throw new Error("Could not generate unique slug");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const slug = await generateUniqueSlug(parsed.data.slug);

  const created = await prisma.shortLink.create({
    data: {
      slug,
      targetUrl: parsed.data.url,
      userId: session?.user?.id ?? null,
    },
  });

  await incrementTotalShortLinks().catch((error) => {
    console.error("Failed to bump total short links", error);
  });

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return NextResponse.json({
    slug: created.slug,
    shortUrl: `${baseUrl}/s/${created.slug}`,
  });
}
