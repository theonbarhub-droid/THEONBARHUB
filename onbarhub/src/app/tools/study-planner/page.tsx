import type { Metadata } from "next";
import StudyPlanner from "@/components/tools/StudyPlanner";

export const metadata: Metadata = {
  title: "LSO Bar Exam Study Planner: How Many Hours and When",
  description:
    "A free study planner for the LSO Solicitor and Barrister exams. Enter your exam date and the hours you have, and get a realistic plan across subjects, practice and indexing.",
  alternates: { canonical: "/tools/study-planner" },
};

export default function StudyPlannerPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif italic text-accent">Free tool</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">Study planner</h1>
      <p className="mt-4 text-muted leading-relaxed max-w-2xl">
        Tell it your exam date and the hours you realistically have each week. It turns that into a plan: how much time
        to spend learning, practising and building your index, weighted toward the subjects you find hardest.
      </p>
      <div className="mt-8">
        <StudyPlanner />
      </div>
    </div>
  );
}
