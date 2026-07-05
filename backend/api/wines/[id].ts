import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";
import { db } from "../../lib/db.js";
import { wines } from "../../lib/schema.js";
import { requireAuth } from "../../lib/middleware.js";
import { jsonError, methodGuard } from "../../lib/http.js";
import { updateWineSchema } from "../../lib/validation.js";

export default requireAuth(async (req: VercelRequest, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    return jsonError(res, 400, "Invalid wine id");
  }

  if (req.method === "GET") return handleGet(res, id);
  if (req.method === "PUT") return handleUpdate(req, res, id);
  if (req.method === "DELETE") return handleDelete(res, id);
  return methodGuard(res, req.method, ["GET", "PUT", "DELETE"]);
});

async function handleGet(res: VercelResponse, id: string) {
  const [wine] = await db.select().from(wines).where(eq(wines.id, id)).limit(1);
  if (!wine) return jsonError(res, 404, "Wine not found");
  return res.status(200).json({ wine });
}

async function handleUpdate(req: VercelRequest, res: VercelResponse, id: string) {
  const parsed = updateWineSchema.safeParse(req.body);
  if (!parsed.success) {
    return jsonError(res, 400, "Invalid wine payload", parsed.error.issues);
  }

  const [wine] = await db
    .update(wines)
    .set(parsed.data)
    .where(eq(wines.id, id))
    .returning();

  if (!wine) return jsonError(res, 404, "Wine not found");
  return res.status(200).json({ wine });
}

async function handleDelete(res: VercelResponse, id: string) {
  const [wine] = await db
    .delete(wines)
    .where(eq(wines.id, id))
    .returning({ bottlePhotoUrl: wines.bottlePhotoUrl });

  if (!wine) return jsonError(res, 404, "Wine not found");

  if (wine.bottlePhotoUrl && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(wine.bottlePhotoUrl).catch(() => {
      // photo cleanup is best-effort; the wine row is already gone
    });
  }

  return res.status(204).end();
}
