import { NextResponse } from "next/server";
import { buildLink, linkInputSchema } from "@/lib/link-generator";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = linkInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const html = buildLink(parsed.data);

  // History is disabled: just return the generated HTML without saving
  return NextResponse.json({ html, saved: false });
}

export async function GET(request: Request) {
  return NextResponse.json({ error: "History disabled" }, { status: 404 });
}
