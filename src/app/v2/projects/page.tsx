import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { v2Projects, v2ProjectHref } from "@/features/v2/projects/v2-project-data";
import { V2ProjectPageHeader } from "@/features/v2/projects/v2-project-page-header";
import styles from "@/features/v2/projects/v2-project-pages.module.css";

export const metadata: Metadata = {
  title: "Selected work — V2",
  description: "Six projects across lead discovery, CRM, accounting, AI animation, and business websites.",
  alternates: { canonical: "/v2/projects" },
};

export default function V2ProjectsPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#v2-work">Skip to projects</a>
      <div className={styles.container}>
        <V2ProjectPageHeader />
        <section className={styles.intro} id="v2-work" tabIndex={-1}>
          <p className={styles.eyebrow}>Selected work / 06</p>
          <h1>Built around<br /><em>real work.</em></h1>
          <p>From finding the next lead to managing the books. Six projects connecting useful software with the people who need it.</p>
        </section>
        <section aria-label="V2 project case studies">
          {v2Projects.map((project, index) => (
            <article className={styles.projectRow} key={project.slug}>
              <div className={styles.projectCopy}>
                <p className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / {project.category}</p>
                <h2><Link href={v2ProjectHref(project.slug)}>{project.name}</Link></h2>
                <p>{project.description}</p>
                <ul className={styles.tags} aria-label={`${project.name} highlights`}>
                  {project.highlights.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <Link className={styles.action} href={v2ProjectHref(project.slug)}>View case study <ArrowUpRight aria-hidden="true" size={18} /></Link>
              </div>
              <Link aria-label={`View ${project.name} case study`} className={styles.deviceVisual} href={v2ProjectHref(project.slug)}>
                <Image alt={`${project.name} ${project.device} mockup`} fill priority={index === 0} sizes="(max-width: 760px) calc(100vw - 40px), 58vw" src={project.deviceImage} />
              </Link>
            </article>
          ))}
        </section>
        <footer className={styles.footer}><Link href="/#v2-contact">Have a project in mind? <ArrowUpRight aria-hidden="true" size={18} /></Link><Link href="/">Back to portfolio</Link></footer>
      </div>
    </main>
  );
}
