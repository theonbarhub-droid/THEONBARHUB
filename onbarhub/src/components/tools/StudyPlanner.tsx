"use client";

import { useEffect, useMemo, useState } from "react";

const SUBJECTS = [
  "Real Estate",
  "Business Law",
  "Estate Planning",
  "Estate Administration",
  "Professional Responsibility",
  "Taxation",
];

// Candidates commonly report 90 to 150 hours of focused preparation per exam.
const GUIDE_LOW = 90;
const GUIDE_HIGH = 150;

export default function StudyPlanner() {
  const [examDate, setExamDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [weak, setWeak] = useState<Record<string, boolean>>({});
  const [today, setToday] = useState(0);
  useEffect(() => setToday(Date.now()), []);

  function toggle(s: string) {
    setWeak((w) => ({ ...w, [s]: !w[s] }));
  }

  const plan = useMemo(() => {
    if (!examDate || !today) return null;
    const exam = new Date(examDate + "T00:00:00").getTime();
    const weeks = Math.max(0, Math.ceil((exam - today) / (7 * 24 * 3600 * 1000)));
    const total = weeks * hoursPerWeek;

    const practice = Math.round(total * 0.3);
    const indexing = Math.round(total * 0.15);
    const learning = total - practice - indexing;

    const weights = SUBJECTS.map((s) => (weak[s] ? 2 : 1));
    const sum = weights.reduce((a, b) => a + b, 0);
    const perSubject = SUBJECTS.map((s, i) => ({
      subject: s,
      weak: Boolean(weak[s]),
      hours: sum ? Math.round((learning * weights[i]) / sum) : 0,
    }));

    let verdict: { tone: string; text: string };
    if (weeks === 0) verdict = { tone: "text-accent", text: "Your exam date is today or past. Set a future date." };
    else if (total >= GUIDE_HIGH) verdict = { tone: "text-brand", text: "You have room to prepare thoroughly. Protect the time." };
    else if (total >= GUIDE_LOW) verdict = { tone: "text-brand", text: "You are in a workable range. Stay consistent and prioritise your weak subjects." };
    else verdict = { tone: "text-accent", text: "This is tight against what candidates usually need. Add hours per week if you can, or focus hard on your weakest subjects and heavy practice." };

    return { weeks, total, practice, indexing, learning, perSubject, verdict };
  }, [examDate, hoursPerWeek, weak, today]);

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-semibold">Exam date</span>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="rounded-md border border-line bg-card px-3 py-2.5 text-base"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="font-semibold">Hours you can study each week</span>
          <input
            type="number"
            min={1}
            max={80}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Math.max(1, Math.min(80, Number(e.target.value) || 0)))}
            className="rounded-md border border-line bg-card px-3 py-2.5 text-base"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="font-semibold mb-2">Which subjects feel weakest? (they get more time)</legend>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`rounded-full border px-3.5 py-1.5 text-sm ${
                weak[s] ? "border-brand bg-brand/10 text-brand font-semibold" : "border-line text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      {plan && (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6">
          <p className="font-serif text-lg">
            {plan.weeks} weeks left, {plan.total} hours of study
          </p>
          <p className={`mt-1 ${plan.verdict.tone}`}>{plan.verdict.text}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line p-4">
              <p className="text-sm text-muted">Learning the material</p>
              <p className="font-serif text-2xl font-semibold tabular-nums">{plan.learning}h</p>
            </div>
            <div className="rounded-xl border border-line p-4">
              <p className="text-sm text-muted">Practice exams</p>
              <p className="font-serif text-2xl font-semibold tabular-nums">{plan.practice}h</p>
            </div>
            <div className="rounded-xl border border-line p-4">
              <p className="text-sm text-muted">Building your index</p>
              <p className="font-serif text-2xl font-semibold tabular-nums">{plan.indexing}h</p>
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Suggested split across subjects</h3>
          <div className="divide-y divide-line border-y border-line">
            {plan.perSubject.map((p) => (
              <div key={p.subject} className="flex justify-between py-2.5 text-sm">
                <span>
                  {p.subject}
                  {p.weak && <span className="text-accent"> (focus)</span>}
                </span>
                <span className="font-semibold tabular-nums">{p.hours}h</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            A guide, not a rule. The split reserves about a third of your time for timed practice and a share for
            building the index that wins an open-book exam. The 90 to 150 hour range is what candidates commonly report,
            not an official figure.
          </p>
        </div>
      )}
    </div>
  );
}
