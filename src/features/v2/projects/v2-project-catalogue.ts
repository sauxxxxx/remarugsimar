import { type PortfolioProject, projects } from "@/lib/portfolio-data";
import { type V2Project, v2Projects } from "./v2-project-data";

export type V2CatalogueProject = PortfolioProject & {
  deviceImage?: string;
  device?: V2Project["device"];
};

const additionalWebsites = ["the-sharks-tail", "roarly-website", "joyno-inc"].map((slug) => {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing website in project catalogue: ${slug}`);
  return project;
});

const shukey: V2CatalogueProject = {
  slug: "shukey-philippines",
  name: "Shukey Philippines",
  category: "Service business website",
  description: "A service-business website connecting key, lock, shoe, and bag services with a clear path to finding a branch.",
  overview: "A website for Shukey Philippines that introduces its everyday repair and key services and helps customers find a nearby branch.",
  challenge: "Customers need to understand which services are available and where to bring their keys, locks, shoes, or bags. The website needed to make both service discovery and finding a branch easy to follow.",
  approach: "I organized the website around a clear service introduction, dedicated service categories, and prominent branch-finding actions. Store photography connects the online presentation with the business customers visit in person.",
  outcome: "The website gives customers a central place to explore Shukey's services, find branch information, and reach the business.",
  role: "Website development",
  year: 2026,
  contributions: ["Service-focused website presentation", "Branch discovery and customer contact paths", "Clear navigation across services and business information"],
  technologies: ["WordPress"],
  thumbnailUrl: "/v2/screens/shukey-home.jpg",
  screenshots: [],
  url: "https://shukeyph.com/",
  featured: false,
};

const catalogueEntries = new Map<string, V2CatalogueProject>(
  [...v2Projects, ...additionalWebsites, shukey].map((project) => [project.slug, project]),
);

const galleryOrder = [
  "scout", "joyno-accounting", "joynosync", "casatoon",
  "the-beach-park-hadsan", "nxone-dc-inc", "shukey-philippines",
  "the-sharks-tail", "roarly-website", "joyno-inc",
];

// The homepage continues to use the six selected v2Projects.
export const v2ProjectCatalogue: readonly V2CatalogueProject[] = galleryOrder.map((slug) => {
  const project = catalogueEntries.get(slug);
  if (!project) throw new Error(`Missing V2 catalogue entry: ${slug}`);
  return project;
});
