export const leadStages = [
  { id: "new", label: "New", color: "#79bcff" },
  { id: "qualified", label: "Qualified", color: "#ffb29d" },
  { id: "contacted", label: "Contacted", color: "#c6b1ff" },
  { id: "won", label: "Won", color: "#b5df08" },
] as const;

export type LeadStage = (typeof leadStages)[number]["id"];
export type SampleLead = { id: string; name: string; note: string; value: number; stage: LeadStage };

export const sampleLeads: readonly SampleLead[] = [
  { id: "northline", name: "Northline Co.", note: "Website inquiry", value: 120000, stage: "new" },
  { id: "lumen", name: "Lumen Digital", note: "Website inquiry", value: 120000, stage: "new" },
  { id: "harbor", name: "Harbor Studio", note: "Discovery call", value: 180000, stage: "qualified" },
  { id: "atlas", name: "Atlas Supply", note: "Proposal sent", value: 350000, stage: "contacted" },
  { id: "cedar", name: "Cedar & Main", note: "Closed won", value: 420000, stage: "won" },
];

export function moveSampleLead(leads: readonly SampleLead[], id: string, stage: string): SampleLead[] {
  if (!leadStages.some((item) => item.id === stage)) return [...leads];
  return leads.map((lead) => lead.id === id ? { ...lead, stage: stage as LeadStage } : lead);
}

export const accountingMonths = [
  { month: "January", label: "Jan", income: 164000, expenses: 92000 },
  { month: "February", label: "Feb", income: 192000, expenses: 104000 },
  { month: "March", label: "Mar", income: 178000, expenses: 98000 },
  { month: "April", label: "Apr", income: 236000, expenses: 132000 },
  { month: "May", label: "May", income: 218000, expenses: 121000 },
  { month: "June", label: "Jun", income: 284000, expenses: 146000 },
] as const;

export type AccountingMetric = "income" | "expenses";

export const storyExamples = [
  {
    id: "garden", label: "The little gardener", tone: "Warm adventure",
    idea: "A small robot discovers a forgotten rooftop garden and learns to care for it.",
    scenes: [
      { title: "A quiet discovery", shot: "Wide shot", copy: "The robot steps onto a rooftop filled with wilted plants. One green sprout catches its eye." },
      { title: "A little help", shot: "Close-up", copy: "It collects raindrops in a small cup and carefully waters the sprout." },
      { title: "Something grows", shot: "Pull back", copy: "New leaves open. The robot sits beside the thriving garden as the city wakes up." },
    ],
  },
  {
    id: "lighthouse", label: "The lost lantern", tone: "Gentle mystery",
    idea: "A young fox follows a drifting lantern through the fog to bring a lighthouse back to life.",
    scenes: [
      { title: "A light in the fog", shot: "Wide shot", copy: "A fox notices a warm light drifting above a silent beach and follows it toward the cliffs." },
      { title: "The missing piece", shot: "Close-up", copy: "Inside the lighthouse, the lantern fits into an empty brass cradle." },
      { title: "A way home", shot: "Pull back", copy: "The lighthouse sweeps light across the sea. A distant boat turns safely toward the harbor." },
    ],
  },
] as const;

const pesoFormatter = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
export function formatPesos(value: number) { return pesoFormatter.format(value); }
