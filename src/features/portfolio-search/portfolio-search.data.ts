import { profileLinks, projects, technologyGroups } from "@/lib/portfolio-data";

export type PortfolioSearchIcon =
  | "about"
  | "contact"
  | "experience"
  | "game"
  | "home"
  | "project"
  | "stack"
  | "technology";

export type PortfolioSearchItem = {
  id: string;
  label: string;
  description: string;
  group: "Navigate" | "Projects" | "Technologies" | "Contact";
  href?: string;
  icon: PortfolioSearchIcon;
  keywords: readonly string[];
  meta?: string;
  action?: "open-game";
  external?: boolean;
  showByDefault: boolean;
};

const navigationItems: PortfolioSearchItem[] = [
  {
    id: "home",
    label: "Home",
    description: "Return to the portfolio introduction",
    group: "Navigate",
    href: "/",
    icon: "home",
    keywords: ["profile", "remar", "portfolio"],
    meta: "G H",
    showByDefault: true,
  },
  {
    id: "about",
    label: "About",
    description: "Background, approach, and engineering focus",
    group: "Navigate",
    href: "/#about",
    icon: "about",
    keywords: ["bio", "introduction", "developer"],
    meta: "G A",
    showByDefault: true,
  },
  {
    id: "projects",
    label: "All projects",
    description: "Browse expanded project case studies",
    group: "Navigate",
    href: "/projects",
    icon: "project",
    keywords: ["work", "case studies", "portfolio"],
    meta: "G P",
    showByDefault: true,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Professional roles and responsibilities",
    group: "Navigate",
    href: "/#experience",
    icon: "experience",
    keywords: ["work", "career", "joyno", "freelance", "internship"],
    meta: "G E",
    showByDefault: true,
  },
  {
    id: "stack",
    label: "Stack",
    description: "Selected technologies and full toolkit",
    group: "Navigate",
    href: "/#stack",
    icon: "stack",
    keywords: ["skills", "tools", "technology"],
    meta: "G S",
    showByDefault: true,
  },
];

const projectItems: PortfolioSearchItem[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  label: project.name,
  description: project.category,
  group: "Projects",
  href: `/projects#${project.slug}`,
  icon: "project",
  keywords: [project.description, project.overview, ...project.technologies],
  meta: String(project.year),
  showByDefault: project.featured,
}));

const technologies = Array.from(
  new Set(technologyGroups.flatMap((group) => group.technologies)),
);

const technologyItems: PortfolioSearchItem[] = technologies.map((technology) => ({
  id: `technology-${technology.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
  label: technology,
  description: "View in the full technology stack",
  group: "Technologies",
  href: "/#stack",
  icon: "technology",
  keywords: ["skill", "tool", "framework", "stack"],
  meta: "stack",
  showByDefault: false,
}));

const contactItems: PortfolioSearchItem[] = profileLinks.map((link) => ({
  id: `contact-${link.label}`,
  label: link.label[0].toLocaleUpperCase() + link.label.slice(1),
  description: link.label === "email" ? "Start a conversation" : `Open ${link.label}`,
  group: "Contact",
  href: link.href,
  icon: "contact",
  keywords: ["contact", "connect", link.label],
  meta: link.external ? "↗" : undefined,
  external: link.external,
  showByDefault: link.label === "email",
}));

const gameItem: PortfolioSearchItem = {
  id: "stack-builder",
  label: "Stack Builder",
  description: "Open the portfolio mini game",
  group: "Navigate",
  icon: "game",
  keywords: ["game", "play", "tetris", "technology"],
  meta: "play",
  action: "open-game",
  showByDefault: true,
};

export function getPortfolioSearchItems(includeGame: boolean) {
  return [
    ...navigationItems,
    ...(includeGame ? [gameItem] : []),
    ...projectItems,
    ...technologyItems,
    ...contactItems,
  ];
}
