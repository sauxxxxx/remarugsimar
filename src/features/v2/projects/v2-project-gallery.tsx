import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getV2CaseStudyContent } from "./v2-case-study-content";
import { v2ProjectCatalogue } from "./v2-project-catalogue";
import { v2ProjectHref } from "./v2-project-data";
import { V2ProjectPageHeader } from "./v2-project-page-header";
import styles from "./v2-project-gallery.module.css";

export function V2ProjectGallery() {
  return (
    <main className={`v2-portfolio-page ${styles.page}`}>
      <a className={styles.skip} href="#v2-work">Skip to projects</a>
      <div className={styles.container}>
        <V2ProjectPageHeader backHref="/v2" backLabel="Portfolio" editorial />
        <section aria-labelledby="v2-work-title" id="v2-work" tabIndex={-1}>
          <header className={styles.intro}>
            <h1 id="v2-work-title">All projects.</h1>
            <div className={styles.summary}>
              <p>Software and websites built around real workflows.</p>
              <span>{v2ProjectCatalogue.length} projects</span>
            </div>
          </header>
          <div className={styles.gallery}>
            {v2ProjectCatalogue.map((project, index) => {
              const { screen, screenAlt, categoryLabel } = getV2CaseStudyContent(project.slug);
              return (
                <article className={styles.project} key={project.slug}>
                  <Link aria-label={`View ${project.name} case study`} className={styles.projectLink} href={v2ProjectHref(project.slug)}>
                    <div className={styles.preview}>
                      <Image
                        alt={screenAlt}
                        priority={index < 2}
                        sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1264px) calc((100vw - 96px) / 2), 584px"
                        src={screen}
                      />
                    </div>
                    <div className={styles.projectCaption}>
                      <div><h2>{project.name}</h2><p>{categoryLabel}</p></div>
                      <ArrowUpRight aria-hidden="true" size={22} />
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
        <section aria-labelledby="gallery-contact-title" className={styles.contact}>
          <h2 id="gallery-contact-title">Have something in mind?</h2>
          <p>Let&apos;s talk about what you need to build.</p>
          <a className={styles.button} href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Project inquiry")}`}>
            Discuss your project <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </section>
        <footer className={styles.footer}>
          <Link href="/v2">Remar Ugsimar <span>Full-stack developer</span></Link>
          <Link className={styles.textLink} href="/v2">Back to portfolio <ArrowUpRight aria-hidden="true" size={18} /></Link>
        </footer>
      </div>
    </main>
  );
}
