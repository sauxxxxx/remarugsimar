import { profileLinks, projects, selectedTechnologies } from "@/lib/portfolio-data";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export function StructuredData() {
  const websiteId = `${siteConfig.url}#website`;
  const personId = `${siteConfig.url}#person`;
  const profileId = `${siteConfig.url}#profile`;

  const structuredData = {
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
        jobTitle: "Full-Stack Developer",
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
          "AI-powered applications",
          "Business automation",
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": profileId,
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
            url: project.url || absoluteUrl(`/projects#${project.slug}`),
            dateCreated: String(project.year),
            creator: { "@id": personId },
            keywords: project.technologies.join(", "),
          },
        })),
      },
    ],
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
      }}
      id="portfolio-structured-data"
      type="application/ld+json"
    />
  );
}
