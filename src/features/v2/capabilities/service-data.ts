// Drawn from the site's own service, project, and experience copy.
export const services = [
  {
    id: "crm",
    name: "CRM & lead generation",
    promise: "Find leads. Keep sales moving.",
    description: "Lead finding and pipeline tracking, built around the sales workflow.",
    included: ["Lead finder", "Pipelines & funnels", "Follow-up tracking", "Sales overview"],
    goodFor: "Sales teams moving from manual prospecting to outreach.",
  },
  {
    id: "systems",
    name: "Business systems",
    promise: "Turn processes into simple tools.",
    description: "Financial summaries and daily administration in one workspace.",
    included: ["Accounting modules", "Financial overviews", "Tasks & attendance", "Internal tools"],
    goodFor: "Teams replacing manual work and recurring subscriptions.",
  },
  {
    id: "ai",
    name: "AI integrations",
    promise: "Connect AI to your workflow.",
    description: "AI-powered features built into the tools your team already uses.",
    included: ["AI-assisted workflows", "Content generation", "AI features in existing apps"],
    goodFor: "Teams that want AI to support their everyday work.",
  },
  {
    id: "web",
    name: "Websites & applications",
    promise: "Design and build for real use.",
    description: "Responsive business websites and web applications, from the first idea to launch.",
    included: ["Business websites", "WordPress builds", "SEO & analytics", "Performance"],
    goodFor: "Businesses that need a clear online home and a simple inquiry path.",
  },
] as const;

export type Service = (typeof services)[number];
