import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendFetch, ApiError } from "./api-client";
import type { SessionUser } from "./types";

export const SESSION_COOKIE_NAME = "wt_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days, matches backend JWT expiry

export interface Session {
  token: string;
  user: SessionUser;
}

// Verifies the session against the backend on every call (not just decoding the
// cookie locally), so the frontend never needs to know the JWT signing secret
// and a token revoked/expired on the backend is honored immediately.
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const user = await backendFetch<SessionUser>("/api/auth/me", { token });
    return { token, user };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
});

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
