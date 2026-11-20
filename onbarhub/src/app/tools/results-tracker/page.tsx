import type { Metadata } from "next";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import Waitlist from "@/components/Waitlist";
import { DATES_CHECKED, LSO_DATES_URL, getSitting, resultsEstimates, sittings } from "@/data/exam-dates";
import { formatDate, formatShort } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Ontario Bar Exam Results Date Tracker and 2027 Exam Deadlines",
  description:
    "When will LSO Barrister and Solicitor results come out? Our estimated release windows for the November 2026 sittings, plus every 2027 exam date and deadline.",
  alternates: { canonical: "/tools/results-tracker" },
};

export default function ResultsTracker() {
  const upcoming = sittings;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="text-sm font-semibold text-brand uppercase tracking-wide">Free tool</p>
      <h1 className="text-3xl sm:text-4xl font-bold mt-1">Results date tracker and exam deadlines</h1>
      <p className="mt-3 text-muted max-w-3xl">
        The Law Society of Ontario does not announce a results date in advance. These windows are our estimates, built
        from the release days candidates reported for past sittings. Exam dates and deadlines below come straight from
        the LSO.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {resultsEstimates.map((r) => {
          const s = getSitting(r.sittingId)!;
          return (
            <div key={r.sittingId} className="rounded-xl border border-line p-5">
              <p className="text-sm text-muted">
                {s.season} 2026 {s.exam} exam, written {formatShort(s.examDate)}
              </p>
              <p className="text-xl font-bold mt-2">
                {formatShort(r.windowStart)} to {formatShort(r.windowEnd)}
              </p>
              <p className="mt-1">
                <Countdown iso={r.windowStart} label="Window opens" />
              </p>
              <p className="text-sm text-muted mt-3">{r.note}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-8 rounded-xl bg-wash border border-line p-5">
        <h2 className="font-bold text-lg">Get an email when results land</h2>
        <p className="text-sm text-muted mt-1 mb-3">
          One email on results day, plus the retake dates that matter if you need them. No spam.
        </p>
        <Waitlist source="results-tracker" />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Every upcoming exam date and deadline</h2>
        <p className="text-muted mt-2 max-w-3xl">
          The registration deadline is also the last day to defer or cancel. You must apply to the licensing process
          and pay before you can register. Summer 2027 and later sittings use new 2027-28 study materials, released
          April 13, 2027.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-wash text-left">
                <th className="border border-line p-2">Sitting</th>
                <th className="border border-line p-2">Exam date</th>
                <th className="border border-line p-2">Licensing application</th>
                <th className="border border-line p-2">Accommodation requests</th>
                <th className="border border-line p-2">Register, defer or cancel by</th>
                <th className="border border-line p-2">Materials</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((s) => (
                <tr key={s.id}>
                  <td className="border border-line p-2 font-semibold">
                    {s.season} {s.examDate.slice(0, 4)} {s.exam}
                  </td>
                  <td className="border border-line p-2">
                    {formatDate(s.examDate)}
                    <br />
                    <Countdown iso={s.examDate} />
                  </td>
                  <td className="border border-line p-2">{formatShort(s.applicationDeadline)}</td>
                  <td className="border border-line p-2">{formatShort(s.accommodationDeadline)}</td>
                  <td className="border border-line p-2">
                    {formatShort(s.registrationDeadline)}
                    <br />
                    <Countdown iso={s.registrationDeadline} />
                  </td>
                  <td className="border border-line p-2">{s.materialsYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-3">
          Source:{" "}
          <a href={LSO_DATES_URL} rel="noopener" target="_blank">
            Law Society of Ontario, lawyer licensing exam dates and deadlines
          </a>
          , checked {formatShort(DATES_CHECKED)}. The LSO says dates are subject to change; confirm on lso.ca before you
          act.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link href="/blog/when-are-ontario-bar-exam-results-released" className="rounded-xl border border-line p-5 no-underline text-ink hover:border-brand">
          <p className="font-bold">How we estimate results day</p>
          <p className="text-sm text-muted mt-1">The pattern behind the windows above, and what to do while you wait.</p>
        </Link>
        <Link href="/blog/failed-solicitor-exam-retake-plan-march-2027" className="rounded-xl border border-line p-5 no-underline text-ink hover:border-brand">
          <p className="font-bold">Did not pass? Your plan for March 11, 2027</p>
          <p className="text-sm text-muted mt-1">The deadline that matters and a week-by-week retake plan.</p>
        </Link>
      </section>
    </div>
  );
}
