"use client";

import { useMemo } from "react";
import {
  type Mock,
  type AnswerChange,
  analyze,
  formatClock,
  scoreMock,
} from "@/lib/exam";

/**
 * Renders the full results analysis for one attempt. Used both right after a
 * live attempt and when replaying a saved attempt from the account.
 */
export default function AttemptAnalysis({
  mock,
  answers,
  times,
  changes = [],
  flags = {},
  showQuestions = true,
}: {
  mock: Mock;
  answers: Record<string, number>;
  times: Record<string, number>;
  changes?: AnswerChange[];
  flags?: Record<string, boolean>;
  showQuestions?: boolean;
}) {
  const score = useMemo(() => scoreMock(mock, answers), [mock, answers]);
  const deep = useMemo(() => analyze(mock, answers, times, changes), [mock, answers, times, changes]);
  const totalTimeSec = Math.round(Object.values(times).reduce((a, b) => a + b, 0) / 1000);
  const avgSec = mock.questions.length ? totalTimeSec / mock.questions.length : 0;

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

      {showQuestions && (
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
                        unanswered ? "bg-line text-muted" : correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
      )}
    </div>
  );
}
