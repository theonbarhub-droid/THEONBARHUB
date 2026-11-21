import type { Metadata } from "next";
import ReadinessDiagnostic from "@/components/tools/ReadinessDiagnostic";

export const metadata: Metadata = {
  title: "LSO Bar Exam Readiness Check: Why Are You Struggling?",
  description:
    "A free diagnostic for the LSO Solicitor and Barrister exams. Answer eight questions and find out whether your real problem is knowledge, navigation, timing or technique, and what to do about it.",
  alternates: { canonical: "/tools/readiness" },
};

export default function ReadinessPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif italic text-accent">Free tool</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">Why are you struggling?</h1>
      <p className="mt-4 text-muted leading-relaxed max-w-2xl">
        Two candidates with the same score can be failing for completely different reasons. Answer these honestly and
        find out whether your real problem is the material, finding it fast enough, the clock, or exam technique. Each
        one has a different fix.
      </p>
      <div className="mt-8">
        <ReadinessDiagnostic />
      </div>
    </div>
  );
}
