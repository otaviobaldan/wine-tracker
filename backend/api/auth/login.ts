import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../lib/db.js";
import { users } from "../../lib/schema.js";
import { signToken, verifyPassword } from "../../lib/auth.js";
import { jsonError, methodGuard } from "../../lib/http.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(res, req.method, ["POST"])) return;

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return jsonError(res, 400, "Invalid request body", parsed.error.issues);
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return jsonError(res, 401, "Invalid email or password");
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    displayName: user.displayName,
  });

  return res.status(200).json({
    token,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
}
