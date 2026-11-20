import Link from "next/link";
import Waitlist from "@/components/Waitlist";
import { getAllPosts } from "@/lib/posts";

// Holding home page. The full landing page comes later; this one earns search
// traffic and email sign-ups while the product is built.
export default function Home() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <div>
      <section className="bg-wash border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-wide">Ontario bar exam prep</p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 max-w-3xl leading-tight">
            Pass the LSO licensing exams with prep built on what candidates actually face.
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Free tools and plain-English guides now. Smart practice for the Solicitor and Barrister exams is coming,
            for one simple price per sitting.
          </p>
          <div className="mt-8">
            <Waitlist source="home-hero" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="text-2xl font-bold">Free tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            href="/tools/results-tracker"
            className="rounded-xl border border-line p-6 no-underline text-ink hover:border-brand"
          >
            <p className="text-lg font-bold">Results date tracker</p>
            <p className="text-muted mt-1">
              Estimated release windows for the November 2026 Barrister and Solicitor exams, plus every 2027 deadline.
            </p>
          </Link>
          <div className="rounded-xl border border-dashed border-line p-6 text-muted">
            <p className="text-lg font-bold text-ink">Coming soon</p>
            <p className="mt-1">Study-hours planner, page-finding drill and a 20-question readiness check.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Latest guides</h2>
          <Link href="/blog" className="text-sm">
            All guides
          </Link>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="block h-full rounded-xl border border-line p-6 no-underline text-ink hover:border-brand"
              >
                <p className="text-xs uppercase tracking-wide text-brand font-semibold">{p.category}</p>
                <p className="text-lg font-bold mt-1">{p.title}</p>
                <p className="text-muted mt-1 text-sm">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
