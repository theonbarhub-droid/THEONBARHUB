import Link from "next/link";
import Waitlist from "@/components/Waitlist";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 pt-14 pb-14 sm:pt-20 sm:pb-20">
          <div className="flex items-center gap-4">
            <span className="font-serif italic text-accent whitespace-nowrap">Ontario bar exam preparation</span>
            <span className="flex-1 h-px bg-line" />
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.04] mt-7 max-w-4xl">
            Pass the LSO licensing exams with prep built on what candidates actually face.
          </h1>
          <p className="lead mt-7 max-w-2xl">
            Free tools, a timed practice exam that tells you why you missed the marks you missed, and guides written in
            plain English. The full study package is coming, for one price per sitting.
          </p>
          <div className="mt-9">
            <Waitlist source="home-hero" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold">Start practising</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          <Link
            href="/tools/practice-exam"
            className="lg:col-span-3 group rounded-2xl border border-line bg-card p-7 no-underline text-ink transition hover:border-brand"
          >
            <p className="font-serif italic text-accent">Practice exam</p>
            <p className="font-serif text-2xl font-semibold mt-2">
              A timed mock that tells you why you missed marks
            </p>
            <p className="text-muted mt-3 leading-relaxed">
              Real exam-style questions with a question palette and per-question timing. When you finish, you get a
              breakdown by subject and chapter, where your time went, and the answer changes that cost you. Original
              questions, written for this exam.
            </p>
            <span className="inline-block mt-5 font-semibold text-brand group-hover:underline">Take a practice exam</span>
          </Link>

          <div className="lg:col-span-2 grid gap-5">
            <Link
              href="/tools/results-tracker"
              className="rounded-2xl border border-line bg-card p-6 no-underline text-ink transition hover:border-brand"
            >
              <p className="font-serif text-xl font-semibold">Results date tracker</p>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                Estimated release windows for the November 2026 exams, plus every 2027 date and deadline.
              </p>
            </Link>
            <Link
              href="/account"
              className="rounded-2xl border border-line bg-wash p-6 no-underline text-ink transition hover:border-brand"
            >
              <p className="font-serif text-xl font-semibold">Your progress</p>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                Create a free account to save every attempt and reopen its full analysis on any device.
              </p>
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Link
            href="/tools/readiness"
            className="rounded-2xl border border-line bg-card p-6 no-underline text-ink transition hover:border-brand"
          >
            <p className="font-serif text-xl font-semibold">Why are you struggling?</p>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              A two-minute check that finds whether your real problem is the material, finding it, the clock, or
              technique, and what to do about each.
            </p>
          </Link>
          <Link
            href="/tools/study-planner"
            className="rounded-2xl border border-line bg-card p-6 no-underline text-ink transition hover:border-brand"
          >
            <p className="font-serif text-xl font-semibold">Study planner</p>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              Your exam date and weekly hours become a realistic plan across subjects, practice and indexing.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="text-2xl sm:text-3xl font-semibold">Latest guides</h2>
          <Link href="/blog" className="text-sm font-semibold">
            All guides
          </Link>
        </div>
        <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-line pb-6">
              <Link href={`/blog/${p.slug}`} className="block no-underline text-ink group">
                <p className="font-serif italic text-sm text-accent">{p.category}</p>
                <p className="font-serif text-xl font-semibold mt-1 leading-snug group-hover:text-brand">{p.title}</p>
                <p className="text-muted mt-2 text-sm leading-relaxed">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
