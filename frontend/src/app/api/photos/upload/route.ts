import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireSession } from "@/lib/session";

export async function POST(request: Request) {
  await requireSession();

  if (!request.body) {
    return NextResponse.json({ error: "Missing file body" }, { status: 400 });
  }

  const filename = new URL(request.url).searchParams.get("filename") ?? "bottle.jpg";

  const blob = await put(`bottles/${Date.now()}-${filename}`, request.body, {
    access: "public",
    contentType: "image/jpeg",
  });

  return NextResponse.json({ url: blob.url });
}
