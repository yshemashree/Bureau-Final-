import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Small key/value store for host-panel state that outlives a browser session —
 * currently just whether the Six Degrees verification caution was ticked off.
 */
export const appSettingsTable = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const SETTING_SIX_DEGREES_CAUTION_ACK = "six_degrees_caution_ack";

/**
 * The client's live URL for Game 2 - Spoof the System. Per the offline event
 * spec, this game is a plain redirect: our system stores/configures the URL
 * and opens it, nothing more. Admin-editable so the event team can point it
 * at the right link without a code change.
 */
export const SETTING_SPOOF_LIVE_URL = "spoof_live_url";

export const SETTING_ENABLE_LEADERBOARD = "enable_leaderboard";
export const SETTING_ENABLE_WAITLIST = "enable_waitlist";

export type AppSetting = typeof appSettingsTable.$inferSelect;
