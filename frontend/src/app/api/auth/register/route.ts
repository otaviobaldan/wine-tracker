import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, backendFetch } from "@/lib/api-client";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";
import type { SessionUser } from "@/lib/types";

function translateError(status: number): string {
  if (status === 409) return "Já existe uma conta com esse e-mail.";
  if (status === 400) return "Verifique os dados informados.";
  return "Algo deu errado. Tente novamente.";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : undefined;
  const password = typeof body?.password === "string" ? body.password : undefined;
  const displayName = typeof body?.displayName === "string" ? body.displayName : undefined;

  if (!email || !password || !displayName) {
    return NextResponse.json(
      { error: "Nome, e-mail e senha são obrigatórios." },
      { status: 400 },
    );
  }

  try {
    const data = await backendFetch<{ token: string; user: SessionUser }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify({ email, password, displayName }) },
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
      return NextResponse.json({ error: translateError(err.status) }, { status: err.status });
    }
    return NextResponse.json({ error: "Algo deu errado. Tente novamente." }, { status: 500 });
  }
}
