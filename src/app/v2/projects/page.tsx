import type { Metadata } from "next";
import { V2ProjectGallery } from "@/features/v2/projects/v2-project-gallery";
import { v2ProjectCatalogue } from "@/features/v2/projects/v2-project-catalogue";
import { siteConfig, socialImage } from "@/lib/site-config";

const title = `Projects — ${siteConfig.name}`;
const description = `${v2ProjectCatalogue.length} projects by ${siteConfig.name}: CRM and lead generation, accounting systems, AI tools, and business websites.`;

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/v2/projects" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/v2/projects",
    siteName: `${siteConfig.name} Portfolio`,
    title,
    description,
    images: [socialImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [socialImage.url] },
};

export default function V2ProjectsPage() {
  return <V2ProjectGallery />;
}
