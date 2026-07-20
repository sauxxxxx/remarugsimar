export const profileLinks = [
  { label: "github", href: "https://github.com/sauxxxxx", external: true },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/ugsimar-remar-756a8a3a7/",
    external: true,
  },
  { label: "email", href: "mailto:jarinaremar13@gmail.com", external: false },
  { label: "resume", href: "/resume.pdf", external: true },
] as const;

export const profileCopy = {
  title: "Full-Stack Developer",
  introduction:
    "I'm a full-stack developer building SaaS products, CRM systems, AI-powered applications, and modern websites. I enjoy turning complex business problems into simple, scalable software that people actually use.",
  availability:
    "Currently available for freelance projects and collaborating with startups and businesses.",
  footer: "Building software with purpose.",
} as const;

export const profileStats = [
  { value: "2023+", label: "Freelancing" },
  { value: "15+", label: "Projects" },
  { value: "5+", label: "SaaS & CRM" },
  { value: "PH", label: "Based in Cebu" },
] as const;

export const aboutParagraphs = [
  "I'm a full-stack developer from the Philippines focused on building software that helps businesses grow. My work spans SaaS platforms, CRM systems, AI-powered applications, business automation, and modern websites, taking products from initial ideas to production.",
  "I enjoy solving real-world problems through thoughtful engineering and clean user experiences. Whether it's creating internal business tools, customer-facing web applications, or integrating AI into existing workflows, I prioritize solutions that are scalable, maintainable, and genuinely useful.",
  "Over the past few years, I've worked with startups, local businesses, and freelance clients, delivering projects ranging from corporate websites to custom CRM systems and AI-driven products. My goal is to build software that not only looks polished but also creates measurable value for the people using it.",
] as const;

export type PortfolioProject = {
  slug: string;
  name: string;
  category: string;
  description: string;
  overview: string;
  role: string;
  contributions: readonly string[];
  technologies: readonly string[];
  year: number;
  thumbnailUrl: string;
  url: string;
  featured: boolean;
};

export const projects: readonly PortfolioProject[] = [
  {
    slug: "roarly-ai",
    name: "Roarly AI",
    category: "AI Animation Studio",
    description:
      "Create story-driven animations and videos from simple ideas using AI-powered creative workflows.",
    overview:
      "A creative production platform that helps users move from an initial story idea to an organized animation and video workflow.",
    role: "Full-stack product development",
    contributions: [
      "AI-assisted creative workflows",
      "Story and video production tools",
      "Responsive product dashboard",
    ],
    technologies: ["Vue", "Node.js", "Tailwind CSS", "AI"],
    year: 2026,
    thumbnailUrl: "/projects/roarly-dashboard.webp",
    url: "",
    featured: true,
  },
  {
    slug: "joynosync",
    name: "JoynoSync",
    category: "Business CRM Platform",
    description:
      "Manage leads, customer relationships, communication, and sales activities in one centralized workspace.",
    overview:
      "A centralized CRM workspace designed to make business operations, customer communication, and sales activity easier to monitor and manage.",
    role: "Full-stack application development",
    contributions: [
      "CRM dashboard and reporting",
      "Lead and customer workflows",
      "Centralized business activity management",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Supabase"],
    year: 2026,
    thumbnailUrl: "/projects/joynosync-dashboard.webp",
    url: "",
    featured: true,
  },
  {
    slug: "nxone-dc-inc",
    name: "NxOne DC Inc.",
    category: "Corporate Website",
    description:
      "Designed and developed a modern corporate website that showcases the company's services and strengthens its digital presence.",
    overview:
      "A corporate website for a Philippine data-center company, presenting its AI infrastructure vision, services, and business positioning.",
    role: "Website design and development",
    contributions: [
      "Responsive corporate presentation",
      "Service-focused information architecture",
      "SEO and performance foundations",
    ],
    technologies: ["WordPress", "Elementor", "SEO"],
    year: 2026,
    thumbnailUrl: "/projects/nxone-home.webp",
    url: "https://nxonedcinc.com",
    featured: true,
  },
  {
    slug: "the-sharks-tail",
    name: "The Shark's Tail",
    category: "Dive Resort Website",
    description:
      "Built a responsive website for a Malapascua dive resort, presenting its diving experiences, accommodations, story, and booking information.",
    overview:
      "A content-rich hospitality website that helps visitors explore thresher shark diving, resort accommodations, and travel information before booking their stay.",
    role: "Wix website development",
    contributions: [
      "Responsive Wix implementation",
      "Diving and resort content structure",
      "Booking and inquiry pathways",
    ],
    technologies: ["Wix", "Responsive Design", "SEO"],
    year: 2026,
    thumbnailUrl: "/projects/sharks-tail-home.webp",
    url: "https://www.thesharkstail.com/",
    featured: false,
  },
  {
    slug: "roarly-website",
    name: "Roarly Website",
    category: "Product Website",
    description:
      "Developed a custom website for Roarly with responsive pages, interactive frontend behavior, and database-backed functionality.",
    overview:
      "A custom-built website supporting the Roarly product with a focused presentation, responsive experience, and application-connected data features.",
    role: "Full-stack website development",
    contributions: [
      "Responsive marketing pages",
      "Interactive frontend behavior",
      "MySQL-backed functionality",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "MySQL"],
    year: 2026,
    thumbnailUrl: "/projects/roarly-website-home.webp",
    url: "",
    featured: false,
  },
  {
    slug: "joyno-inc",
    name: "Joyno Inc.",
    category: "Corporate BPO Website",
    description:
      "Built a corporate website presenting Joyno Inc.'s BPO services, company philosophy, leadership, and Cebu operations.",
    overview:
      "A company website designed to communicate Joyno Inc.'s service offering, values, leadership, and commitment to creating careers in the Philippines.",
    role: "WordPress website development",
    contributions: [
      "Company and service presentation",
      "Responsive WordPress implementation",
      "Elementor content management",
    ],
    technologies: ["WordPress", "Elementor"],
    year: 2026,
    thumbnailUrl: "/projects/joyno-inc-home.webp",
    url: "https://joynoinc.com",
    featured: false,
  },
];

export const selectedProjects = projects.filter((project) => project.featured);

export const experiences = [
  {
    company: "Joyno Inc.",
    role: "Full-Stack Developer",
    period: "2026 — Present",
    dateTime: "2026",
    description:
      "Build and maintain production systems including JoynoSync, an accounting management platform, and Roarly AI Animation Studio. Develop CRM workflows, accounting modules, AI-powered features, and performance improvements across web and mobile applications.",
    technologies: [
      "Vue.js",
      "Node.js",
      "Express.js",
      "Flutter",
      "Supabase",
      "Firebase",
      "MySQL",
      "OpenAI",
    ],
  },
  {
    company: "Joyno Inc.",
    role: "Full-Stack Developer Intern",
    period: "2026 · 6 months",
    dateTime: "2026",
    description:
      "Contributed to internal products and client websites using Vue.js, Node.js, Flutter, and cloud-based backend services. Supported feature development, testing, performance optimization, and production releases across multiple projects.",
    technologies: ["Vue.js", "Node.js", "Flutter", "Supabase", "Firebase", "Tailwind CSS"],
  },
  {
    company: "Independent",
    role: "Freelance Full-Stack Developer",
    period: "2023 — Present",
    dateTime: "2023",
    description:
      "Design and develop responsive business websites for clients including NxOne DC Inc., Get Wrecked Beach & Sports Bar, Casa Amorosa, and Sharks Tail. Deliver customized WordPress builds, SEO improvements, analytics integration, and performance optimization tailored to each client's brand and business goals.",
    technologies: [
      "WordPress",
      "Elementor",
      "JavaScript",
      "Tailwind CSS",
      "Hostinger",
      "SEO",
      "Analytics",
    ],
  },
] as const;

export const selectedTechnologies = [
  "Vue.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "Flutter",
  "Supabase",
  "MySQL",
  "Tailwind CSS",
  "Cloudflare",
  "WordPress",
] as const;

export const technologyGroups = [
  {
    name: "Core Technologies",
    technologies: [
      "Vue.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Express.js",
      "Flutter",
      "Dart",
    ],
  },
  {
    name: "Database & Backend Services",
    technologies: ["Supabase", "Firebase", "MySQL"],
  },
  {
    name: "UI & Styling",
    technologies: ["Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    name: "DevOps & Cloud",
    technologies: ["Hostinger VPS", "Cloudflare", "Redis", "Nginx"],
  },
  {
    name: "CMS & Website Builders",
    technologies: ["WordPress", "Elementor", "Wix", "Webflow"],
  },
  {
    name: "Tools",
    technologies: ["Git", "GitHub", "Vite", "Postman", "Figma"],
  },
] as const;
