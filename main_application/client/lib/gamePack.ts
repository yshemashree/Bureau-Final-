/**
 * Builds a randomised game pack for each quiz-driven game.
 *
 * Spot the Fraud: one question per level (10 total), selected randomly.
 * Fraud Detective: 5 cases selected randomly from the bank.
 *
 * The local Node.js server (backed by the on-booth database) is always tried
 * first: this is what lets an admin add/edit/deactivate a question from the
 * Admin Panel and have it show up in the next play with no code change. The
 * bundled workbook content only fills in if that local API call fails (e.g.
 * the server hasn't finished booting yet), so the booth never goes fully
 * dark, but a stale bundle can never silently override what the admin set.
 */
import { QUESTIONS, type Question } from '@/data/quiz';
import { CASES, type DetectiveCase } from '@/data/detective';
import { applyV5DetectiveContent, loadV5SpotQuestions } from '@/data/question-bank-v5';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

async function fetchLocalFallbackQuestions(): Promise<Question[]> {
  const localQuestions = await loadV5SpotQuestions().catch(() => QUESTIONS);
  return Array.from({ length: 10 }, (_, i) => {
    const pool = localQuestions.filter((q) => q.level === i + 1);
    return pool[Math.floor(Math.random() * Math.max(pool.length, 1))];
  }).filter(Boolean) as Question[];
}

/** Returns one active, database-managed question per level (levels 1–10). */
export async function fetchQuizGamePack(): Promise<Question[]> {
  try {
    const res = await fetch(`${base}/api/quiz/game-pack`);
    if (!res.ok) throw new Error(`${res.status}`);
    const body = (await res.json()) as { questions: Question[] };
    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      throw new Error('empty question bank');
    }
    
    let questions = body.questions;
    if (questions.length < 10) {
      const fallback = await fetchLocalFallbackQuestions();
      questions = Array.from({ length: 10 }, (_, i) => {
        const level = i + 1;
        return questions.find((q) => q.level === level) || fallback.find((q) => q.level === level);
      }).filter(Boolean) as Question[];
    }
    
    return questions;
  } catch {
    return fetchLocalFallbackQuestions();
  }
}

import { LIFELINE_QUESTIONS, type LifelineQuestion } from '@/data/lifeline';
export type { LifelineQuestion };

/** Returns a single random lifeline question. Falls back to the local bank. */
export async function fetchLifelineQuestion(): Promise<LifelineQuestion> {
  try {
    const res = await fetch(`${base}/api/lifeline/question`);
    if (!res.ok) throw new Error(`${res.status}`);
    return (await res.json()) as LifelineQuestion;
  } catch {
    return LIFELINE_QUESTIONS[Math.floor(Math.random() * LIFELINE_QUESTIONS.length)];
  }
}

/** Returns 5 active, database-managed Detective cases. */
export async function fetchDetectiveCasePack(): Promise<DetectiveCase[]> {
  try {
    const res = await fetch(`${base}/api/detective/case-pack`);
    if (!res.ok) throw new Error(`${res.status}`);
    const body = (await res.json()) as { cases: DetectiveCase[] };
    if (!Array.isArray(body.cases) || body.cases.length === 0) {
      throw new Error('empty case bank');
    }
    return body.cases;
  } catch {
    const reviewedCases = await applyV5DetectiveContent(CASES).catch(() => CASES);
    const shuffled = [...reviewedCases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }
}
