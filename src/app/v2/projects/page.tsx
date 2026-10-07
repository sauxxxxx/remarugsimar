import type { Metadata } from "next";
import { V2ProjectGallery } from "@/features/v2/projects/v2-project-gallery";
import { v2ProjectCatalogue } from "@/features/v2/projects/v2-project-catalogue";

export const metadata: Metadata = {
  title: "All projects — V2",
  description: `${v2ProjectCatalogue.length} projects across CRM, accounting, AI-assisted tools, and business websites.`,
  alternates: { canonical: "/v2/projects" },
};

export default function V2ProjectsPage() {
  return <V2ProjectGallery />;
}
