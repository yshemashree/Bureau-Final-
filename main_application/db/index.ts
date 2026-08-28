import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

import type { PgDatabase } from "drizzle-orm/pg-core";

export let pool: pg.Pool | null = null;
export let db: PgDatabase<any, typeof schema>;

const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    job_function TEXT,
    no_work_email BOOLEAN NOT NULL DEFAULT FALSE,
    consent_at TIMESTAMPTZ NOT NULL,
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  DO $$ BEGIN
    CREATE TYPE game AS ENUM ('spot_the_fraud', 'spoof_the_system', 'fraud_detective');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE run_source AS ENUM ('kiosk', 'phone');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE question_kind AS ENUM ('text', 'image');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    game game NOT NULL,
    points INTEGER NOT NULL,
    detail JSONB,
    source run_source NOT NULL,
    event_day DATE NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    voided_at TIMESTAMPTZ,
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS run_progress (
    idempotency_key TEXT PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    game game NOT NULL,
    state JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS spoof_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    data TEXT,
    image_hash TEXT NOT NULL,
    fooled BOOLEAN NOT NULL,
    confidence TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS quiz_questions (
    id TEXT PRIMARY KEY,
    level INTEGER NOT NULL,
    scope TEXT NOT NULL,
    kind question_kind NOT NULL,
    select_n INTEGER NOT NULL,
    stem TEXT NOT NULL,
    options JSONB NOT NULL,
    correct JSONB NOT NULL,
    why TEXT NOT NULL,
    hook TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

  CREATE TABLE IF NOT EXISTS detective_cases (
    id TEXT PRIMARY KEY,
    "order" INTEGER NOT NULL,
    sector TEXT NOT NULL,
    title TEXT NOT NULL,
    clues JSONB NOT NULL,
    brief TEXT NOT NULL,
    instruction TEXT NOT NULL,
    nodes JSONB NOT NULL,
    clusters JSONB NOT NULL,
    edges JSONB NOT NULL,
    edge_labels JSONB,
    node_labels JSONB,
    answer JSONB NOT NULL,
    explanation TEXT NOT NULL,
    hook TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS lifeline_questions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'mcq',
    stem TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE OR REPLACE VIEW leaderboard_today AS
  SELECT
    p.id AS player_id,
    p.work_name AS work_name,
    p.company AS company,
    p.is_demo AS is_demo,
    COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spot_the_fraud'), 0)::int AS spot_the_fraud,
    COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spoof_the_system'), 0)::int AS spoof_the_system,
    COALESCE(MAX(r.points) FILTER (WHERE r.game = 'fraud_detective'), 0)::int AS fraud_detective,
    (COUNT(*) FILTER (WHERE r.game = 'spot_the_fraud') > 0) AS played_spot_the_fraud,
    (COUNT(*) FILTER (WHERE r.game = 'spoof_the_system') > 0) AS played_spoof_the_system,
    (COUNT(*) FILTER (WHERE r.game = 'fraud_detective') > 0) AS played_fraud_detective,
    COUNT(DISTINCT r.game)::int AS games_played,
    (CASE WHEN COUNT(DISTINCT r.game) = 3 THEN 40 ELSE 0 END)::int AS bonus,
    (
      COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spot_the_fraud'), 0)
      + COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spoof_the_system'), 0)
      + COALESCE(MAX(r.points) FILTER (WHERE r.game = 'fraud_detective'), 0)
      + CASE WHEN COUNT(DISTINCT r.game) = 3 THEN 40 ELSE 0 END
    )::int AS total
  FROM players p
  LEFT JOIN runs r
    ON r.player_id = p.id
   AND r.voided_at IS NULL
   AND r.event_day = (now() AT TIME ZONE 'Asia/Kolkata')::date
  GROUP BY p.id, p.work_name, p.company, p.is_demo;

  CREATE OR REPLACE VIEW leaderboard_cumulative AS
  SELECT
    p.id AS player_id,
    p.work_name AS work_name,
    p.company AS company,
    p.is_demo AS is_demo,
    COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spot_the_fraud'), 0)::int AS spot_the_fraud,
    COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spoof_the_system'), 0)::int AS spoof_the_system,
    COALESCE(MAX(r.points) FILTER (WHERE r.game = 'fraud_detective'), 0)::int AS fraud_detective,
    (COUNT(*) FILTER (WHERE r.game = 'spot_the_fraud') > 0) AS played_spot_the_fraud,
    (COUNT(*) FILTER (WHERE r.game = 'spoof_the_system') > 0) AS played_spoof_the_system,
    (COUNT(*) FILTER (WHERE r.game = 'fraud_detective') > 0) AS played_fraud_detective,
    COUNT(DISTINCT r.game)::int AS games_played,
    (CASE WHEN COUNT(DISTINCT r.game) = 3 THEN 40 ELSE 0 END)::int AS bonus,
    (
      COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spot_the_fraud'), 0)
      + COALESCE(MAX(r.points) FILTER (WHERE r.game = 'spoof_the_system'), 0)
      + COALESCE(MAX(r.points) FILTER (WHERE r.game = 'fraud_detective'), 0)
      + CASE WHEN COUNT(DISTINCT r.game) = 3 THEN 40 ELSE 0 END
    )::int AS total
  FROM players p
  LEFT JOIN runs r
    ON r.player_id = p.id
   AND r.voided_at IS NULL
  GROUP BY p.id, p.work_name, p.company, p.is_demo;
`;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg(pool, { schema });
  pool.query(INIT_SQL).catch((err) => {
    console.warn("Notice: automatic schema initialization check on PostgreSQL:", err?.message || err);
  });
} else {
  console.log("DATABASE_URL not set — using embedded PGlite WASM database (stored in ./.pgdata)");
  const pglite = new PGlite("./.pgdata");
  db = drizzlePglite(pglite, { schema });
  pglite.exec(INIT_SQL).catch((err) => {
    console.warn("Notice: automatic schema initialization check on PGlite:", err?.message || err);
  });
}

export * from "./schema";

