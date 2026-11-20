import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatShort } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Ontario Bar Exam Guides",
  description:
    "Plain-English guides to the LSO Barrister and Solicitor licensing exams: dates, results, retakes, study plans and exam-day strategy.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold">Guides</h1>
      <p className="mt-2 text-muted">
        Answers to the questions Ontario bar candidates ask most, kept current every sitting.
      </p>
      <ul className="mt-8 divide-y divide-line">
        {posts.map((p) => (
          <li key={p.slug} className="py-5">
            <p className="text-xs uppercase tracking-wide text-brand font-semibold">
              {p.category}
              {p.exam ? ` · ${p.exam}` : ""}
            </p>
            <Link href={`/blog/${p.slug}`} className="text-xl font-bold text-ink no-underline hover:text-brand">
              {p.title}
            </Link>
            <p className="text-muted mt-1">{p.description}</p>
            <p className="text-xs text-muted mt-2">
              Updated {formatShort(p.updated ?? p.date)} · {p.readingMinutes} min read
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
