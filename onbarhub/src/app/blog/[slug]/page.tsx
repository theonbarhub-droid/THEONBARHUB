import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Waitlist from "@/components/Waitlist";
import { getAllSlugs, getPost } from "@/lib/posts";
import { formatShort } from "@/lib/dates";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: { "@type": "Person", name: site.author.name, url: `${site.url}/about` },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
      mainEntityOfPage: `${site.url}/blog/${slug}`,
    },
  ];
  if (post.faq?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <p className="text-sm">
        <Link href="/blog" className="no-underline">
          Guides
        </Link>{" "}
        <span className="text-muted">/ {post.category}</span>
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight">{post.title}</h1>
      <p className="text-sm text-muted mt-3">
        By{" "}
        <Link href="/about" className="no-underline">
          {site.author.name}
        </Link>{" "}
        · Updated {formatShort(post.updated ?? post.date)} · {post.readingMinutes} min read
      </p>
      <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.faq?.length ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Quick answers</h2>
          <dl className="mt-4 space-y-4">
            {post.faq.map((f) => (
              <div key={f.q} className="rounded-lg border border-line p-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="text-muted mt-1">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="mt-12 rounded-xl bg-wash border border-line p-5">
        <h2 className="font-bold text-lg">Stay ahead of results and deadlines</h2>
        <p className="text-sm text-muted mt-1 mb-3">
          Results-day alerts, deadline reminders and early access to OnBar's practice tools.
        </p>
        <Waitlist source={`post-${slug}`} />
      </section>

      <p className="text-xs text-muted mt-8">{site.disclaimer}</p>
    </article>
  );
}
