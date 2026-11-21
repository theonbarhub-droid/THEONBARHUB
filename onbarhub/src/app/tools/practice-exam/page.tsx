import type { Metadata } from "next";
import ExamClient from "@/components/exam/ExamClient";
import { mocks } from "@/data/mocks";

export const metadata: Metadata = {
  title: "Ontario Solicitor Practice Exam: Free Timed Mock",
  description:
    "A free timed practice exam for the LSO Solicitor licensing exam. Real exam-style multiple choice, a question palette, per-question timing and a subject-by-subject score breakdown.",
  alternates: { canonical: "/tools/practice-exam" },
};

export default function PracticeExamPage() {
  const solicitorMocks = mocks.filter((m) => m.exam === "solicitor");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif italic text-accent">Free tool</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">Solicitor practice exam</h1>
      <p className="mt-4 text-muted leading-relaxed max-w-2xl">
        A timed, exam-style mock. Flag questions and move around with the palette, then get a score broken down by
        subject and chapter, a read on where your time went, and the answer changes that cost you. Sign in and every
        attempt is saved to reopen later.
      </p>

      <div className="mt-8">
        <ExamClient mocks={solicitorMocks} />
      </div>

      <p className="mt-12 text-xs text-muted border-t border-line pt-5">
        Practice questions are study aids written by The OnBar Hub to build exam skills. They are not past exam
        questions and are not affiliated with or endorsed by the Law Society of Ontario. Always confirm the law against
        current LSO materials.
      </p>
    </div>
  );
}
