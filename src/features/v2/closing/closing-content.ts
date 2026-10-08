import { siteConfig } from "@/lib/site-config";

export const processSteps = [
  {
    id: "plan", label: "Plan", title: "Start with how you work.",
    detail: "We look at your current process, agree on the essential features, and review the interface before development starts.",
    outcome: "A defined scope, priorities, and a design to review.",
  },
  {
    id: "build", label: "Build", title: "Try it as it takes shape.",
    detail: "I build in practical stages, test the core workflows, and share progress so your feedback shapes the next iteration.",
    outcome: "Working software you can test and give feedback on.",
  },
  {
    id: "launch", label: "Launch", title: "Put it to work.",
    detail: "I prepare deployment, check the release, and hand over the system. Documentation and ongoing support are agreed within the project scope.",
    outcome: "A live release and an agreed handover and support plan.",
  },
] as const;

export const contactFaqs = [
  {
    id: "existing-system", question: "Can you improve an existing system?",
    answer: "Yes. I can review your current system, identify where it slows the team down, and define improvements around your existing workflow.",
  },
  {
    id: "after-launch", question: "What happens after launch?",
    answer: "Handover, documentation, and any ongoing fixes or maintenance are agreed as part of the project scope.",
  },
  {
    id: "project-scope", question: "How do we define the project scope?",
    answer: "We start with your goals, users, and current process, then agree on the required features, deliverables, priorities, and timeline.",
  },
] as const;

export const contactHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent(
  "What would you like to build or improve?\nCurrent workflow or system:\nScope or priorities:\nTarget timeline:",
)}`;
