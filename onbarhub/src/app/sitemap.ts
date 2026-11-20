import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: p.updated ?? p.date,
  }));
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/tools/results-tracker`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.4 },
    ...posts,
  ];
}
