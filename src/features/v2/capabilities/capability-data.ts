export const capabilities = [
  {
    id: "crm", label: "CRM & lead generation", hint: "Find leads. Keep sales moving.", color: "#79bcff",
    title: "From discovery to a deal.", description: "Lead finding and pipeline tracking, built around the sales workflow.",
    project: "Scout", slug: "scout",
  },
  {
    id: "accounting", label: "Business systems", hint: "Turn processes into simple tools.", color: "#ffb29d",
    title: "Make the numbers make sense.", description: "Financial summaries and daily administration in one workspace.",
    project: "Joyno Accounting", slug: "joyno-accounting",
  },
  {
    id: "ai", label: "AI integrations", hint: "Connect AI to your workflow.", color: "#c6b1ff",
    title: "From an idea to a scene.", description: "Creative workflows that connect a story idea with a clear scene plan.",
    project: "CasaToon", slug: "casatoon",
  },
  {
    id: "web", label: "Websites & applications", hint: "Design and build for real use.", color: "#b5df08",
    title: "A good experience at every size.", description: "Destination websites with clear navigation and a simple path to planning a stay.",
    project: "The Beach Park – Hadsan", slug: "the-beach-park-hadsan",
  },
] as const;

export type CapabilityId = (typeof capabilities)[number]["id"];
