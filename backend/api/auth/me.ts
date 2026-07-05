import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../../lib/middleware.js";
import { methodGuard } from "../../lib/http.js";
import type { SessionUser } from "../../lib/auth.js";

export default requireAuth(
  async (req: VercelRequest, res: VercelResponse, user: SessionUser) => {
    if (!methodGuard(res, req.method, ["GET"])) return;

    return res.status(200).json({
      id: user.sub,
      email: user.email,
      displayName: user.displayName,
    });
  },
);
