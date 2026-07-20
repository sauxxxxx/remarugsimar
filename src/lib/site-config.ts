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
  title: "Remar Ugsimar — Full-Stack Developer",
  description:
    "Full-stack developer building SaaS products, CRM systems, AI-powered applications, and modern websites.",
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
    "software developer Philippines",
    "SaaS developer",
    "CRM developer",
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
  alt: "Remar Ugsimar — Full-Stack Developer",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
