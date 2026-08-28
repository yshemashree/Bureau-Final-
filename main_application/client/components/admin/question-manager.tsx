/**
 * Dynamic question management for Spot the Fraud — the doc's "most important
 * requirement": add/edit/delete/reorder/enable-disable a question here and it
 * is immediately live in the game, no code change or redeploy.
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';

interface AdminQuestion {
  id: string;
  level: number;
  scope: string;
  kind: 'text' | 'image';
  selectN: number;
  stem: string;
  options: string[];
  correct: number[];
  why: string;
  hook: string;
  active: boolean;
  sortOrder: number;
}

type DraftQuestion = {
  level: number;
  scope: string;
  kind: 'text' | 'image';
  selectN: number;
  stem: string;
  optionsText: string; // one option per line
  correctText: string; // "1,3"
  why: string;
  hook: string;
};

const EMPTY_DRAFT: DraftQuestion = {
  level: 1,
  scope: '',
  kind: 'text',
  selectN: 1,
  stem: '',
  optionsText: '',
  correctText: '',
  why: '',
  hook: '',
};

function draftFromQuestion(q: AdminQuestion): DraftQuestion {
  return {
    level: q.level,
    scope: q.scope,
    kind: q.kind,
    selectN: q.selectN,
    stem: q.stem,
    optionsText: q.options.join('\n'),
    correctText: q.correct.join(','),
    why: q.why,
    hook: q.hook,
  };
}

function draftToBody(d: DraftQuestion, active?: boolean) {
  return {
    level: d.level,
    scope: d.scope || `Level ${d.level}`,
    kind: d.kind,
    selectN: d.selectN,
    stem: d.stem,
    options: d.optionsText.split('\n').map((s) => s.trim()).filter(Boolean),
    correct: d.correctText.split(',').map((s) => Number(s.trim())).filter((n) => Number.isFinite(n) && n > 0),
    why: d.why,
    hook: d.hook,
    ...(active === undefined ? {} : { active }),
  };
}

async function api<T>(passcode: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', 'x-admin-passcode': passcode, ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export function QuestionManager({ passcode }: { passcode: string }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<DraftQuestion>(EMPTY_DRAFT);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);

  const { data: questions } = useQuery({
    queryKey: ['admin-questions', passcode],
    queryFn: () => api<AdminQuestion[]>(passcode, '/admin/questions'),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-questions', passcode] });

  const createMutation = useMutation({
    mutationFn: (body: ReturnType<typeof draftToBody>) => api<AdminQuestion>(passcode, '/admin/questions', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => { toast({ title: 'Question added' }); invalidate(); setEditingId(null); setDraft(EMPTY_DRAFT); },
    onError: (e: Error) => toast({ title: 'Could not add question', description: e.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: ReturnType<typeof draftToBody> }) =>
      api<AdminQuestion>(passcode, `/admin/questions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    onSuccess: () => { toast({ title: 'Question updated' }); invalidate(); setEditingId(null); },
    onError: (e: Error) => toast({ title: 'Could not save question', description: e.message, variant: 'destructive' }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api<AdminQuestion>(passcode, `/admin/questions/${id}`, { method: 'PATCH', body: JSON.stringify({ active }) }),
    onSuccess: invalidate,
    onError: (e: Error) => toast({ title: 'Could not update question', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api<{ applied: boolean }>(passcode, `/admin/questions/${id}`, { method: 'DELETE' }),
    onSuccess: () => { toast({ title: 'Question deleted' }); invalidate(); },
    onError: (e: Error) => toast({ title: 'Could not delete question', description: e.message, variant: 'destructive' }),
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => api<{ applied: boolean }>(passcode, '/admin/questions/reorder', { method: 'POST', body: JSON.stringify({ ids }) }),
    onSuccess: invalidate,
  });

  const byLevel = useMemo(() => {
    const map = new Map<number, AdminQuestion[]>();
    for (const q of questions ?? []) {
      const list = map.get(q.level) ?? [];
      list.push(q);
      map.set(q.level, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.sortOrder - b.sortOrder);
    return map;
  }, [questions]);

  const moveQuestion = (level: number, index: number, direction: -1 | 1) => {
    const list = byLevel.get(level) ?? [];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const reordered = [...list];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    reorderMutation.mutate(reordered.map((q) => q.id));
  };

  const startEdit = (q: AdminQuestion) => {
    setEditingId(q.id);
    setDraft(draftFromQuestion(q));
    setExpandedLevel(q.level);
  };

  const startCreate = (level: number) => {
    setEditingId('new');
    setDraft({ ...EMPTY_DRAFT, level });
    setExpandedLevel(level);
  };

  const cancelEdit = () => { setEditingId(null); setDraft(EMPTY_DRAFT); };

  const submitDraft = () => {
    const body = draftToBody(draft);
    if (body.options.length < 2) {
      toast({ title: 'Add at least two options', variant: 'destructive' });
      return;
    }
    if (body.correct.length === 0 || body.correct.some((c) => c > body.options.length)) {
      toast({ title: 'Correct answer indices must point at real options (1-based)', variant: 'destructive' });
      return;
    }
    if (editingId === 'new') createMutation.mutate(body);
    else if (editingId) updateMutation.mutate({ id: editingId, body });
  };

  const fieldClass = "w-full border border-ice-300 bg-white px-3 py-2 font-sans text-body-sm text-russian focus:border-violet-700 focus:outline-none";

  return (
    <div className="flex flex-col border border-ice-300 bg-white text-russian">
      <div className="border-b border-ice-300 p-4">
        <h3 className="font-mono text-eyebrow font-medium uppercase tracking-[0.03em] text-russian">Spot the Fraud — Questions</h3>
        <p className="mt-1 text-body-sm text-[var(--text-muted)]">
          Add, edit, deactivate or reorder questions. Changes apply to the next play — no redeploy needed.
        </p>
      </div>

      <div className="flex flex-col">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
          const list = byLevel.get(level) ?? [];
          const expanded = expandedLevel === level;
          return (
            <div key={level} className="border-b border-ice-300 last:border-0">
              <button
                type="button"
                onClick={() => setExpandedLevel(expanded ? null : level)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-mono text-body-sm font-medium uppercase tracking-[0.03em]">
                  Level {level} <span className="text-[var(--text-faint)]">({list.length} question{list.length === 1 ? '' : 's'})</span>
                </span>
                {expanded ? <ChevronUp className="size-4" strokeWidth={1.5} /> : <ChevronDown className="size-4" strokeWidth={1.5} />}
              </button>

              {expanded && (
                <div className="flex flex-col gap-3 px-4 pb-4">
                  {list.map((q, index) => (
                    <div key={q.id} className={cn('border p-3', q.active ? 'border-ice-300' : 'border-ice-300 bg-ice-100 opacity-60')}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 flex-1 text-body-sm font-medium">{q.stem}</p>
                        <div className="flex shrink-0 items-center gap-1">
                          <button type="button" onClick={() => moveQuestion(level, index, -1)} disabled={index === 0} aria-label="Move up" className="flex size-7 items-center justify-center disabled:opacity-30">
                            <ChevronUp className="size-4" strokeWidth={1.5} />
                          </button>
                          <button type="button" onClick={() => moveQuestion(level, index, 1)} disabled={index === list.length - 1} aria-label="Move down" className="flex size-7 items-center justify-center disabled:opacity-30">
                            <ChevronDown className="size-4" strokeWidth={1.5} />
                          </button>
                          <button type="button" onClick={() => startEdit(q)} aria-label="Edit" className="flex size-7 items-center justify-center text-violet-700">
                            <Pencil className="size-4" strokeWidth={1.5} />
                          </button>
                          <button type="button" onClick={() => deleteMutation.mutate(q.id)} aria-label="Delete" className="flex size-7 items-center justify-center text-coral-600">
                            <Trash2 className="size-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleMutation.mutate({ id: q.id, active: !q.active })}
                          className={cn('px-2 py-1 font-mono text-[11px] uppercase tracking-[0.03em]', q.active ? 'bg-lime-300 text-russian' : 'bg-ice-300 text-[var(--text-muted)]')}
                        >
                          {q.active ? 'Active' : 'Disabled'}
                        </button>
                        <span className="font-mono text-[11px] uppercase tracking-[0.03em] text-[var(--text-faint)]">{q.kind} · select {q.selectN}</span>
                      </div>

                      {editingId === q.id && (
                        <QuestionForm draft={draft} setDraft={setDraft} fieldClass={fieldClass} onCancel={cancelEdit} onSubmit={submitDraft} submitLabel="Save changes" pending={updateMutation.isPending} />
                      )}
                    </div>
                  ))}

                  {editingId === 'new' && draft.level === level ? (
                    <div className="border border-violet-700 p-3">
                      <QuestionForm draft={draft} setDraft={setDraft} fieldClass={fieldClass} onCancel={cancelEdit} onSubmit={submitDraft} submitLabel="Add question" pending={createMutation.isPending} />
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => startCreate(level)} className="self-start">
                      <Plus className="mr-2 size-4" strokeWidth={1.5} /> Add question to level {level}
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionForm({
  draft, setDraft, fieldClass, onCancel, onSubmit, submitLabel, pending,
}: {
  draft: DraftQuestion;
  setDraft: (d: DraftQuestion) => void;
  fieldClass: string;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  pending: boolean;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-ice-300 pt-3">
      <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
        Question
        <textarea className={cn(fieldClass, 'mt-1')} rows={2} value={draft.stem} onChange={(e) => setDraft({ ...draft, stem: e.target.value })} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
          Kind
          <select className={cn(fieldClass, 'mt-1')} value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as 'text' | 'image' })}>
            <option value="text">Text (MCQ)</option>
            <option value="image">Image (Spot the Fake)</option>
          </select>
        </label>
        <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
          Select N (how many correct)
          <input type="number" min={1} max={4} className={cn(fieldClass, 'mt-1')} value={draft.selectN} onChange={(e) => setDraft({ ...draft, selectN: Number(e.target.value) || 1 })} />
        </label>
      </div>
      <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
        Options (one per line)
        <textarea className={cn(fieldClass, 'mt-1')} rows={4} value={draft.optionsText} onChange={(e) => setDraft({ ...draft, optionsText: e.target.value })} />
      </label>
      <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
        Correct option number(s), comma-separated, 1-based (e.g. "2" or "1,3")
        <input className={cn(fieldClass, 'mt-1')} value={draft.correctText} onChange={(e) => setDraft({ ...draft, correctText: e.target.value })} />
      </label>
      <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
        Explanation (shown after answering)
        <textarea className={cn(fieldClass, 'mt-1')} rows={2} value={draft.why} onChange={(e) => setDraft({ ...draft, why: e.target.value })} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
          Content tag / scope
          <input className={cn(fieldClass, 'mt-1')} value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })} />
        </label>
        <label className="text-[11px] font-mono uppercase tracking-[0.03em] text-[var(--text-faint)]">
          Host hook (short label)
          <input className={cn(fieldClass, 'mt-1')} value={draft.hook} onChange={(e) => setDraft({ ...draft, hook: e.target.value })} />
        </label>
      </div>
      <div className="mt-1 flex gap-2">
        <Button variant="dark" size="sm" onClick={onSubmit} disabled={pending}>{submitLabel}</Button>
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
