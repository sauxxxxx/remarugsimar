import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { projects } from "@/lib/portfolio-data";
import { writingEntries } from "@/lib/content-data";

const siteUpdatedAt = new Date("2026-07-23T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/resume"),
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: absoluteUrl("/writing"),
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...writingEntries.map((entry) => ({
      url: absoluteUrl(`/writing/${entry.slug}`),
      lastModified: new Date(entry.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
