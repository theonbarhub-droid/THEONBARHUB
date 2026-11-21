"use client";

import { useMemo } from "react";
import {
  type Mock,
  type AnswerChange,
  analyze,
  formatClock,
  scoreMock,
} from "@/lib/exam";

function verdict(pct: number): { label: string; tone: string } {
  if (pct >= 75) return { label: "On track", tone: "text-brand" };
  if (pct >= 60) return { label: "Close", tone: "text-accent" };
  return { label: "Needs work", tone: "text-accent" };
}

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
  const avgSec = mock.questions.length ? Math.round(totalTimeSec / mock.questions.length) : 0;
  const v = verdict(score.pct);

  return (
    <div>
      {/* Score */}
      <div className="rounded-2xl border border-line bg-card p-7 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-serif italic text-accent">{mock.title}</p>
            <p className="font-serif text-6xl sm:text-7xl font-semibold leading-none mt-2 tabular-nums">{score.pct}%</p>
            <p className={`mt-2 font-serif text-xl ${v.tone}`}>{v.label}</p>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-right">
            <div>
              <dt className="text-sm text-muted">Correct</dt>
              <dd className="font-serif text-2xl font-semibold tabular-nums">
                {score.correct}/{score.total}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Time</dt>
              <dd className="font-serif text-2xl font-semibold tabular-nums">{formatClock(totalTimeSec)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Per question</dt>
              <dd className="font-serif text-2xl font-semibold tabular-nums">{avgSec}s</dd>
            </div>
          </dl>
        </div>
        <div className="mt-6 h-px bg-line" />
        <p className="mt-4 text-sm text-muted">
          A score around 75% on timed practice is a safe target. The Law Society does not publish a fixed pass mark.
        </p>
      </div>

      {/* Diagnostics */}
      <h2 className="text-xl font-semibold mt-10 mb-4">What the attempt tells you</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-card p-5">
          <p className="font-serif text-lg">Pace</p>
          <p className="font-serif text-4xl font-semibold mt-2 tabular-nums">{deep.overBudgetCount}</p>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            questions past the {deep.perQuestionBudgetSec}s budget
            {deep.overBudgetSec > 0 && <>, costing {formatClock(deep.overBudgetSec)}</>}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-card p-5">
          <p className="font-serif text-lg">Answer changes</p>
          <p className="font-serif text-4xl font-semibold mt-2 tabular-nums">
            {deep.changeWrongToRight + deep.changeRightToWrong + deep.changeWrongToWrong}
          </p>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            {deep.changeWrongToRight} turned right, {deep.changeRightToWrong} turned wrong
          </p>
        </div>
        {deep.notExcept ? (
          <div className="rounded-xl border border-line bg-card p-5">
            <p className="font-serif text-lg">Reverse-logic questions</p>
            <p className="font-serif text-4xl font-semibold mt-2 tabular-nums">
              {deep.notExcept.correct}/{deep.notExcept.total}
            </p>
            <p className="text-sm text-muted mt-1 leading-relaxed">on the NOT and EXCEPT questions</p>
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-card p-5">
            <p className="font-serif text-lg">Pace per question</p>
            <p className="font-serif text-4xl font-semibold mt-2 tabular-nums">{avgSec}s</p>
            <p className="text-sm text-muted mt-1 leading-relaxed">against a {deep.perQuestionBudgetSec}s budget</p>
          </div>
        )}
      </div>

      {/* By subject */}
      {score.bySubject.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">By subject</h2>
          <div className="grid gap-3">
            {score.bySubject.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{s.subject}</span>
                  <span className="text-muted tabular-nums">
                    {s.correct} of {s.total}, {s.pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-wash overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.pct >= 60 ? "bg-brand" : "bg-accent"}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* By chapter */}
      {deep.byChapter.length > 1 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-1">By chapter, weakest first</h2>
          <p className="text-sm text-muted mb-4">
            Where to reread first. A low score and a high time together is the clearest signal.
          </p>
          <div className="divide-y divide-line border-y border-line">
            {deep.byChapter.map((c) => (
              <div key={c.label} className="flex items-center justify-between py-3 text-sm gap-3">
                <span className="truncate">{c.label}</span>
                <span className="flex items-center gap-5 shrink-0 tabular-nums">
                  <span className="text-muted">{c.avgSec}s avg</span>
                  <span className={`font-semibold w-20 text-right ${c.pct >= 60 ? "text-ink" : "text-accent"}`}>
                    {c.correct}/{c.total}, {c.pct}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Time sinks */}
      {deep.timeSinks.some((s) => s.sec > 0) && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Biggest time sinks</h2>
          <div className="divide-y divide-line border-y border-line">
            {deep.timeSinks
              .filter((s) => s.sec > 0)
              .map((s) => (
                <div key={s.n} className="flex justify-between items-center py-3 text-sm gap-3">
                  <span className="truncate">
                    <span className="font-serif font-semibold">Q{s.n}</span>{" "}
                    <span className="text-muted">{s.label}</span>
                  </span>
                  <span className="flex items-center gap-4 shrink-0">
                    <span
                      className={`text-xs font-semibold ${s.correct ? "text-brand" : s.answered ? "text-accent" : "text-muted"}`}
                    >
                      {s.correct ? "right" : s.answered ? "wrong" : "blank"}
                    </span>
                    <span className="font-semibold tabular-nums">{formatClock(s.sec)}</span>
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Per-question review */}
      {showQuestions && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Review every question</h2>
          <div className="grid gap-5">
            {mock.questions.map((q, i) => {
              const chosen = answers[q.id];
              const correct = chosen === q.answer;
              const unanswered = chosen === undefined;
              return (
                <article key={q.id} className="rounded-2xl border border-line bg-card p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-serif italic text-accent text-sm">{q.subject}</span>
                    <span
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                        unanswered
                          ? "bg-wash text-muted"
                          : correct
                            ? "bg-brand/10 text-brand"
                            : "bg-accent/15 text-accent"
                      }`}
                    >
                      {unanswered ? "Skipped" : correct ? "Correct" : "Incorrect"}
                      {flags[q.id] ? ", flagged" : ""}
                    </span>
                  </div>
                  <p className="mt-2.5 font-medium text-[1.05rem] leading-relaxed">
                    <span className="font-serif font-semibold">{i + 1}.</span> {q.stem}
                  </p>
                  <div className="mt-4 grid gap-2 text-sm">
                    {q.options.map((opt, oi) => {
                      const isAnswer = oi === q.answer;
                      const isChosen = oi === chosen;
                      let cls = "border-line";
                      if (isAnswer) cls = "border-brand bg-brand/5";
                      else if (isChosen) cls = "border-accent bg-accent/10";
                      return (
                        <div key={oi} className={`rounded-lg border px-3.5 py-2.5 flex gap-2.5 ${cls}`}>
                          <span className="font-serif font-semibold shrink-0">{String.fromCharCode(65 + oi)}.</span>
                          <span>{opt}</span>
                          {isAnswer && <span className="ml-auto text-xs font-semibold text-brand shrink-0">Correct</span>}
                          {isChosen && !isAnswer && (
                            <span className="ml-auto text-xs font-semibold text-accent shrink-0">Your answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {q.hook && <p className="mt-4 font-serif italic text-brand">{q.hook}</p>}
                  {q.explanation && <p className="mt-2 text-sm text-muted leading-relaxed">{q.explanation}</p>}
                  {q.reference && <p className="mt-2 text-xs text-muted">{q.reference}</p>}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
