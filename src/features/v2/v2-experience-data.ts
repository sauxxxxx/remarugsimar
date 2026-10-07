import { experiences } from "@/lib/portfolio-data";

export const v2Experiences = experiences.map((experience, index) => (
  index === 0
    ? {
        ...experience,
        description: "Build and maintain production systems including Scout, JoynoSync, Joyno Accounting, and CasaToon. Develop lead discovery, CRM workflows, accounting modules, and AI-powered features across web and mobile applications.",
      }
    : experience
));

const careerStages = [
  { id: "freelance", role: "Freelance Full-Stack Developer", label: "Freelance", summary: "Business websites, SEO, analytics, and performance.", color: "#ffb29d", coreTools: ["WordPress", "Elementor", "JavaScript", "Tailwind CSS"], projects: ["nxone-dc-inc"] },
  { id: "internship", role: "Full-Stack Developer Intern", label: "Internship", summary: "Internal products, client websites, and production releases.", color: "#c6b1ff", coreTools: ["Vue.js", "Node.js", "Flutter", "Firebase"], projects: [] },
  { id: "developer", role: "Full-Stack Developer", label: "Full-Stack Developer", summary: "Sales, operations, accounting, and AI-powered tools.", color: "#99c8ff", coreTools: ["Vue.js", "Node.js", "Flutter", "Supabase"], projects: ["scout", "joynosync", "joyno-accounting", "casatoon"] },
] as const;

export const v2CareerStops = careerStages.map((stage) => {
  const experience = v2Experiences.find((item) => item.role === stage.role);
  if (!experience) throw new Error(`Missing career experience: ${stage.role}`);
  return { ...experience, ...stage };
});
