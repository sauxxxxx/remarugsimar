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
  { id: "freelance", role: "Freelance Full-Stack Developer", label: "Freelance", color: "#ffb29d", projects: ["nxone-dc-inc"] },
  { id: "internship", role: "Full-Stack Developer Intern", label: "Internship", color: "#c6b1ff", projects: [] },
  { id: "developer", role: "Full-Stack Developer", label: "Full-Stack Developer", color: "#99c8ff", projects: ["scout", "joynosync", "joyno-accounting", "casatoon"] },
] as const;

export const v2CareerStops = careerStages.map((stage) => {
  const experience = v2Experiences.find((item) => item.role === stage.role);
  if (!experience) throw new Error(`Missing career experience: ${stage.role}`);
  return { ...experience, ...stage };
});
