import type { WritingEntry } from "@/lib/content-data";
import {
  type PortfolioProject,
  profileLinks,
  projects,
  selectedTechnologies,
} from "@/lib/portfolio-data";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const websiteId = `${siteConfig.url}#website`;
const personId = `${siteConfig.url}#person`;

function StructuredDataScript({ id, value }: { id: string; value: object }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replaceAll("<", "\\u003c"),
      }}
      id={id}
      type="application/ld+json"
    />
  );
}

export function StructuredData() {
  const value = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url.toString(),
        name: `${siteConfig.name} Portfolio`,
        description: siteConfig.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        url: siteConfig.url.toString(),
        email: `mailto:${siteConfig.email}`,
        jobTitle: "CRM & SaaS Full-Stack Developer",
        description: siteConfig.description,
        sameAs: profileLinks
          .filter((link) => link.external && link.href.startsWith("http"))
          .map((link) => link.href),
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location.city,
          addressCountry: siteConfig.location.countryCode,
        },
        knowsAbout: [
          ...selectedTechnologies,
          "SaaS products",
          "CRM systems",
          "AI-assisted workflows",
          "Business automation",
        ],
      },
    ],
  };

  return <StructuredDataScript id="site-structured-data" value={value} />;
}

export function HomeStructuredData() {
  const value = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}#profile`,
        url: siteConfig.url.toString(),
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "ItemList",
        "@id": `${siteConfig.url}#projects`,
        name: "Selected software projects",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.name,
            description: project.overview,
            url: absoluteUrl(`/projects/${project.slug}`),
            image: absoluteUrl(project.thumbnailUrl),
            dateCreated: String(project.year),
            creator: { "@id": personId },
            keywords: project.technologies.join(", "),
            ...(project.url ? { sameAs: project.url } : {}),
          },
        })),
      },
    ],
  };

  return <StructuredDataScript id="home-structured-data" value={value} />;
}

export function ProjectStructuredData({ project }: { project: PortfolioProject }) {
  const canonicalUrl = absoluteUrl(`/projects/${project.slug}`);
  const value = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${canonicalUrl}#project`,
        url: canonicalUrl,
        name: project.name,
        description: project.overview,
        image: absoluteUrl(project.thumbnailUrl),
        dateCreated: String(project.year),
        creator: { "@id": personId },
        keywords: project.technologies.join(", "),
        ...(project.url ? { sameAs: project.url } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Projects",
            item: absoluteUrl("/projects"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: project.name,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return <StructuredDataScript id="project-structured-data" value={value} />;
}

export function ArticleStructuredData({ entry }: { entry: WritingEntry }) {
  const canonicalUrl = absoluteUrl(`/writing/${entry.slug}`);
  const value = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        url: canonicalUrl,
        headline: entry.title,
        description: entry.summary,
        datePublished: entry.publishedAt,
        dateModified: entry.publishedAt,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
        mainEntityOfPage: canonicalUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Writing",
            item: absoluteUrl("/writing"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: entry.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return <StructuredDataScript id="article-structured-data" value={value} />;
}
