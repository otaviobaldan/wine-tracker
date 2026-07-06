import type { VercelRequest, VercelResponse } from "@vercel/node";
import { asc } from "drizzle-orm";
import { db } from "../../lib/db.js";
import { users } from "../../lib/schema.js";
import { requireAuth } from "../../lib/middleware.js";
import { methodGuard } from "../../lib/http.js";

export default requireAuth(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(res, req.method, ["GET"])) return;

  const results = await db
    .select({ id: users.id, displayName: users.displayName })
    .from(users)
    .orderBy(asc(users.displayName));

  return res.status(200).json({ users: results });
});
