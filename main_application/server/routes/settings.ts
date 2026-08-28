import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { appSettingsTable, db, SETTING_SPOOF_LIVE_URL } from "@db";

const router: IRouter = Router();

/**
 * Public, read-only settings needed by the game screens before the player is
 * an admin — currently just the Game 2 (Spoof the System) live redirect URL.
 * Writing this value happens through the admin-gated /admin/actions
 * `set_spoof_url` action instead, so no unauthenticated write path exists.
 */
router.get("/settings/spoof-url", async (_req, res): Promise<void> => {
  const [row] = await db
    .select()
    .from(appSettingsTable)
    .where(eq(appSettingsTable.key, SETTING_SPOOF_LIVE_URL))
    .limit(1);

  const url = typeof row?.value === "string" ? row.value : null;
  res.json({ url });
});

export default router;
