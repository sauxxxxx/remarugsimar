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
  challenge: string;
  approach: string;
  outcome: string;
  role: string;
  contributions: readonly string[];
  technologies: readonly string[];
  year: number;
  thumbnailUrl: string;
  screenshots: readonly ProjectScreenshot[];
  url: string;
  featured: boolean;
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
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
    challenge:
      "Turning a short idea into an animated video involves many connected decisions: story structure, characters, scenes, assets, generation tasks, and final output. The product needed to keep that process understandable while AI work happened across multiple stages.",
    approach:
      "I helped shape a structured production workspace around projects rather than isolated AI prompts. The experience brings creation tools, reusable assets, progress states, credits, and recent work into one dashboard so users can move through the workflow without losing context.",
    outcome:
      "The resulting product provides a clearer path from idea to production. Complex AI operations are presented as manageable creative steps, with the surrounding application keeping projects, resources, and generation activity organized.",
    role: "Full-stack product development",
    contributions: [
      "AI-assisted creative workflows",
      "Story and video production tools",
      "Responsive product dashboard",
    ],
    technologies: ["Vue", "Node.js", "Tailwind CSS", "AI"],
    year: 2026,
    thumbnailUrl: "/projects/roarly-dashboard.webp",
    screenshots: [],
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
    challenge:
      "Customer information, sales activity, communications, and follow-ups can quickly become fragmented across tools. The CRM needed to give teams one reliable workspace without making day-to-day actions feel buried beneath reporting complexity.",
    approach:
      "I worked across the application to organize leads, contacts, accounts, deals, tasks, communication, and attendance into connected workflows. Dashboard summaries provide context, while detailed modules let users move directly from an insight to the records that need attention.",
    outcome:
      "JoynoSync brings operational and customer activity into a shared system. Teams can understand pipeline movement, ownership, communication history, and upcoming work from a consistent interface designed to support daily decision-making.",
    role: "Full-stack application development",
    contributions: [
      "CRM dashboard and reporting",
      "Lead and customer workflows",
      "Centralized business activity management",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Supabase"],
    year: 2026,
    thumbnailUrl: "/projects/joynosync-dashboard.webp",
    screenshots: [],
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
    challenge:
      "NxOne needed a credible digital presence for a technically complex and forward-looking business. The website had to explain its data-center and AI infrastructure direction clearly to potential partners without overwhelming them with industry language.",
    approach:
      "I organized the experience around the company's positioning, solutions, and a direct path to expert contact. The WordPress and Elementor implementation uses a responsive visual hierarchy, focused service messaging, and foundational search optimization for maintainable publishing.",
    outcome:
      "The finished website gives NxOne a focused corporate destination for presenting its vision and services. Visitors can understand the company's role in Philippine AI infrastructure and reach the team through a clear inquiry path.",
    role: "Website design and development",
    contributions: [
      "Responsive corporate presentation",
      "Service-focused information architecture",
      "SEO and performance foundations",
    ],
    technologies: ["WordPress", "Elementor", "SEO"],
    year: 2026,
    thumbnailUrl: "/projects/nxone-home.webp",
    screenshots: [],
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
    challenge:
      "The resort offers both a destination and a specialized diving experience, so the website needed to answer practical travel questions while still communicating the character of Malapascua and its thresher shark encounters.",
    approach:
      "I structured the Wix website around the information guests consider before booking: diving experiences, accommodations, the resort story, location details, and inquiry options. Responsive layouts keep photography and essential details readable across devices.",
    outcome:
      "The website gives prospective guests a coherent path from discovery to inquiry. Resort information and diving content now live in one branded destination that the team can continue managing through Wix.",
    role: "Wix website development",
    contributions: [
      "Responsive Wix implementation",
      "Diving and resort content structure",
      "Booking and inquiry pathways",
    ],
    technologies: ["Wix", "Responsive Design", "SEO"],
    year: 2026,
    thumbnailUrl: "/projects/sharks-tail-home.webp",
    screenshots: [],
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
    challenge:
      "Roarly needed a web presence that could explain the product clearly while supporting interactive and database-backed functionality beyond a conventional static marketing page.",
    approach:
      "I developed responsive pages with custom HTML, CSS, and JavaScript, then connected the required data features to MySQL. The interface was kept focused on product communication while leaving room for application-specific interactions.",
    outcome:
      "The result is a custom product website that combines marketing content with functional data-backed behavior. Its implementation can evolve alongside the wider Roarly product instead of being limited by a page-builder template.",
    role: "Full-stack website development",
    contributions: [
      "Responsive marketing pages",
      "Interactive frontend behavior",
      "MySQL-backed functionality",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "MySQL"],
    year: 2026,
    thumbnailUrl: "/projects/roarly-website-home.webp",
    screenshots: [],
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
    challenge:
      "Joyno needed a corporate website that could establish trust with prospective clients while also communicating the company's culture, leadership, and presence in Cebu to potential team members.",
    approach:
      "I built the WordPress and Elementor experience around clear company, service, leadership, and career content. Reusable page sections and responsive layouts make the site easier to maintain while preserving a consistent corporate presentation.",
    outcome:
      "The completed website provides Joyno with a central, maintainable platform for communicating its BPO services and company identity to both business and recruitment audiences.",
    role: "WordPress website development",
    contributions: [
      "Company and service presentation",
      "Responsive WordPress implementation",
      "Elementor content management",
    ],
    technologies: ["WordPress", "Elementor"],
    year: 2026,
    thumbnailUrl: "/projects/joyno-inc-home.webp",
    screenshots: [],
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
