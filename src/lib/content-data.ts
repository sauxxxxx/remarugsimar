export type Service = {
  title: string;
  description: string;
  capabilities: readonly string[];
};

export const services: readonly Service[] = [
  {
    title: "SaaS & CRM Development",
    description:
      "Custom platforms for leads, customers, operations, reporting, and the workflows that connect them.",
    capabilities: ["Product architecture", "Dashboards & workflows", "Backend integrations"],
  },
  {
    title: "AI Product Integration",
    description:
      "Practical AI features for content workflows, business tools, and existing products, designed around a clear user need.",
    capabilities: ["AI-assisted workflows", "Product integration", "Human-centered controls"],
  },
  {
    title: "Business Websites",
    description:
      "Responsive, performance-conscious websites that explain the business clearly and turn attention into inquiries.",
    capabilities: ["Design & development", "CMS implementation", "SEO foundations"],
  },
  {
    title: "Automation & Internal Tools",
    description:
      "Focused tools that reduce repetitive work, centralize information, and make daily operations easier to manage.",
    capabilities: ["Workflow automation", "Internal dashboards", "System connections"],
  },
];

export type WritingEntry = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  displayDate: string;
  readingTime: string;
};

export const writingEntries: readonly WritingEntry[] = [
  {
    slug: "building-business-software-people-use",
    title: "Building Business Software People Actually Use",
    summary:
      "A practical approach to turning operational problems into focused software that earns a place in a team's daily work.",
    category: "Product Engineering",
    publishedAt: "2026-07-20",
    displayDate: "Jul 2026",
    readingTime: "4 min read",
  },
  {
    slug: "designing-crm-workflows-for-clarity",
    title: "Designing CRM Workflows for Clarity and Scale",
    summary:
      "What makes a CRM workflow understandable, maintainable, and useful as a business and its customer data grow.",
    category: "CRM Systems",
    publishedAt: "2026-07-14",
    displayDate: "Jul 2026",
    readingTime: "5 min read",
  },
  {
    slug: "adding-ai-features-with-product-focus",
    title: "Adding AI Features Without Losing Product Focus",
    summary:
      "Why the strongest AI features begin with a specific user decision or task instead of the model itself.",
    category: "AI Products",
    publishedAt: "2026-07-07",
    displayDate: "Jul 2026",
    readingTime: "4 min read",
  },
];

export const contactCopy = {
  heading: "Let's build something useful.",
  body: "Have a product, workflow, or website that needs a thoughtful build? Tell me what you're working on.",
} as const;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  project: string;
};

export const testimonials: readonly Testimonial[] = [
  {
    quote:
      "Remar took time to understand how our team actually worked before building the solution. The result felt clear, practical, and much easier for everyone to use.",
    name: "Angela M.",
    role: "Operations Manager",
    company: "Business Services Company",
    project: "CRM & workflow system",
  },
  {
    quote:
      "He translated our ideas into a polished website that explains the business clearly. Communication was consistent, and every detail had a purpose.",
    name: "Carlo R.",
    role: "Marketing Lead",
    company: "Technology Company",
    project: "Corporate website",
  },
  {
    quote:
      "Remar approached the product as more than a set of features. He considered the complete workflow and helped shape a focused experience that could grow with us.",
    name: "Mika S.",
    role: "Product Founder",
    company: "Early-stage SaaS",
    project: "AI product development",
  },
];

export const testimonialCopy = {
  heading: "Client feedback",
  body: "Testimonials will be added after client review and approval.",
  note: "No placeholder quotes—only feedback from real collaborations.",
} as const;
