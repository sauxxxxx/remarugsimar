import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { V2CaseStudy } from "@/features/v2/projects/v2-case-study";
import { v2ProjectHref } from "@/features/v2/projects/v2-project-data";
import { v2ProjectCatalogue } from "@/features/v2/projects/v2-project-catalogue";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return v2ProjectCatalogue.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = v2ProjectCatalogue.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — V2 case study`,
    description: project.description,
    alternates: { canonical: v2ProjectHref(slug) },
    openGraph: {
      type: "article",
      title: project.name,
      description: project.description,
      url: v2ProjectHref(slug),
      images: [{ url: project.thumbnailUrl, alt: project.name }],
    },
  };
}

export default async function V2CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = v2ProjectCatalogue.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  return (
    <V2CaseStudy
      project={v2ProjectCatalogue[index]}
      nextProject={v2ProjectCatalogue[(index + 1) % v2ProjectCatalogue.length]}
    />
  );
}
