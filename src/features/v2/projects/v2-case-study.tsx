import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ProjectStructuredData } from "@/components/structured-data";
import { siteConfig } from "@/lib/site-config";
import { V2Finale } from "../closing/v2-finale";
import { V2SiteNav } from "../nav/v2-site-nav";
import { V2AmbientBackdrop } from "../ribbons/v2-ambient-backdrop";
import { V2HeroZoom, V2PanelRibbons, V2RevealRoot } from "./v2-case-study-motion";
import { getV2CaseStudyContent } from "./v2-case-study-content";
import { v2ProjectHref } from "./v2-project-data";
import type { V2CatalogueProject } from "./v2-project-catalogue";
import { V2ProjectPageHeader } from "./v2-project-page-header";
import { SHARED_IMAGE_NAME } from "./v2-shared-image-name";
import { V2HeroImageReady, V2SharedImageLink } from "./v2-shared-image";
import styles from "./v2-case-study.module.css";

const delay = (index: number) => ({ "--v2-reveal-delay": `${80 + index * 90}ms` }) as CSSProperties;

export function V2CaseStudy({ project, nextProject }: {
  project: V2CatalogueProject;
  nextProject: V2CatalogueProject;
}) {
  const content = getV2CaseStudyContent(project.slug);
  const nextContent = getV2CaseStudyContent(nextProject.slug);
  const inquiry = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Project inquiry inspired by ${project.name}`)}`;

  return (
    <main className={`v2-portfolio-page ${styles.page}`}>
      <V2AmbientBackdrop />
      <a className={styles.skip} href="#v2-case-study">Skip to case study</a>
      <V2SiteNav
        brandHref="/"
        cta={{ label: "Let's talk", href: inquiry, contact: project.name }}
        items={[
          { label: "Portfolio", href: "/" },
          { label: "All projects", href: "/v2/projects" },
          { label: `Next: ${nextProject.name}`, href: v2ProjectHref(nextProject.slug) },
        ]}
      />
      <ProjectStructuredData project={project} basePath="/v2/projects" />
      <div className={styles.wide}>
        <V2ProjectPageHeader backHref="/v2/projects" backLabel="All projects" editorial returnSlug={project.slug} />
      </div>

      <V2RevealRoot>
        <article id="v2-case-study" tabIndex={-1}>
          {/* Opening: category, name, lead line and the facts, on the gallery's wide margins. */}
          <header className={`${styles.intro} ${styles.wide}`}>
            <p className={styles.category} data-v2-reveal="copy">{content.categoryLabel}</p>
            <h1 data-v2-reveal="heading">{project.name}</h1>
            <div className={styles.introRow} data-v2-reveal="copy">
              <p className={styles.lede}>{project.description}</p>
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
            <dl className={styles.meta} data-v2-reveal="visual">
              <div><dt>Role</dt><dd>{project.role}</dd></div>
              <div><dt>Year</dt><dd>{project.year}</dd></div>
              <div><dt>Project</dt><dd>{project.category}</dd></div>
            </dl>
          </header>

          {/* The screenshot the gallery card morphs into; it eases in as the page scrolls. */}
          <figure className={`${styles.preview} ${styles.wide}`}>
            <a
              aria-label={`Open full-size ${project.name} preview in a new tab`}
              className={styles.heroLink}
              data-v2-hero-image
              href={project.thumbnailUrl}
              rel="noopener noreferrer"
              style={{ viewTransitionName: SHARED_IMAGE_NAME }}
              target="_blank"
            >
              <V2HeroZoom className={styles.heroZoom}>
                <Image alt={content.screenAlt} priority sizes="(max-width: 760px) calc(100vw - 40px), min(1800px, 92vw)" src={content.screen} />
              </V2HeroZoom>
            </a>
            <figcaption>
              <span>{content.caption}</span>
              <a href={project.thumbnailUrl} rel="noopener noreferrer" target="_blank">Open full preview <ArrowUpRight aria-hidden="true" size={14} /></a>
            </figcaption>
          </figure>

          {/* The story: each heading stays pinned while its text scrolls beside it. */}
          <section aria-label="The problem and solution" className={`${styles.story} ${styles.container}`} id="project-story">
            <div className={styles.chapter}>
              <h2 data-v2-reveal="heading">The problem.</h2>
              <p data-v2-reveal="copy">{project.challenge}</p>
            </div>
            <div className={styles.chapter}>
              <h2 data-v2-reveal="heading">The solution.</h2>
              <p data-v2-reveal="copy">{project.approach}</p>
            </div>
          </section>

          {/* Features in a glass panel, with the ribbons behind. */}
          <section
            aria-labelledby="project-features-title"
            className={`${styles.features} ${project.deviceImage ? "" : styles.featuresTextOnly}`}
          >
            <V2PanelRibbons canvasClassName={styles.panelCanvas} className={styles.panelRibbons} />
            <div className={styles.featuresInner}>
              {project.deviceImage && (
                <div className={styles.device} data-v2-reveal="visual">
                  <Image alt={`${project.name} displayed on a ${project.device}`} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) 55vw, 820px" src={project.deviceImage} />
                </div>
              )}
              <div className={styles.featureCopy}>
                <h2 data-v2-reveal="heading" id="project-features-title">{content.featuresTitle}</h2>
                <div className={styles.featureList}>
                  {content.features.map((feature, index) => (
                    <div className={styles.feature} data-v2-reveal="copy" key={feature.title} style={delay(index)}>
                      <h3>{feature.title}</h3><p>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* What it delivers: the outcome as a statement, then the contribution and the tools. */}
          <section aria-labelledby="project-delivery-title" className={`${styles.delivery} ${styles.container}`}>
            <h2 className={styles.deliveryLabel} data-v2-reveal="copy" id="project-delivery-title">What it delivers.</h2>
            <p className={styles.statement} data-v2-reveal="heading">{project.outcome}</p>
            <div className={styles.deliveryGrid}>
              <div data-v2-reveal="copy">
                <h3>My contribution</h3>
                <ul className={styles.contributions}>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              {project.technologies.length > 0 && (
                <div data-v2-reveal="copy" style={delay(1)}>
                  <h3>Built with</h3>
                  <ul className={styles.tools}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                </div>
              )}
            </div>
          </section>
        </article>
      </V2RevealRoot>

      <V2Finale
        actionHref={inquiry}
        actionLabel="Discuss your project"
        contactContext={project.name}
        headingId="project-contact-title"
        headline="Have something in mind?"
        lede="Let's talk about what you need to build."
      />

      {/* Next project: a large card that morphs into the next case study. */}
      <nav aria-label="Next V2 case study" className={`${styles.nextProject} ${styles.wide}`}>
        <V2SharedImageLink className={styles.nextCard} href={v2ProjectHref(nextProject.slug)}>
          <div className={styles.nextPreview} data-v2-shared-image>
            <Image alt={`${nextProject.name} interface preview`} sizes="(max-width: 760px) calc(100vw - 40px), min(1800px, 92vw)" src={nextContent.screen} />
          </div>
          <div className={styles.nextCopy}>
            <span>Next project</span>
            <h2>{nextProject.name}</h2>
            <span className={styles.textLink}>View case study <ArrowUpRight aria-hidden="true" size={18} /></span>
          </div>
        </V2SharedImageLink>
      </nav>

      <footer className={`${styles.footer} ${styles.wide}`}>
        <Link href="/">Remar Ugsimar <span>Full-stack developer</span></Link>
        <nav aria-label="Footer" className={styles.footerLinks}>
          <Link href="/">Portfolio</Link>
          <a data-v2-contact={project.name} href={inquiry}>Let&apos;s talk</a>
          <V2SharedImageLink className={styles.textLink} fromHero href="/v2/projects" returnTo={project.slug}>All projects <ArrowUpRight aria-hidden="true" size={18} /></V2SharedImageLink>
        </nav>
      </footer>
      <V2HeroImageReady />
    </main>
  );
}
