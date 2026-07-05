import type { VercelRequest, VercelResponse } from "@vercel/node";
import { and, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { db } from "../../lib/db.js";
import { wines } from "../../lib/schema.js";
import { requireAuth } from "../../lib/middleware.js";
import { jsonError, methodGuard } from "../../lib/http.js";
import { createWineSchema, wineFilterSchema } from "../../lib/validation.js";
import type { SessionUser } from "../../lib/auth.js";

export default requireAuth(
  async (req: VercelRequest, res: VercelResponse, user: SessionUser) => {
    if (req.method === "GET") {
      return handleList(req, res);
    }
    if (req.method === "POST") {
      return handleCreate(req, res, user);
    }
    return methodGuard(res, req.method, ["GET", "POST"]);
  },
);

async function handleList(req: VercelRequest, res: VercelResponse) {
  const parsed = wineFilterSchema.safeParse(req.query);
  if (!parsed.success) {
    return jsonError(res, 400, "Invalid query parameters", parsed.error.issues);
  }
  const { q, type, grapeOrigin, minScore, maxScore } = parsed.data;

  const conditions = [];
  if (q) {
    conditions.push(or(ilike(wines.name, `%${q}%`), ilike(wines.winery, `%${q}%`)));
  }
  if (type) {
    conditions.push(eq(wines.type, type));
  }
  if (grapeOrigin) {
    conditions.push(ilike(wines.grapeOrigin, `%${grapeOrigin}%`));
  }
  if (minScore !== undefined) {
    conditions.push(gte(wines.score, minScore));
  }
  if (maxScore !== undefined) {
    conditions.push(lte(wines.score, maxScore));
  }

  const results = await db
    .select()
    .from(wines)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(wines.whenTried), desc(wines.createdAt));

  return res.status(200).json({ wines: results });
}

async function handleCreate(
  req: VercelRequest,
  res: VercelResponse,
  user: SessionUser,
) {
  const parsed = createWineSchema.safeParse(req.body);
  if (!parsed.success) {
    return jsonError(res, 400, "Invalid wine payload", parsed.error.issues);
  }

  const [wine] = await db
    .insert(wines)
    .values({ ...parsed.data, createdBy: user.displayName })
    .returning();

  return res.status(201).json({ wine });
}
