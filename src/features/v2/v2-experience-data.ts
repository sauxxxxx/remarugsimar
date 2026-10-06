import { experiences } from "@/lib/portfolio-data";

export const v2Experiences = experiences.map((experience, index) => (
  index === 0
    ? {
        ...experience,
        description: "Build and maintain production systems including Scout, JoynoSync, Joyno Accounting, and CasaToon. Develop lead discovery, CRM workflows, accounting modules, and AI-powered features across web and mobile applications.",
      }
    : experience
));
