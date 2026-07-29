import type { Metadata } from "next";
import type { WritingEntry } from "@/lib/content-data";
import { siteConfig, socialImage } from "@/lib/site-config";

export function createArticleMetadata(entry: WritingEntry): Metadata {
  const url = `/writing/${entry.slug}`;
  const title = `${entry.title} — ${siteConfig.name}`;

  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_US",
      url,
      siteName: `${siteConfig.name} Portfolio`,
      title,
      description: entry.summary,
      publishedTime: entry.publishedAt,
      authors: [siteConfig.name],
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.summary,
      images: [socialImage.url],
    },
  };
}
