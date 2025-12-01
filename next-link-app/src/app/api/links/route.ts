import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { buildLink, linkInputSchema } from "@/lib/link-generator";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { incrementTotalLinks } from "@/lib/stats";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = linkInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const html = buildLink(parsed.data);

  await incrementTotalLinks().catch((error) => {
    console.error("Failed to bump total links", error);
  });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ html, saved: false });
  }

  try {
    await prisma.link.create({
      data: {
        userId: session.user.id,
        type: parsed.data.type,
        url: parsed.data.url.trim(),
        title: parsed.data.title?.trim() || parsed.data.url,
      },
    });
    return NextResponse.json({ html, saved: true });
  } catch (error) {
    console.error("Failed to save link", error);
    return NextResponse.json({ error: "Failed to save link" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ error: "History disabled" }, { status: 404 });
}
