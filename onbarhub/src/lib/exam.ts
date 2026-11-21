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
  /** Where to read more, e.g. "Real Estate materials, ch. 4". Optional. */
  reference?: string;
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

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
