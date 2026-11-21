import type { Metadata } from "next";
import FlashcardDeck from "@/components/tools/FlashcardDeck";
import { mocks } from "@/data/mocks";

export const metadata: Metadata = {
  title: "LSO Solicitor Flashcards: Rapid Rule Review",
  description:
    "Free flashcards for the LSO Solicitor exam. Flip through scenario questions and their rules, memory hooks and LSO references, subject by subject.",
  alternates: { canonical: "/tools/flashcards" },
};

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif italic text-accent">Free tool</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">Flashcards</h1>
      <p className="mt-4 text-muted leading-relaxed max-w-2xl">
        Untimed, active recall. Read the scenario, decide your answer, then flip to see the rule, the memory hook and
        where it sits in the LSO material. Pick a subject or run them all.
      </p>
      <div className="mt-8">
        <FlashcardDeck mocks={mocks} />
      </div>
    </div>
  );
}
