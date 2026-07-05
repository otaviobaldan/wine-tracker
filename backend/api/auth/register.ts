import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../lib/db.js";
import { users } from "../../lib/schema.js";
import { hashPassword, signToken } from "../../lib/auth.js";
import { jsonError, methodGuard } from "../../lib/http.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().trim().min(1),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(res, req.method, ["POST"])) return;

  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return jsonError(res, 400, "Invalid request body", parsed.error.issues);
  }

  const { email, password, displayName } = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return jsonError(res, 409, "An account with that email already exists");
  }

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash: await hashPassword(password), displayName })
    .returning();

  if (!user) {
    return jsonError(res, 500, "Failed to create account");
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    displayName: user.displayName,
  });

  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
}
