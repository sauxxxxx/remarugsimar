import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectStructuredData } from "@/components/structured-data";
import { siteConfig } from "@/lib/site-config";
import { getV2CaseStudyContent } from "./v2-case-study-content";
import { v2ProjectHref } from "./v2-project-data";
import type { V2CatalogueProject } from "./v2-project-catalogue";
import { V2ProjectPageHeader } from "./v2-project-page-header";
import styles from "./v2-case-study.module.css";

export function V2CaseStudy({ project, nextProject }: {
  project: V2CatalogueProject;
  nextProject: V2CatalogueProject;
}) {
  const content = getV2CaseStudyContent(project.slug);
  const nextContent = getV2CaseStudyContent(nextProject.slug);
  const inquiry = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Project inquiry inspired by ${project.name}`)}`;

  return (
    <main className={`v2-portfolio-page ${styles.page}`}>
      <a className={styles.skip} href="#v2-case-study">Skip to case study</a>
      <ProjectStructuredData project={project} basePath="/v2/projects" />
      <div className={styles.container}>
        <V2ProjectPageHeader backHref="/v2/projects" backLabel="All projects" editorial />
      </div>
      <article id="v2-case-study" tabIndex={-1}>
        <header className={`${styles.intro} ${styles.container}`}>
          <div className={styles.introCopy}>
            <h1>{project.name}</h1>
            <div>
              <p>{project.description}</p>
              {project.url ? (
                <a className={styles.textLink} href={project.url} rel="noopener noreferrer" target="_blank">
                  Visit website <ArrowUpRight aria-hidden="true" size={18} />
                </a>
              ) : (
                <a className={styles.textLink} href="#project-story">
                  Explore the project <ArrowUpRight aria-hidden="true" size={18} />
                </a>
              )}
            </div>
          </div>
          <dl className={styles.meta}>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Project</dt><dd>{project.category}</dd></div>
          </dl>
        </header>

        <figure className={`${styles.preview} ${styles.visualContainer}`}>
          <a aria-label={`Open full-size ${project.name} preview in a new tab`} href={project.thumbnailUrl} rel="noopener noreferrer" target="_blank">
            <Image alt={content.screenAlt} priority sizes="(max-width: 1440px) calc(100vw - 48px), 1392px" src={content.screen} />
          </a>
          <figcaption>
            <span>{content.caption}</span>
            <a href={project.thumbnailUrl} rel="noopener noreferrer" target="_blank">Open full preview <ArrowUpRight aria-hidden="true" size={14} /></a>
          </figcaption>
        </figure>

        <div className={styles.container}>
          <section aria-label="The problem and solution" className={styles.story} id="project-story">
            <div><h2>The problem.</h2><p>{project.challenge}</p></div>
            <div><h2>The solution.</h2><p>{project.approach}</p></div>
          </section>

          <section aria-labelledby="project-features-title" className={`${styles.features} ${project.deviceImage ? "" : styles.featuresTextOnly}`}>
            {project.deviceImage && (
              <div className={styles.device}>
                <Image alt={`${project.name} displayed on a ${project.device}`} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) 55vw, 650px" src={project.deviceImage} />
              </div>
            )}
            <div className={styles.featureCopy}>
              <h2 id="project-features-title">{content.featuresTitle}</h2>
              {content.features.map((feature) => (
                <div className={styles.feature} key={feature.title}>
                  <h3>{feature.title}</h3><p>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Project outcome and contribution" className={styles.delivery}>
            <div><h2>What it delivers.</h2><p>{project.outcome}</p></div>
            <div>
              <h2>My contribution.</h2>
              <ul className={styles.contributions}>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
              {project.technologies.length > 0 && (
                <div className={styles.tools}><h3>Built with</h3><ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
              )}
            </div>
          </section>

          <section aria-labelledby="project-contact-title" className={styles.contact}>
            <h2 id="project-contact-title">Have something in mind?</h2>
            <p>Let&apos;s talk about what you need to build.</p>
            <a className={styles.button} href={inquiry}>Discuss your project <ArrowUpRight aria-hidden="true" size={18} /></a>
          </section>

          <nav aria-label="Next V2 case study" className={styles.nextProject}>
            <Link className={styles.nextLink} href={v2ProjectHref(nextProject.slug)}>
              <div className={styles.nextCopy}>
                <span>Next project</span>
                <h2>{nextProject.name}</h2>
                <span className={styles.textLink}>View case study <ArrowUpRight aria-hidden="true" size={18} /></span>
              </div>
              <div className={styles.nextPreview}>
                <Image alt={`${nextProject.name} interface preview`} sizes="(max-width: 760px) calc(100vw - 40px), 580px" src={nextContent.screen} />
              </div>
            </Link>
          </nav>
        </div>
      </article>
      <footer className={`${styles.footer} ${styles.container}`}>
        <Link href="/v2">Remar Ugsimar <span>Full-stack developer</span></Link>
        <Link className={styles.textLink} href="/v2/projects">All projects <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </footer>
    </main>
  );
}
