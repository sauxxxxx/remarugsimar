import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ProjectStructuredData } from "@/components/structured-data";
import { v2Projects, v2ProjectHref } from "@/features/v2/projects/v2-project-data";
import { V2ProjectPageHeader } from "@/features/v2/projects/v2-project-page-header";
import { siteConfig } from "@/lib/site-config";
import styles from "@/features/v2/projects/v2-project-pages.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return v2Projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = v2Projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — V2 case study`,
    description: project.description,
    alternates: { canonical: v2ProjectHref(slug) },
    openGraph: { type: "article", title: project.name, description: project.description, url: v2ProjectHref(slug), images: [{ url: project.thumbnailUrl, alt: project.name }] },
  };
}

export default async function V2CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = v2Projects.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const project = v2Projects[index];
  const next = v2Projects[(index + 1) % v2Projects.length];
  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#v2-case-study">Skip to case study</a>
      <ProjectStructuredData project={project} basePath="/v2/projects" />
      <div className={styles.container}>
        <V2ProjectPageHeader backHref="/v2/projects" backLabel="All projects" />
        <article id="v2-case-study" tabIndex={-1}>
          <header className={styles.caseIntro}>
            <p className={styles.eyebrow}>Case study / {String(index + 1).padStart(2, "0")} / {project.category}</p>
            <h1>{project.name}</h1>
            <p>{project.overview}</p>
            <dl className={styles.meta}>
              <div><dt>Role</dt><dd>{project.role}</dd></div>
              <div><dt>Year</dt><dd>{project.year}</dd></div>
              <div><dt>Focus</dt><dd>{project.category}</dd></div>
            </dl>
          </header>
          <div className={styles.caseDevice}>
            <Image alt={`${project.name} on a ${project.device}`} fill priority sizes="(max-width: 1200px) calc(100vw - 40px), 1160px" src={project.deviceImage} />
          </div>
          <div className={styles.chapters}>
            {[
              { title: "The challenge", copy: project.challenge },
              { title: "The approach", copy: project.approach },
              { title: "The result", copy: project.outcome },
            ].map((chapter, chapterIndex) => (
              <section className={styles.chapter} key={chapter.title}>
                <span className={styles.eyebrow}>0{chapterIndex + 1}</span>
                <h2>{chapter.title}</h2><p>{chapter.copy}</p>
              </section>
            ))}
          </div>
          <section className={styles.contributions}>
            <h2>My contribution</h2>
            <ul>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
            {project.technologies.length > 0 && <ul className={styles.tags} aria-label="Technologies">{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
          <figure className={styles.screenshot}>
            <Image alt={`${project.name} interface screenshot`} width={1920} height={1080} sizes="(max-width: 1200px) calc(100vw - 40px), 1160px" src={project.thumbnailUrl} />
            <figcaption>{project.slug === "casatoon" ? "Product screenshot from the earlier Roarly AI version, now CasaToon." : `${project.name} — interface overview`}</figcaption>
          </figure>
          <div className={styles.caseActions}>
            <a className={styles.action} href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Project inquiry inspired by ${project.name}`)}`}>Discuss a similar project <ArrowUpRight aria-hidden="true" size={18} /></a>
            {project.url && <a className={styles.action} href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight aria-hidden="true" size={18} /></a>}
          </div>
          <nav aria-label="Next V2 case study" className={styles.nextProject}>
            <p className={styles.eyebrow}>Next case study</p>
            <Link href={v2ProjectHref(next.slug)}>{next.name}<ArrowUpRight aria-hidden="true" size={28} /></Link>
          </nav>
        </article>
        <footer className={styles.footer}><Link href="/v2/projects">All projects</Link><Link href="/">Back to portfolio</Link></footer>
      </div>
    </main>
  );
}
