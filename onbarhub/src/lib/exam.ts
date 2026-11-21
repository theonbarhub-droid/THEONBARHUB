// Core types and pure helpers for the practice exam engine.
// Your vetted mocks drop into src/data/mocks/ using these shapes.

export type ExamKind = "solicitor" | "barrister";

export interface ExamQuestion {
  /** Stable unique id, e.g. "sol-re-001". */
  id: string;
  /** Subject label used for grouping analytics, e.g. "Real Estate". */
  subject: string;
  /** The question text. */
  stem: string;
  /** 2-5 answer options, in display order. */
  options: string[];
  /** Index into options of the correct answer. */
  answer: number;
  /** Why the answer is right (shown in review). Optional but recommended. */
  explanation?: string;
  /** Where to read more, e.g. "LSO p. 50". Optional. */
  reference?: string;
  /** A short memory hook / mnemonic for the rule. Optional. */
  hook?: string;
  /** Human-readable chapter label, e.g. "ch 6 · Conflicts of interest". Optional. */
  chapterLabel?: string;
}

export interface Mock {
  /** Stable unique id, e.g. "solicitor-starter". */
  id: string;
  title: string;
  exam: ExamKind;
  /** One-line description shown on the start screen. */
  description?: string;
  /** Minutes allowed when run in timed mode. */
  timeLimitMinutes: number;
  questions: ExamQuestion[];
  /** Marks a free demonstration mock written by The OnBar Hub. */
  isSample?: boolean;
}

export interface SubjectScore {
  subject: string;
  correct: number;
  total: number;
  pct: number;
}

export interface ScoreResult {
  correct: number;
  total: number;
  pct: number;
  bySubject: SubjectScore[];
}

/** Score an attempt. `answers` maps question id -> chosen option index. */
export function scoreMock(mock: Mock, answers: Record<string, number>): ScoreResult {
  const subjects = new Map<string, { correct: number; total: number }>();
  let correct = 0;

  for (const q of mock.questions) {
    const bucket = subjects.get(q.subject) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    const chosen = answers[q.id];
    if (chosen === q.answer) {
      correct += 1;
      bucket.correct += 1;
    }
    subjects.set(q.subject, bucket);
  }

  const total = mock.questions.length;
  const bySubject: SubjectScore[] = [...subjects.entries()]
    .map(([subject, b]) => ({
      subject,
      correct: b.correct,
      total: b.total,
      pct: b.total ? Math.round((b.correct / b.total) * 100) : 0,
    }))
    .sort((a, b) => a.subject.localeCompare(b.subject));

  return {
    correct,
    total,
    pct: total ? Math.round((correct / total) * 100) : 0,
    bySubject,
  };
}

export interface AnswerChange {
  id: string;
  from: number;
  to: number;
}

export interface ChapterScore {
  label: string;
  correct: number;
  total: number;
  pct: number;
  avgSec: number;
}

export interface TimeSink {
  n: number;
  label: string;
  sec: number;
  correct: boolean;
  answered: boolean;
}

export interface DeepAnalysis {
  perQuestionBudgetSec: number;
  overBudgetCount: number;
  overBudgetSec: number;
  changeWrongToRight: number;
  changeRightToWrong: number;
  changeWrongToWrong: number;
  notExcept: { correct: number; total: number } | null;
  byChapter: ChapterScore[];
  timeSinks: TimeSink[];
}

const NOT_EXCEPT = /\b(NOT|EXCEPT)\b/;

/** Build the per-attempt deep analysis. `times` is per-question milliseconds. */
export function analyze(
  mock: Mock,
  answers: Record<string, number>,
  times: Record<string, number>,
  changes: AnswerChange[],
): DeepAnalysis {
  const n = mock.questions.length;
  const perQuestionBudgetSec = n ? Math.round((mock.timeLimitMinutes * 60) / n) : 0;

  let overBudgetCount = 0;
  let overBudgetSec = 0;
  for (const q of mock.questions) {
    const sec = (times[q.id] ?? 0) / 1000;
    if (perQuestionBudgetSec > 0 && sec > perQuestionBudgetSec) {
      overBudgetCount += 1;
      overBudgetSec += sec - perQuestionBudgetSec;
    }
  }

  let wr = 0,
    rw = 0,
    ww = 0;
  for (const c of changes) {
    const ans = mock.questions.find((q) => q.id === c.id)?.answer;
    if (ans === undefined) continue;
    const fromRight = c.from === ans;
    const toRight = c.to === ans;
    if (!fromRight && toRight) wr += 1;
    else if (fromRight && !toRight) rw += 1;
    else if (!fromRight && !toRight) ww += 1;
  }

  // NOT / EXCEPT questions
  const ne = mock.questions.filter((q) => NOT_EXCEPT.test(q.stem));
  const notExcept = ne.length
    ? { correct: ne.filter((q) => answers[q.id] === q.answer).length, total: ne.length }
    : null;

  // by chapter (fall back to subject when no chapter label)
  const chap = new Map<string, { correct: number; total: number; ms: number }>();
  for (const q of mock.questions) {
    const key = q.chapterLabel || q.subject;
    const b = chap.get(key) ?? { correct: 0, total: 0, ms: 0 };
    b.total += 1;
    b.ms += times[q.id] ?? 0;
    if (answers[q.id] === q.answer) b.correct += 1;
    chap.set(key, b);
  }
  const byChapter: ChapterScore[] = [...chap.entries()]
    .map(([label, b]) => ({
      label,
      correct: b.correct,
      total: b.total,
      pct: b.total ? Math.round((b.correct / b.total) * 100) : 0,
      avgSec: b.total ? Math.round(b.ms / 1000 / b.total) : 0,
    }))
    .sort((a, b) => a.pct - b.pct);

  const timeSinks: TimeSink[] = mock.questions
    .map((q, i) => ({
      n: i + 1,
      label: q.chapterLabel || q.subject,
      sec: Math.round((times[q.id] ?? 0) / 1000),
      correct: answers[q.id] === q.answer,
      answered: answers[q.id] !== undefined,
    }))
    .sort((a, b) => b.sec - a.sec)
    .slice(0, 5);

  return {
    perQuestionBudgetSec,
    overBudgetCount,
    overBudgetSec: Math.round(overBudgetSec),
    changeWrongToRight: wr,
    changeRightToWrong: rw,
    changeWrongToWrong: ww,
    notExcept,
    byChapter,
    timeSinks,
  };
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
