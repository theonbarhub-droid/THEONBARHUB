import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About The OnBar Hub",
  description:
    "Who builds The OnBar Hub, how our guides are researched, and how we keep them accurate for every LSO sitting.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 prose">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">About The OnBar Hub</h1>
      <p>
        The OnBar Hub helps candidates prepare for the Law Society of Ontario Barrister and Solicitor licensing exams.
        It is a sister site of The NCA Hub, which supports internationally trained lawyers through the NCA exams.
      </p>
      <h2>Who builds it</h2>
      <p>
        <strong>{site.author.name}</strong>: {site.author.bio}
      </p>
      <h2>How our guides are made</h2>
      <ul>
        <li>Dates, deadlines and rules come from the Law Society of Ontario and are linked on every page that uses them.</li>
        <li>
          Topics come from studying thousands of public questions candidates have asked about the exams. We report
          patterns as anonymous statistics. We never publish anyone&apos;s name, username or words.
        </li>
        <li>Estimates, such as results-day windows, are labelled as estimates and explained.</li>
        <li>Every guide shows when it was last updated, and we review them each sitting.</li>
      </ul>
      <h2>Corrections</h2>
      <p>Spotted something out of date or wrong? Tell us and we will fix it and note the change.</p>
      <p className="text-sm text-muted">{site.disclaimer}</p>
    </div>
  );
}
