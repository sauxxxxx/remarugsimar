import { type PortfolioProject, projects } from "@/lib/portfolio-data";

export type V2Project = PortfolioProject & {
  deviceImage: string;
  device: "laptop" | "monitor" | "tablet";
  highlights: string[];
};

function existingProject(slug: string): PortfolioProject {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing portfolio project: ${slug}`);
  return project;
}

const scout: V2Project = {
  slug: "scout",
  name: "Scout",
  category: "CRM with built-in lead discovery",
  description: "A lead finder connected to CRM pipelines and funnels, built to move sales teams from manual prospecting to outreach.",
  overview: "I built Scout after seeing the sales team spend much of their day finding leads and manually tracking prospects. It connects business discovery with the CRM workflow used to follow those leads through the pipeline.",
  challenge: "Manual lead research took time away from calling prospects. The team also tracked clients and leads manually, separating discovery from follow-up and making the sales workflow harder to maintain.",
  approach: "I paired a built-in lead finder with CRM tracking, pipelines, and funnels. The goal was to keep discovered leads and the next sales action in the same workspace instead of treating prospecting and customer tracking as separate jobs.",
  outcome: "Scout provides a single workflow for discovering businesses, tracking leads, and managing pipeline and funnel activity, built to give the sales team more time for outreach.",
  role: "Product concept and full-stack development",
  contributions: ["Identified the manual prospecting bottleneck", "Built the lead finder and CRM workflow", "Implemented sales pipelines and funnels"],
  technologies: [],
  highlights: ["Lead finder", "Pipeline", "Funnel"],
  year: 2026,
  thumbnailUrl: "/v2/screens/scout.png",
  screenshots: [],
  url: "",
  featured: true,
  deviceImage: "/v2/scout-laptop-v1.png",
  device: "laptop",
};

const accounting: V2Project = {
  slug: "joyno-accounting",
  name: "Joyno Accounting",
  category: "Internal accounting platform",
  description: "An accounting workspace built around administrative workflows to replace manual work and reduce dependence on recurring subscriptions.",
  overview: "I built an internal accounting system for admins who were doing their work manually while the company struggled to sustain an external accounting subscription.",
  challenge: "Administrative work depended on manual processes, while recurring subscription costs made the existing accounting service difficult to sustain. The team needed a system shaped around the work they actually performed.",
  approach: "I built an accounting workspace around the team's required workflows. The dashboard brings revenue, expenses, income, assets, balances, and recent activity into one overview, with navigation to the related accounting and administration modules.",
  outcome: "Joyno Accounting gives the team an internal workspace for its accounting operations and financial overview, built to reduce manual administration and dependence on an external subscription.",
  role: "Full-stack application development",
  contributions: ["Translated manual administrative processes into system workflows", "Built the accounting dashboard and financial overview", "Connected financial and administrative modules"],
  technologies: [],
  highlights: ["Accounting", "Financial overview", "Internal tools"],
  year: 2026,
  thumbnailUrl: "/v2/screens/joyno-accounting.png",
  screenshots: [],
  url: "",
  featured: true,
  deviceImage: "/v2/joyno-accounting-monitor-v1.png",
  device: "monitor",
};

const casatoon: V2Project = {
  ...existingProject("roarly-ai"),
  slug: "casatoon",
  name: "CasaToon",
  deviceImage: "/v2/roarly-laptop-real-screen-v6.png",
  device: "laptop",
  highlights: ["AI animation", "Creative workflows", "Web app"],
};

const joynosync: V2Project = {
  ...existingProject("joynosync"),
  category: "CRM & sales operations platform",
  description: "A shared workspace for leads, pipelines, funnels, call performance, attendance, tasks, and project management.",
  overview: "JoynoSync connects CRM activity with the daily operations of a sales team: leads, pipelines, funnels, call performance, attendance, tasks, and projects.",
  challenge: "Sales and team activity spread across separate tracking processes makes it difficult to see customer progress, call performance, attendance, and upcoming work together.",
  approach: "I brought lead management, pipelines, and funnels together with call performance, attendance, and task and project management. The dashboard connects customer activity with the team's operational responsibilities.",
  outcome: "JoynoSync provides a common workspace for sales tracking and team coordination. Unlike Scout's focus on built-in lead discovery, this project emphasizes visibility across daily sales and team operations.",
  role: "Full-stack application development",
  contributions: ["Lead, pipeline, and funnel management", "Call performance and attendance tracking", "Task and project management"],
  deviceImage: "/v2/joynosync-ipad-left-alpha-v5.webp",
  device: "tablet",
  highlights: ["Sales operations", "Call performance", "Team management"],
};

const hadsan: V2Project = {
  slug: "the-beach-park-hadsan",
  name: "The Beach Park – Hadsan",
  category: "Hospitality website",
  description: "An image-led beach destination website with a focused path to stay dates, guest selection, and booking discovery.",
  overview: "A website for The Beach Park – Hadsan that introduces the destination through beach photography and places stay planning directly in the main experience.",
  challenge: "A hospitality website needs to communicate the destination's atmosphere while keeping practical trip-planning actions easy to find.",
  approach: "I built the website around a clear visual introduction, a concise navigation, and prominent booking discovery. The supplied homepage shows arrival, departure, and guest selection alongside the destination photography.",
  outcome: "The website brings destination presentation and stay planning into one branded experience, with a direct booking entry point.",
  role: "Website development",
  contributions: ["Destination-focused website presentation", "Clear navigation and booking entry points", "Stay-planning interface"],
  technologies: [],
  highlights: ["Hospitality", "Destination website", "Booking discovery"],
  year: 2026,
  thumbnailUrl: "/v2/screens/hadsan.png",
  screenshots: [],
  url: "",
  featured: true,
  deviceImage: "/v2/hadsan-tablet-v1.png",
  device: "tablet",
};

const nxone: V2Project = {
  ...existingProject("nxone-dc-inc"),
  deviceImage: "/v2/nxone-monitor-left-alpha-v3.webp",
  device: "monitor",
  highlights: ["WordPress", "Elementor", "SEO"],
};

export const v2Projects: readonly V2Project[] = [
  scout, accounting, casatoon, joynosync, hadsan, nxone,
];

export function v2ProjectHref(slug: string) {
  return `/v2/projects/${slug}`;
}
