import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, backendFetch } from "@/lib/api-client";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";
import type { SessionUser } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : undefined;
  const password = typeof body?.password === "string" ? body.password : undefined;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const data = await backendFetch<{ token: string; user: SessionUser }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    );

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json({ user: data.user });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
