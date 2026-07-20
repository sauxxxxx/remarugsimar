import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SitePageHeader } from "@/components/site-page-header";
import { TechnologyTags } from "@/components/technology-tags";
import { ProjectGallery } from "@/components/project-gallery";
import { TranslatedText } from "@/features/translation/translation-provider";
import { projects } from "@/lib/portfolio-data";
import { siteConfig, socialImage } from "@/lib/site-config";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: `${project.name} — ${siteConfig.name}`,
      description: project.description,
      images: [socialImage],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  if (projectIndex === -1) notFound();

  const project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className="projects-page content-page">
      <SitePageHeader backHref="/projects" backLabel="all projects" />
      <article className="case-study">
        <div className="case-study__hero">
          <div className="case-study__visual">
            <Image alt={`${project.name} interface preview`} fill priority sizes="(max-width: 767px) calc(100vw - 40px), 55vw" src={project.thumbnailUrl} unoptimized />
          </div>
          <div className="case-study__summary">
            <p className="case-study__eyebrow"><TranslatedText text="project case study" /> / {String(projectIndex + 1).padStart(2, "0")}</p>
            <h1>{project.name}</h1>
            <p><TranslatedText text={project.overview} /></p>
            <div className="case-study__meta">
              <span><strong><TranslatedText text="Type" /></strong><TranslatedText text={project.category} /></span>
              <span><strong><TranslatedText text="Year" /></strong>{project.year}</span>
              <span><strong><TranslatedText text="Role" /></strong><TranslatedText text={project.role} /></span>
              <span><strong><TranslatedText text="Status" /></strong><TranslatedText text={project.url ? "Live website" : "Private project"} /></span>
            </div>
          </div>
        </div>

        <div className="case-study__narrative">
          {[
            { number: "01", title: "Challenge", body: project.challenge },
            { number: "02", title: "Approach", body: project.approach },
            { number: "03", title: "Outcome", body: project.outcome },
          ].map((chapter) => (
            <section className="case-study__chapter" key={chapter.title}>
              <span>{chapter.number}</span>
              <h2><TranslatedText text={chapter.title} /></h2>
              <p><TranslatedText text={chapter.body} /></p>
            </section>
          ))}
        </div>

        <ProjectGallery projectName={project.name} screenshots={project.screenshots} />

        <div className="case-study__sections">
          <section className="case-study__section">
            <h2><TranslatedText text="My contribution" /></h2>
            <ul>
              {project.contributions.map((contribution) => (
                <li key={contribution}><TranslatedText text={contribution} /></li>
              ))}
            </ul>
          </section>
          <section className="case-study__section">
            <h2><TranslatedText text="Technology" /></h2>
            <TechnologyTags label={`${project.name} technologies`} technologies={project.technologies} />
          </section>
        </div>

        <div className="case-study__actions">
          {project.url ? (
            <a href={project.url} rel="noreferrer" target="_blank"><TranslatedText text="visit website" /> <span aria-hidden="true">↗</span></a>
          ) : <span><TranslatedText text="private project" /></span>}
        </div>
        <nav aria-label="Next case study" className="case-study__next">
          <span><TranslatedText text="Next case study" /></span>
          <Link href={`/projects/${nextProject.slug}`}>{nextProject.name} <span aria-hidden="true">→</span></Link>
        </nav>
      </article>
    </main>
  );
}
