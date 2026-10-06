import type { Metadata } from "next";
import { HomeStructuredData } from "@/components/structured-data";
import { v2Projects } from "@/features/v2/projects/v2-project-data";
import { V2Entrance } from "@/features/v2/v2-entrance";
import { V2EntranceBoot } from "@/features/v2/v2-entrance-boot";
import { V2ScrollExperience } from "@/features/v2/v2-scroll-experience";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HomeStructuredData projectList={v2Projects} basePath="/v2/projects" />
      <V2EntranceBoot />
      <V2Entrance />
      <V2ScrollExperience />
    </>
  );
}
