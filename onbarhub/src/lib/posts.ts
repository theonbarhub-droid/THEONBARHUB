import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  exam?: "Barrister" | "Solicitor" | "Both";
  readingMinutes: number;
  faq?: { q: string; a: string }[];
}

export interface Post extends PostMeta {
  html: string;
}

function iso(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

// Accept either {q,a} or {question,answer} in front-matter.
function normFaq(v: unknown): { q: string; a: string }[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .map((f) => ({
      q: String((f?.q ?? f?.question ?? "")).trim(),
      a: String((f?.a ?? f?.answer ?? "")).trim(),
    }))
    .filter((f) => f.q && f.a);
  return out.length ? out : undefined;
}

function readFile(slug: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  return matter(raw);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const { data, content } = readFile(slug);
      if (data.draft) return null;
      return {
        slug,
        title: data.title,
        description: data.description,
        date: iso(data.date),
        updated: data.updated ? iso(data.updated) : undefined,
        category: data.category ?? "Guides",
        exam: data.exam,
        readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
        faq: normFaq(data.faq),
      } as PostMeta;
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (b.updated ?? b.date).localeCompare(a.updated ?? a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!getAllSlugs().includes(slug)) return null;
  const { data, content } = readFile(slug);
  if (data.draft) return null;
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: iso(data.date),
    updated: data.updated ? iso(data.updated) : undefined,
    category: data.category ?? "Guides",
    exam: data.exam,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    faq: normFaq(data.faq),
    html: processed.toString(),
  };
}
