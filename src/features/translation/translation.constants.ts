import {
  aboutParagraphs,
  experiences,
  profileCopy,
  profileStats,
  projects,
  selectedProjects,
  technologyGroups,
} from "@/lib/portfolio-data";
import { STACK_BUILDER_COPY } from "@/features/stack-builder/stack-builder.constants";
import { contactCopy, services, testimonialCopy, writingEntries } from "@/lib/content-data";

export type LanguageOption = {
  code: string;
  name: string;
};

export const DEFAULT_LANGUAGE: LanguageOption = { code: "en", name: "English" };

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  DEFAULT_LANGUAGE,
  { code: "fil", name: "Filipino (Tagalog)" },
  { code: "ceb", name: "Cebuano" },
  { code: "es", name: "Spanish" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "id", name: "Indonesian" },
  { code: "vi", name: "Vietnamese" },
];

const interfaceCopy = [
  "Available for work",
  "About",
  "Projects",
  "Experience",
  "Stack",
  "about",
  "a brief introduction",
  "projects",
  "experience",
  "stack",
  `${selectedProjects.length} selected`,
  `${experiences.length} roles`,
  "selected",
  "full toolkit",
  "view all",
  "Selected projects",
  "Professional experience",
  "Selected technologies",
  "Technology stack",
  "Skip to about",
  "portfolio",
  "all projects",
  "Selected work across SaaS, CRM, AI, and the web—designed and built for real business needs.",
  "Have a project in mind?",
  "back to portfolio",
  "Role",
  "Key work",
  "visit website",
  "private project",
];

const extendedInterfaceCopy = [
  "Services",
  "Writing",
  "Contact",
  "services",
  "testimonials",
  "latest writing",
  "contact",
  `${services.length} ways I can help`,
  "awaiting client approval",
  "feedback in progress",
  "available for selected projects",
  "start a conversation",
  "all writing",
  "Writing",
  "Notes on product engineering, CRM systems, AI features, and building useful business software.",
  "project case study",
  "Type",
  "Year",
  "Status",
  "Live website",
  "Private project",
  "Overview",
  "Technology",
  "Next case study",
  "Read next",
];

const caseStudyCopy = [
  "Challenge",
  "Approach",
  "Outcome",
  "My contribution",
  "Project gallery",
  "screenshots coming soon",
  "Additional interface screenshots will be added here.",
];

export const TRANSLATION_SOURCE_TEXTS = Array.from(
  new Set([
    profileCopy.title,
    profileCopy.introduction,
    profileCopy.availability,
    profileCopy.footer,
    ...profileStats.map((stat) => stat.label),
    ...aboutParagraphs,
    ...projects.flatMap((project) => [
      project.category,
      project.description,
      project.overview,
      project.role,
      ...project.contributions,
    ]),
    ...experiences.flatMap((experience) => [
      experience.role,
      experience.period,
      experience.description,
      experience.company,
    ]),
    ...technologyGroups.map((group) => group.name),
    ...Object.values(STACK_BUILDER_COPY),
    ...interfaceCopy,
    ...services.flatMap((service) => [
      service.title,
      service.description,
      ...service.capabilities,
    ]),
    testimonialCopy.heading,
    testimonialCopy.body,
    testimonialCopy.note,
    ...writingEntries.flatMap((entry) => [entry.title, entry.summary, entry.category]),
    contactCopy.heading,
    contactCopy.body,
    ...extendedInterfaceCopy,
    ...projects.flatMap((project) => [project.challenge, project.approach, project.outcome]),
    ...caseStudyCopy,
  ]),
);

export const LANGUAGE_STORAGE_KEY = "portfolio-language";
