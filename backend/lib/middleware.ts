import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyToken, type SessionUser } from "./auth.js";
import { jsonError } from "./http.js";

export type AuthedHandler = (
  req: VercelRequest,
  res: VercelResponse,
  user: SessionUser,
) => unknown | Promise<unknown>;

export function requireAuth(handler: AuthedHandler) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      return jsonError(res, 401, "Missing bearer token");
    }

    let user: SessionUser;
    try {
      user = verifyToken(token);
    } catch {
      return jsonError(res, 401, "Invalid or expired token");
    }

    return handler(req, res, user);
  };
}
