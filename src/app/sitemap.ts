import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { projects } from "@/lib/portfolio-data";
import { writingEntries } from "@/lib/content-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: absoluteUrl("/writing"),
      lastModified,
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
