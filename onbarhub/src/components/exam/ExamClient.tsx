"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  type Mock,
  type ScoreResult,
  type AnswerChange,
  analyze,
  formatClock,
  scoreMock,
} from "@/lib/exam";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";

type Phase = "setup" | "running" | "review";

interface StoredAttempt {
  mockId: string;
  mockTitle: string;
  date: string; // ISO
  pct: number;
  correct: number;
  total: number;
  totalTimeSec: number;
  timed: boolean;
}

const STORE_KEY = "onbar_exam_attempts_v1";

function loadAttempts(): StoredAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as StoredAttempt[]) : [];
  } catch {
    return [];
  }
}

function saveAttempt(a: StoredAttempt) {
  if (typeof window === "undefined") return;
  try {
    const all = [a, ...loadAttempts()].slice(0, 50);
    window.localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export default function ExamClient({ mocks }: { mocks: Mock[] }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [mockId, setMockId] = useState<string>(mocks[0]?.id ?? "");
  const [timed, setTimed] = useState(true);
  const [studyMode, setStudyMode] = useState(false);

  const mock = useMemo(() => mocks.find((m) => m.id === mockId), [mocks, mockId]);

  // run state
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [times, setTimes] = useState<Record<string, number>>({}); // ms per question
  const [changes, setChanges] = useState<AnswerChange[]>([]);
  const [remaining, setRemaining] = useState(0); // seconds
  const [elapsed, setElapsed] = useState(0); // seconds, counts up
  const enterRef = useRef<number>(0);

  const [attempts, setAttempts] = useState<StoredAttempt[]>([]);
  useEffect(() => setAttempts(loadAttempts()), [phase]);

  const questions = mock?.questions ?? [];
  const q = questions[current];

  // record time spent on the question being left
  const recordTime = useCallback(() => {
    if (!q) return;
    const spent = Date.now() - enterRef.current;
    enterRef.current = Date.now();
    setTimes((t) => ({ ...t, [q.id]: (t[q.id] ?? 0) + spent }));
  }, [q]);

  const finish = useCallback(() => {
    recordTime();
    setPhase("review");
  }, [recordTime]);

  // timer tick
  useEffect(() => {
    if (phase !== "running") return;
    const iv = setInterval(() => {
      setElapsed((e) => e + 1);
      if (timed) {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(iv);
            finish();
            return 0;
          }
          return r - 1;
        });
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, timed, finish]);

  function start() {
    if (!mock) return;
    setCurrent(0);
    setAnswers({});
    setFlags({});
    setTimes({});
    setChanges([]);
    setElapsed(0);
    setRemaining(mock.timeLimitMinutes * 60);
    enterRef.current = Date.now();
    setPhase("running");
  }

  function goTo(i: number) {
    if (i < 0 || i >= questions.length) return;
    recordTime();
    setCurrent(i);
  }

  function choose(optIndex: number) {
    if (!q) return;
    const prev = answers[q.id];
    if (prev !== undefined && prev !== optIndex) {
      setChanges((cs) => [...cs, { id: q.id, from: prev, to: optIndex }]);
    }
    setAnswers((a) => ({ ...a, [q.id]: optIndex }));
  }

  function toggleFlag() {
    if (!q) return;
    setFlags((f) => ({ ...f, [q.id]: !f[q.id] }));
  }

  // ---- SETUP ----
  if (phase === "setup") {
    return (
      <div>
        <label className="block text-sm font-semibold mb-2">Choose a mock</label>
        <div className="grid gap-3">
          {mocks.map((m) => {
            const selected = m.id === mockId;
            return (
              <button
                key={m.id}
                onClick={() => setMockId(m.id)}
                className={`text-left rounded-xl border p-4 transition ${
                  selected ? "border-brand bg-wash ring-1 ring-brand" : "border-line hover:border-brand/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{m.title}</span>
                  {m.isSample && (
                    <span className="text-xs font-semibold text-accent border border-accent/40 rounded px-1.5 py-0.5">
                      Free sample
                    </span>
                  )}
                </div>
                {m.description && <p className="text-sm text-muted mt-1">{m.description}</p>}
                <p className="text-xs text-muted mt-2">
                  {m.questions.length} questions · {m.timeLimitMinutes} min · {m.exam}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-lg border border-line p-3">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="mt-1" />
            <span>
              <span className="font-semibold block">Timed</span>
              <span className="text-sm text-muted">Run against the clock, like exam day. Auto-submits at zero.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-line p-3">
            <input
              type="checkbox"
              checked={studyMode}
              onChange={(e) => setStudyMode(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="font-semibold block">Study mode</span>
              <span className="text-sm text-muted">Reveal the answer and explanation right after you choose.</span>
            </span>
          </label>
        </div>

        <button
          onClick={start}
          disabled={!mock}
          className="mt-6 rounded-md bg-brand text-white font-semibold px-6 py-3 disabled:opacity-60"
        >
          Start mock
        </button>

        {attempts.length > 0 && (
          <section className="mt-10">
            <h2 className="font-bold text-lg">Your recent attempts</h2>
            <p className="text-sm text-muted mb-3">Saved in this browser only.</p>
            <div className="grid gap-2">
              {attempts.slice(0, 6).map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-line px-4 py-2.5 text-sm">
                  <span className="truncate">{a.mockTitle}</span>
                  <span className="flex items-center gap-4 shrink-0">
                    <span className="text-muted">{new Date(a.date).toLocaleDateString()}</span>
                    <span className="text-muted">{formatClock(a.totalTimeSec)}</span>
                    <span className="font-bold tabular-nums">{a.pct}%</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ---- RUNNING ----
  if (phase === "running" && mock && q) {
    const chosen = answers[q.id];
    const answeredCount = Object.keys(answers).length;
    const revealed = studyMode && chosen !== undefined;

    return (
      <div>
        {/* status bar */}
        <div className="sticky top-0 z-10 -mx-5 px-5 py-3 bg-paper/95 backdrop-blur border-b border-line flex items-center justify-between gap-3">
          <span className="text-sm text-muted">
            Question <strong className="text-ink">{current + 1}</strong> of {questions.length} ·{" "}
            <span className="text-ink">{answeredCount}</span> answered
          </span>
          <span className={`font-bold tabular-nums ${timed && remaining < 60 ? "text-red-700" : "text-ink"}`}>
            {timed ? formatClock(remaining) : formatClock(elapsed)}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-brand uppercase tracking-wide">{q.subject}</span>
          <button
            onClick={toggleFlag}
            className={`text-sm rounded px-2.5 py-1 border ${
              flags[q.id] ? "border-accent text-accent bg-accent/10" : "border-line text-muted"
            }`}
          >
            {flags[q.id] ? "Flagged" : "Flag for review"}
          </button>
        </div>

        <p className="mt-3 text-lg leading-relaxed">{q.stem}</p>

        <div className="mt-5 grid gap-2.5">
          {q.options.map((opt, i) => {
            const isChosen = chosen === i;
            const isCorrect = i === q.answer;
            let cls = "border-line hover:border-brand/50";
            if (revealed) {
              if (isCorrect) cls = "border-green-600 bg-green-50";
              else if (isChosen) cls = "border-red-600 bg-red-50";
            } else if (isChosen) {
              cls = "border-brand bg-wash ring-1 ring-brand";
            }
            return (
              <button
                key={i}
                onClick={() => !revealed && choose(i)}
                disabled={revealed}
                className={`text-left rounded-lg border p-3.5 flex gap-3 transition ${cls}`}
              >
                <span className="font-bold shrink-0">{String.fromCharCode(65 + i)}.</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-4 rounded-lg bg-wash border border-line p-4 text-sm">
            <p className="font-semibold">{chosen === q.answer ? "Correct." : "Not quite."}</p>
            {q.hook && <p className="mt-1 italic text-brand">{q.hook}</p>}
            {q.explanation && <p className="mt-1 text-muted">{q.explanation}</p>}
            {q.reference && <p className="mt-2 text-xs text-muted">{q.reference}</p>}
          </div>
        )}

        {/* nav */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="rounded-md border border-line px-4 py-2 font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          {current < questions.length - 1 ? (
            <button onClick={() => goTo(current + 1)} className="rounded-md bg-brand text-white font-semibold px-5 py-2">
              Next
            </button>
          ) : (
            <button onClick={finish} className="rounded-md bg-accent text-white font-semibold px-5 py-2">
              Finish & see results
            </button>
          )}
        </div>

        {/* palette */}
        <div className="mt-8">
          <p className="text-sm font-semibold mb-2">Jump to question</p>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((qq, i) => {
              const done = answers[qq.id] !== undefined;
              const flagged = flags[qq.id];
              const here = i === current;
              let cls = "border-line text-muted";
              if (done) cls = "border-brand bg-brand text-white";
              if (flagged) cls = "border-accent bg-accent text-white";
              if (here) cls += " ring-2 ring-offset-1 ring-ink";
              return (
                <button
                  key={qq.id}
                  onClick={() => goTo(i)}
                  className={`w-9 h-9 rounded border text-sm font-semibold ${cls}`}
                  aria-label={`Question ${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <button onClick={finish} className="mt-5 text-sm font-semibold text-brand underline">
            Finish now
          </button>
        </div>
      </div>
    );
  }

  // ---- REVIEW ----
  if (phase === "review" && mock) {
    return <Review mock={mock} answers={answers} flags={flags} times={times} changes={changes} elapsed={elapsed} timed={timed} onRestart={() => setPhase("setup")} onRetake={start} />;
  }

  return null;
}

function Review({
  mock,
  answers,
  flags,
  times,
  changes,
  elapsed,
  timed,
  onRestart,
  onRetake,
}: {
  mock: Mock;
  answers: Record<string, number>;
  flags: Record<string, boolean>;
  times: Record<string, number>;
  changes: AnswerChange[];
  elapsed: number;
  timed: boolean;
  onRestart: () => void;
  onRetake: () => void;
}) {
  const { user } = useAuth();
  const score: ScoreResult = useMemo(() => scoreMock(mock, answers), [mock, answers]);
  const deep = useMemo(() => analyze(mock, answers, times, changes), [mock, answers, times, changes]);
  const totalMs = Object.values(times).reduce((a, b) => a + b, 0);
  const totalTimeSec = Math.round(totalMs / 1000) || elapsed;
  const avgSec = mock.questions.length ? totalTimeSec / mock.questions.length : 0;

  // save once on mount: always to this browser, and to the account if signed in
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    saveAttempt({
      mockId: mock.id,
      mockTitle: mock.title,
      date: new Date().toISOString(),
      pct: score.pct,
      correct: score.correct,
      total: score.total,
      totalTimeSec,
      timed,
    });
    const sb = getSupabase();
    if (sb && user) {
      sb.from("attempts")
        .insert({
          user_id: user.id,
          mock_id: mock.id,
          mock_title: mock.title,
          pct: score.pct,
          correct: score.correct,
          total: score.total,
          total_time_sec: totalTimeSec,
          timed,
          detail: { answers, times, flags, changes },
        })
        .then(() => {});
    }
  }, [mock, score, totalTimeSec, timed, user, answers, times, flags, changes]);

  return (
    <div>
      <div className="rounded-2xl border border-line bg-wash p-6 text-center">
        <p className="text-sm text-muted">{mock.title}</p>
        <p className="text-5xl font-bold mt-1 tabular-nums">{score.pct}%</p>
        <p className="text-muted mt-1">
          {score.correct} of {score.total} correct · {formatClock(totalTimeSec)} total · {Math.round(avgSec)}s per question
        </p>
      </div>

      <section className="mt-8">
        <h2 className="font-bold text-lg mb-3">By subject</h2>
        <div className="grid gap-2.5">
          {score.bySubject.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between text-sm mb-1">
                <span>{s.subject}</span>
                <span className="text-muted tabular-nums">
                  {s.correct}/{s.total} · {s.pct}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-line overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.pct >= 60 ? "bg-brand" : "bg-accent"}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-bold text-lg mb-3">Exam diagnostics</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line p-4">
            <p className="text-xs text-muted uppercase tracking-wide">Pace</p>
            <p className="text-2xl font-bold mt-1 tabular-nums">{deep.overBudgetCount}</p>
            <p className="text-sm text-muted mt-1">
              questions over the {deep.perQuestionBudgetSec}s budget
              {deep.overBudgetSec > 0 && <>, costing {formatClock(deep.overBudgetSec)}</>}
            </p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="text-xs text-muted uppercase tracking-wide">Answer changes</p>
            <p className="text-2xl font-bold mt-1 tabular-nums">
              {deep.changeWrongToRight + deep.changeRightToWrong + deep.changeWrongToWrong}
            </p>
            <p className="text-sm text-muted mt-1">
              {deep.changeWrongToRight} wrong to right, {deep.changeRightToWrong} right to wrong
            </p>
          </div>
          {deep.notExcept ? (
            <div className="rounded-xl border border-line p-4">
              <p className="text-xs text-muted uppercase tracking-wide">NOT / EXCEPT</p>
              <p className="text-2xl font-bold mt-1 tabular-nums">
                {deep.notExcept.correct}/{deep.notExcept.total}
              </p>
              <p className="text-sm text-muted mt-1">on reverse-logic questions</p>
            </div>
          ) : (
            <div className="rounded-xl border border-line p-4">
              <p className="text-xs text-muted uppercase tracking-wide">Avg / question</p>
              <p className="text-2xl font-bold mt-1 tabular-nums">{Math.round(avgSec)}s</p>
              <p className="text-sm text-muted mt-1">budget was {deep.perQuestionBudgetSec}s</p>
            </div>
          )}
        </div>
      </section>

      {deep.byChapter.length > 1 && (
        <section className="mt-8">
          <h2 className="font-bold text-lg mb-1">By chapter, weakest first</h2>
          <p className="text-sm text-muted mb-3">Where to reread first. Low score and high time together is the clearest signal.</p>
          <div className="grid gap-2">
            {deep.byChapter.map((c) => (
              <div key={c.label} className="flex items-center justify-between rounded-lg border border-line px-4 py-2 text-sm gap-3">
                <span className="truncate">{c.label}</span>
                <span className="flex items-center gap-4 shrink-0 tabular-nums">
                  <span className="text-muted">{c.avgSec}s avg</span>
                  <span className={`font-bold ${c.pct >= 60 ? "text-ink" : "text-accent"}`}>
                    {c.correct}/{c.total} · {c.pct}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {deep.timeSinks.some((s) => s.sec > 0) && (
        <section className="mt-8">
          <h2 className="font-bold text-lg mb-2">Biggest time sinks</h2>
          <div className="grid gap-2">
            {deep.timeSinks.filter((s) => s.sec > 0).map((s) => (
              <div key={s.n} className="flex justify-between items-center rounded-lg border border-line px-4 py-2 text-sm gap-3">
                <span className="truncate">
                  Q{s.n} · <span className="text-muted">{s.label}</span>
                </span>
                <span className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-semibold ${s.correct ? "text-green-700" : s.answered ? "text-red-700" : "text-muted"}`}>
                    {s.correct ? "right" : s.answered ? "wrong" : "blank"}
                  </span>
                  <span className="font-semibold tabular-nums">{formatClock(s.sec)}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-bold text-lg mb-3">Review every question</h2>
        <div className="grid gap-4">
          {mock.questions.map((q, i) => {
            const chosen = answers[q.id];
            const correct = chosen === q.answer;
            const unanswered = chosen === undefined;
            return (
              <div key={q.id} className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-brand uppercase tracking-wide">{q.subject}</span>
                  <span
                    className={`text-xs font-semibold rounded px-2 py-0.5 ${
                      unanswered
                        ? "bg-line text-muted"
                        : correct
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {unanswered ? "Skipped" : correct ? "Correct" : "Incorrect"}
                    {flags[q.id] ? " · flagged" : ""}
                  </span>
                </div>
                <p className="mt-2 font-medium">
                  {i + 1}. {q.stem}
                </p>
                <div className="mt-3 grid gap-1.5 text-sm">
                  {q.options.map((opt, oi) => {
                    const isAnswer = oi === q.answer;
                    const isChosen = oi === chosen;
                    let cls = "border-line";
                    if (isAnswer) cls = "border-green-600 bg-green-50";
                    else if (isChosen) cls = "border-red-600 bg-red-50";
                    return (
                      <div key={oi} className={`rounded-md border px-3 py-2 flex gap-2 ${cls}`}>
                        <span className="font-bold shrink-0">{String.fromCharCode(65 + oi)}.</span>
                        <span>{opt}</span>
                        {isAnswer && <span className="ml-auto text-xs font-semibold text-green-700">Correct</span>}
                        {isChosen && !isAnswer && <span className="ml-auto text-xs font-semibold text-red-700">Your answer</span>}
                      </div>
                    );
                  })}
                </div>
                {q.hook && <p className="mt-3 text-sm italic text-brand">{q.hook}</p>}
                {q.explanation && <p className="mt-1 text-sm text-muted">{q.explanation}</p>}
                {q.reference && <p className="mt-1 text-xs text-muted">{q.reference}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={onRetake} className="rounded-md bg-brand text-white font-semibold px-5 py-2.5">
          Retake this mock
        </button>
        <button onClick={onRestart} className="rounded-md border border-line font-semibold px-5 py-2.5">
          Choose another
        </button>
        <Link href="/tools/results-tracker" className="rounded-md border border-line font-semibold px-5 py-2.5 no-underline">
          Results & dates
        </Link>
      </div>
    </div>
  );
}
