import { siteConfig } from "@/lib/site-config";

export const processSteps = [
  {
    id: "understand", title: "Understand the workflow", summary: "Goals, users, and the current process.",
    detail: "We identify what takes time, where information gets lost, and what the solution needs to help people do.",
  },
  {
    id: "design", title: "Design the solution", summary: "A clear interface and system structure.",
    detail: "I map the essential features, data, and user flows so we can review the direction before development.",
  },
  {
    id: "build", title: "Build and validate", summary: "Develop, test, and refine with feedback.",
    detail: "I build the solution in practical stages, check the core workflows, and refine the work with your feedback.",
  },
  {
    id: "launch", title: "Launch and support", summary: "Deploy and prepare for everyday use.",
    detail: "I prepare the release and handover. Documentation, maintenance, and ongoing support are agreed within the project scope.",
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
