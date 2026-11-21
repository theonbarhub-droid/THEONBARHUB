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
    <div className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-sm font-semibold text-brand uppercase tracking-wide">Free tool</p>
      <h1 className="text-3xl sm:text-4xl font-bold mt-1">Solicitor practice exam</h1>
      <p className="mt-3 text-muted">
        Run a timed, exam-style mock. Flag questions, jump around with the palette, then get a score broken down by
        subject and a read on where your time went. Attempts save in your browser so you can watch your progress.
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
