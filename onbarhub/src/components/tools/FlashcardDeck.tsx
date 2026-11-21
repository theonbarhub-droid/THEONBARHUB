"use client";

import { useMemo, useState } from "react";
import type { Mock } from "@/lib/exam";

export default function FlashcardDeck({ mocks }: { mocks: Mock[] }) {
  const subjects = useMemo(() => Array.from(new Set(mocks.map((m) => m.title))), [mocks]);
  const [subject, setSubject] = useState<string>("all");
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => {
    const picked = subject === "all" ? mocks : mocks.filter((m) => m.title === subject);
    return picked.flatMap((m) => m.questions);
  }, [mocks, subject]);

  const card = cards[i];

  function go(n: number) {
    setFlipped(false);
    setI((cur) => {
      const next = cur + n;
      if (next < 0) return cards.length - 1;
      if (next >= cards.length) return 0;
      return next;
    });
  }

  function pickSubject(s: string) {
    setSubject(s);
    setI(0);
    setFlipped(false);
  }

  if (!card) return <p className="text-muted">No cards yet.</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => pickSubject("all")}
          className={`rounded-full border px-3.5 py-1.5 text-sm ${
            subject === "all" ? "border-brand bg-brand/10 text-brand font-semibold" : "border-line text-muted"
          }`}
        >
          All subjects
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => pickSubject(s)}
            className={`rounded-full border px-3.5 py-1.5 text-sm ${
              subject === s ? "border-brand bg-brand/10 text-brand font-semibold" : "border-line text-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted mt-5">
        Card {i + 1} of {cards.length}
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-2 w-full text-left rounded-2xl border border-line bg-card p-7 sm:p-9 min-h-[16rem] transition hover:border-brand"
      >
        <span className="font-serif italic text-accent text-sm">
          {card.chapterLabel || card.subject}
        </span>
        {!flipped ? (
          <>
            <p className="mt-3 text-lg leading-relaxed">{card.stem}</p>
            <p className="mt-6 text-sm text-muted">Tap to reveal the answer.</p>
          </>
        ) : (
          <>
            <p className="mt-3 font-serif text-xl font-semibold text-brand">
              {String.fromCharCode(65 + card.answer)}. {card.options[card.answer]}
            </p>
            {card.hook && <p className="mt-3 font-serif italic text-brand">{card.hook}</p>}
            {card.explanation && <p className="mt-2 text-sm text-muted leading-relaxed">{card.explanation}</p>}
            {card.reference && <p className="mt-2 text-xs text-muted">{card.reference}</p>}
          </>
        )}
      </button>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button onClick={() => go(-1)} className="rounded-md border border-line font-semibold px-5 py-2.5">
          Previous
        </button>
        <button onClick={() => setFlipped((f) => !f)} className="rounded-md border border-line font-semibold px-5 py-2.5">
          {flipped ? "Hide answer" : "Show answer"}
        </button>
        <button onClick={() => go(1)} className="rounded-md bg-brand text-white font-semibold px-5 py-2.5">
          Next
        </button>
      </div>
    </div>
  );
}
