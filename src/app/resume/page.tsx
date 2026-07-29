import type { Metadata } from "next";
import Link from "next/link";
import { ResumePrintButton } from "@/components/resume-print-button";
import { SitePageHeader } from "@/components/site-page-header";
import {
  experiences,
  profileCopy,
  profileLinks,
  selectedProjects,
  selectedTechnologies,
} from "@/lib/portfolio-data";
import { siteConfig, socialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Experience, selected work, and technical skills for ${siteConfig.name}.`,
  alternates: { canonical: "/resume" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/resume",
    siteName: `${siteConfig.name} Portfolio`,
    title: `Résumé — ${siteConfig.name}`,
    description: `Experience, selected work, and technical skills for ${siteConfig.name}.`,
    images: [{ ...socialImage, alt: `Résumé — ${siteConfig.name}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Résumé — ${siteConfig.name}`,
    description: `Experience, selected work, and technical skills for ${siteConfig.name}.`,
    images: [socialImage.url],
  },
};

export default function ResumePage() {
  const socialLinks = profileLinks.filter((link) =>
    ["github", "linkedin"].includes(link.label),
  );

  return (
    <>
      <a className="skip-link" href="#resume">Skip to résumé</a>
      <main className="projects-page content-page resume-page" id="resume" tabIndex={-1}>
        <SitePageHeader />

      <article className="resume">
        <header className="resume__header">
          <div>
            <p className="resume__eyebrow">résumé / 2026</p>
            <h1>{siteConfig.name}</h1>
            <p className="resume__title">{profileCopy.title}</p>
            <p className="resume__summary">{profileCopy.introduction}</p>
          </div>

          <div className="resume__contact">
            <span>{siteConfig.location.city}, {siteConfig.location.country}</span>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            {socialLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </header>

        <div className="resume__actions">
          <ResumePrintButton />
          <a href={`mailto:${siteConfig.email}?subject=Project%20inquiry`}>
            discuss a project <span aria-hidden="true">↗</span>
          </a>
        </div>

        <section className="resume__section" aria-labelledby="resume-experience">
          <h2 id="resume-experience">Experience</h2>
          <div className="resume__entries">
            {experiences.map((experience) => (
              <article
                className="resume__entry"
                key={`${experience.company}-${experience.role}`}
              >
                <div className="resume__entry-meta">
                  <time dateTime={experience.dateTime}>{experience.period}</time>
                  <span>{experience.company}</span>
                </div>
                <div>
                  <h3>{experience.role}</h3>
                  <p>{experience.description}</p>
                  <p className="resume__entry-stack">
                    {experience.technologies.join(" · ")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="resume__section" aria-labelledby="resume-work">
          <h2 id="resume-work">Selected work</h2>
          <div className="resume__work-grid">
            {selectedProjects.map((project) => (
              <article key={project.slug}>
                <div>
                  <h3>
                    <Link href={`/projects/${project.slug}`}>{project.name} ↗</Link>
                  </h3>
                  <span>{project.category} · {project.year}</span>
                </div>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="resume__section resume__section--skills" aria-labelledby="resume-skills">
          <h2 id="resume-skills">Selected technologies</h2>
          <p>{selectedTechnologies.join(" · ")}</p>
        </section>
        </article>
      </main>
    </>
  );
}
