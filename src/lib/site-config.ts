const DEFAULT_SITE_URL = "https://remarugsimar.com";

function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configuredUrl || DEFAULT_SITE_URL);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export const siteConfig = {
  name: "Remar Ugsimar",
  title: "Remar Ugsimar — Custom Software & Web Developer in Cebu",
  description:
    "Full-stack developer in Cebu, Philippines. I build CRMs with lead generation, accounting systems, AI tools, and business websites around how your team works.",
  jobTitle: "Full-stack developer",
  portrait: "/v2/remar-studio-portrait.webp",
  email: "jarinaremar13@gmail.com",
  location: {
    city: "Cebu",
    country: "Philippines",
    countryCode: "PH",
  },
  url: resolveSiteUrl(),
  keywords: [
    "Remar Ugsimar",
    "full-stack developer",
    "custom software developer",
    "web developer Cebu",
    "website developer Philippines",
    "software developer Philippines",
    "SaaS developer",
    "CRM developer",
    "lead generation services",
    "B2B lead generation",
    "CRM with lead generation",
    "lead sourcing and enrichment",
    "AI application developer",
    "Vue.js developer",
    "Node.js developer",
    "Cebu developer",
  ],
} as const;

export const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Remar Ugsimar — Custom software and websites for your business",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
