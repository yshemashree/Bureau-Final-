/**
 * Dynamic question management for Spot the Fraud.
 *
 * This is the concrete implementation of the doc's core requirement: an admin
 * adds/edits/deactivates/reorders a question here, it lands in the local
 * database, and the next `/quiz/game-pack` call (which client/lib/gamePack.ts
 * calls before every play) picks it up immediately — no code change, no
 * redeploy.
 */
import { Router, type IRouter } from "express";
import { asc, eq, max } from "drizzle-orm";
import { z } from "zod/v4";
import { db, quizQuestionsTable } from "@db";

import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.use("/admin/questions", requireAdmin);

const questionBody = z.object({
  level: z.number().int().min(1).max(10),
  scope: z.string().min(1),
  kind: z.enum(["text", "image"]),
  selectN: z.number().int().min(1).max(4),
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correct: z.array(z.number().int().min(1)).min(1),
  why: z.string().min(1),
  hook: z.string().min(1).default(""),
  active: z.boolean().optional(),
});

function toDbRow(id: string, body: z.infer<typeof questionBody>, sortOrder: number) {
  return {
    id,
    level: body.level,
    scope: body.scope,
    kind: body.kind,
    selectN: body.selectN,
    stem: body.stem,
    options: body.options,
    correct: body.correct,
    why: body.why,
    hook: body.hook || body.scope,
    active: body.active === false ? 0 : 1,
    sortOrder,
  };
}

/** All questions, every level, active and inactive — the admin's full view. */
router.get("/admin/questions", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(quizQuestionsTable)
    .orderBy(asc(quizQuestionsTable.level), asc(quizQuestionsTable.sortOrder));
  res.json(rows.map((r) => ({ ...r, active: r.active === 1 })));
});

router.post("/admin/questions", async (req, res): Promise<void> => {
  const parsed = questionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Check the question fields.", details: parsed.error.issues });
    return;
  }
  if (Math.max(...parsed.data.correct) > parsed.data.options.length) {
    res.status(400).json({ error: "A correct-answer index is out of range for the given options.", field: "correct" });
    return;
  }

  const [row] = await db
    .select({ maxOrder: max(quizQuestionsTable.sortOrder) })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.level, parsed.data.level));
  const nextOrder = (row?.maxOrder ?? -1) + 1;

  const id = `SF-ADMIN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const [inserted] = await db
    .insert(quizQuestionsTable)
    .values(toDbRow(id, parsed.data, nextOrder))
    .returning();

  res.status(201).json({ ...inserted, active: inserted?.active === 1 });
});

router.put("/admin/questions/:id", async (req, res): Promise<void> => {
  const parsed = questionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Check the question fields.", details: parsed.error.issues });
    return;
  }
  if (Math.max(...parsed.data.correct) > parsed.data.options.length) {
    res.status(400).json({ error: "A correct-answer index is out of range for the given options.", field: "correct" });
    return;
  }

  const [existing] = await db
    .select({ sortOrder: quizQuestionsTable.sortOrder })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.id, req.params.id))
    .limit(1);

  if (existing === undefined) {
    res.status(404).json({ error: "That question no longer exists." });
    return;
  }

  const [updated] = await db
    .update(quizQuestionsTable)
    .set(toDbRow(req.params.id, parsed.data, existing.sortOrder))
    .where(eq(quizQuestionsTable.id, req.params.id))
    .returning();

  res.json({ ...updated, active: updated?.active === 1 });
});

const patchBody = z.object({ active: z.boolean() });

/** Quick enable/disable without resending the whole question. */
router.patch("/admin/questions/:id", async (req, res): Promise<void> => {
  const parsed = patchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Expected { active: boolean }." });
    return;
  }
  const [updated] = await db
    .update(quizQuestionsTable)
    .set({ active: parsed.data.active ? 1 : 0 })
    .where(eq(quizQuestionsTable.id, req.params.id))
    .returning();
  if (updated === undefined) {
    res.status(404).json({ error: "That question no longer exists." });
    return;
  }
  res.json({ ...updated, active: updated.active === 1 });
});

router.delete("/admin/questions/:id", async (req, res): Promise<void> => {
  const deleted = await db
    .delete(quizQuestionsTable)
    .where(eq(quizQuestionsTable.id, req.params.id))
    .returning({ id: quizQuestionsTable.id });
  res.json({ applied: deleted.length > 0 });
});

const reorderBody = z.object({
  // Ordered list of question ids within one level, first = sortOrder 0.
  ids: z.array(z.string()).min(1),
});

router.post("/admin/questions/reorder", async (req, res): Promise<void> => {
  const parsed = reorderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Expected { ids: string[] }." });
    return;
  }
  await Promise.all(
    parsed.data.ids.map((id, index) =>
      db.update(quizQuestionsTable).set({ sortOrder: index }).where(eq(quizQuestionsTable.id, id)),
    ),
  );
  res.json({ applied: true });
});

export default router;
