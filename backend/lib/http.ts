import type { VercelResponse } from "@vercel/node";
import type { ZodError } from "zod";

export function jsonError(
  res: VercelResponse,
  status: number,
  error: string,
  details?: ZodError["issues"],
) {
  return res.status(status).json(details ? { error, details } : { error });
}

export function methodGuard(
  res: VercelResponse,
  method: string | undefined,
  allowed: string[],
): boolean {
  if (!method || !allowed.includes(method)) {
    res.setHeader("Allow", allowed.join(", "));
    jsonError(res, 405, `Method ${method ?? ""} not allowed`);
    return false;
  }
  return true;
}
