import { v2ProjectCatalogue } from "@/features/v2/projects/v2-project-catalogue";
import { v2ProjectHref } from "@/features/v2/projects/v2-project-data";
import { v2Experiences } from "@/features/v2/v2-experience-data";
import { profileLinks, technologyGroups } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";

export type CareerDocumentKind = "resume" | "cv";

const responsibilities: Record<string, readonly string[]> = {
  "Full-Stack Developer": [
    "Build and maintain Scout, JoynoSync, Joyno Accounting, and CasaToon across web and mobile workflows.",
    "Develop lead discovery, CRM pipelines, accounting modules, and AI-assisted product features.",
    "Work across interfaces, backend services, databases, performance improvements, and production releases.",
  ],
  "Full-Stack Developer Intern": [
    "Contributed to internal products and client websites using Vue.js, Node.js, Flutter, and cloud backend services.",
    "Supported feature implementation, testing, performance optimization, and production releases.",
  ],
  "Freelance Full-Stack Developer": [
    "Design and develop responsive business websites, including work for NxOne DC Inc. and hospitality clients.",
    "Deliver custom WordPress builds, SEO foundations, analytics integration, and performance improvements.",
  ],
};

export const careerProfile = {
  name: siteConfig.name,
  title: "Full-Stack Developer",
  location: `${siteConfig.location.city}, ${siteConfig.location.country}`,
  email: siteConfig.email,
  website: siteConfig.url.origin,
  summary: "Full-stack developer based in Cebu, Philippines, building CRM and lead discovery tools, accounting systems, AI-assisted applications, and business websites. Work spans frontend interfaces, backend services, data, and deployment, with freelance experience since 2023.",
  updated: "2026-10-30",
  updatedLabel: "October 2026",
  links: profileLinks.filter((link) => link.label === "github" || link.label === "linkedin"),
};

export const careerExperience = v2Experiences.map((experience) => ({
  ...experience,
  bullets: responsibilities[experience.role] ?? [experience.description],
}));

export const careerEducation = [
  {
    school: "Cebu Technological University - Barili Campus",
    qualification: "Bachelor of Science in Information Technology",
    year: "2026",
    distinction: "Cum Laude",
  },
  {
    school: "Bartolome and Manuela Panares Memorial National High School",
    qualification: "General Academic Strand (GAS)",
    year: "2022",
    distinction: "",
  },
  {
    school: "Maghanoy Elementary School",
    qualification: "Elementary education",
    year: "2016",
    distinction: "",
  },
] as const;

export const careerSkills = technologyGroups;

export const careerProjects = v2ProjectCatalogue.map((project) => ({
  slug: project.slug,
  name: project.name,
  category: project.category,
  year: project.year,
  role: project.role,
  description: project.description,
  contributions: project.contributions,
  outcome: project.outcome,
  technologies: project.technologies,
  href: v2ProjectHref(project.slug),
  url: new URL(v2ProjectHref(project.slug), siteConfig.url).toString(),
}));

export const resumeProjectSlugs = ["scout", "joyno-accounting", "joynosync", "casatoon"];

export const careerDocuments = {
  resume: { label: "Résumé", path: "/resume", pdf: "/documents/remar-ugsimar-resume.pdf", description: "A concise overview of experience, selected projects, education, and technical skills." },
  cv: { label: "Curriculum vitae", path: "/cv", pdf: "/documents/remar-ugsimar-cv.pdf", description: "A detailed record of experience, project contributions, technical skills, and education." },
} as const;

export function getCareerContent(kind: CareerDocumentKind) {
  return {
    profile: careerProfile,
    experience: careerExperience,
    education: kind === "resume" ? careerEducation.slice(0, 1) : careerEducation,
    projects: kind === "resume"
      ? careerProjects.filter((project) => resumeProjectSlugs.includes(project.slug))
      : careerProjects,
    skills: careerSkills,
    document: careerDocuments[kind],
  };
}
