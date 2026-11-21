"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

type Area = "knowledge" | "navigation" | "timing" | "technique";

const QUESTIONS: { text: string; area: Area }[] = [
  { text: "There are whole topics I do not really understand.", area: "knowledge" },
  { text: "Even with the material in front of me, I am not sure what the right answer is.", area: "knowledge" },
  { text: "I understand the concepts, but I cannot find where the answer is in my materials fast enough.", area: "navigation" },
  { text: "My index or table of contents is slow and awkward to use under pressure.", area: "navigation" },
  { text: "I run out of time before I finish the paper.", area: "timing" },
  { text: "I spend far too long on single questions.", area: "timing" },
  { text: "I misread questions, or I change right answers to wrong ones.", area: "technique" },
  { text: "I know the material but I panic or blank on exam day.", area: "technique" },
];

const RESULTS: Record<Area, { title: string; body: string; steps: string[]; cta: { href: string; label: string } }> = {
  knowledge: {
    title: "Your main gap is the material itself",
    body: "Before anything else, you need the concepts to be solid. Speed and technique cannot rescue an answer you do not know.",
    steps: [
      "Work through one subject at a time rather than jumping around.",
      "Use study mode in practice, so you see the reasoning right after each question.",
      "Read the plain-English guides for the topics you keep missing.",
    ],
    cta: { href: "/tools/practice-exam", label: "Practise by subject" },
  },
  navigation: {
    title: "You know more than your score shows",
    body: "This is an open-book exam. Your problem is not knowledge, it is finding the right page fast enough. That is a trainable skill, and most candidates never train it.",
    steps: [
      "Build a tight index in your own words, not a copy of someone else's.",
      "Drill finding the page for a topic until it is instant.",
      "Always practise with your materials open, the way the real exam works.",
    ],
    cta: { href: "/tools/study-planner", label: "Plan your index time" },
  },
  timing: {
    title: "Pace is what is costing you",
    body: "You may well know enough to pass. You are losing marks to the clock, not to the law.",
    steps: [
      "Always practise timed, and watch the per-question budget.",
      "When a question is taking too long, flag it and move on, then return.",
      "Review where your time went after each mock and cut your worst time sinks.",
    ],
    cta: { href: "/tools/practice-exam", label: "Take a timed mock" },
  },
  technique: {
    title: "You are losing marks you should keep",
    body: "The knowledge is there. You are giving away marks on reading, reverse-logic questions, and second-guessing.",
    steps: [
      "Slow down on NOT and EXCEPT questions, they flip the logic.",
      "Trust your first read unless you have a concrete reason to change it.",
      "After each mock, study why your wrong answers were wrong so the pattern sticks.",
    ],
    cta: { href: "/tools/practice-exam", label: "Practise and review" },
  },
};

export default function ReadinessDiagnostic() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Area | null>(null);

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  function submit() {
    const scores: Record<Area, number> = { knowledge: 0, navigation: 0, timing: 0, technique: 0 };
    QUESTIONS.forEach((q, i) => {
      scores[q.area] += answers[i] ?? 0;
    });
    const top = (Object.entries(scores) as [Area, number][]).sort((a, b) => b[1] - a[1])[0][0];
    setResult(top);
    track("diagnostic_result", { area: top });
  }

  if (result) {
    const r = RESULTS[result];
    return (
      <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <p className="font-serif italic text-accent">Your result</p>
        <h2 className="font-serif text-2xl font-semibold mt-1">{r.title}</h2>
        <p className="text-muted mt-3 leading-relaxed">{r.body}</p>
        <h3 className="font-semibold mt-5 mb-2">What to do next</h3>
        <ul className="grid gap-2">
          {r.steps.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-[0.98rem]">
              <span className="text-accent font-serif font-semibold shrink-0">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={r.cta.href} className="rounded-md bg-brand text-white font-semibold px-5 py-2.5 no-underline">
            {r.cta.label}
          </Link>
          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
            className="rounded-md border border-line font-semibold px-5 py-2.5"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-5">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-xl border border-line bg-card p-4">
            <p className="font-medium">{q.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Rarely", "Sometimes", "Often"].map((label, val) => (
                <button
                  key={val}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: val }))}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    answers[i] === val ? "border-brand bg-brand/10 text-brand font-semibold" : "border-line text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={submit}
        disabled={!allAnswered}
        className="mt-6 rounded-md bg-brand text-white font-semibold px-6 py-3 disabled:opacity-50"
      >
        {allAnswered ? "See my result" : "Answer every question"}
      </button>
    </div>
  );
}
