import Link from "next/link";
import { ResumePrintButton } from "@/components/resume-print-button";
import { SitePageHeader } from "@/components/site-page-header";
import { careerDocuments, getCareerContent, type CareerDocumentKind } from "./career-content";

export function CareerDocument({ kind }: { kind: CareerDocumentKind }) {
  const { profile, document, experience, projects, education, skills } = getCareerContent(kind);
  const detailed = kind === "cv";
  const alternate = careerDocuments[detailed ? "resume" : "cv"];

  return (
    <>
      <a className="skip-link" href="#career-document">Skip to {document.label.toLowerCase()}</a>
      <main className="projects-page content-page resume-page" id="career-document" tabIndex={-1}>
        <SitePageHeader />
        <article className={`resume ${detailed ? "resume--cv" : ""}`}>
          <header className="resume__header">
            <div>
              <p className="resume__eyebrow">{document.label} / {profile.updatedLabel}</p>
              <h1>{profile.name}</h1>
              <p className="resume__title">{profile.title}</p>
              <p className="resume__summary">{profile.summary}</p>
            </div>
            <div className="resume__contact">
              <span>{profile.location}</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={profile.website}>remarugsimar.com</a>
              {profile.links.map((link) => (
                <a href={link.href} key={link.label} rel="noopener noreferrer" target="_blank">
                  {link.label === "github" ? "GitHub" : "LinkedIn"} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </header>
          <nav aria-label="Career documents" className="resume__actions">
            <a className="resume__download" download href={document.pdf}>Download {detailed ? "CV" : "résumé"} (PDF) <span aria-hidden="true">↓</span></a>
            <Link href={alternate.path}>View {detailed ? "résumé" : "full CV"} <span aria-hidden="true">↗</span></Link>
            <ResumePrintButton />
          </nav>
          <section aria-labelledby="career-experience" className="resume__section">
            <h2 id="career-experience">Experience</h2>
            <div className="resume__entries">
              {experience.map((entry) => (
                <article className="resume__entry" key={`${entry.company}-${entry.role}`}>
                  <div className="resume__entry-meta"><span>{entry.period}</span><span>{entry.company}</span></div>
                  <div>
                    <h3>{entry.role}</h3>
                    {detailed && <p>{entry.description}</p>}
                    <ul className="resume__bullets">{entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                    {detailed && <p className="resume__entry-stack">{entry.technologies.join(" · ")}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section aria-labelledby="career-work" className="resume__section">
            <h2 id="career-work">{detailed ? "Project portfolio" : "Selected work"}</h2>
            <div className={detailed ? "resume__project-list" : "resume__work-grid"}>
              {projects.map((project) => (
                <article className="resume__project" key={project.slug}>
                  <h3><Link href={project.href}>{project.name} <span aria-hidden="true">↗</span></Link></h3>
                  <p className="resume__project-meta">{project.category} · {project.year}</p>
                  <p>{project.description}</p>
                  {detailed && <>
                    <p><strong>Role:</strong> {project.role}</p>
                    <ul className="resume__bullets">{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
                    <p><strong>Result:</strong> {project.outcome}</p>
                    {project.technologies.length > 0 && <p className="resume__entry-stack">{project.technologies.join(" · ")}</p>}
                  </>}
                </article>
              ))}
            </div>
          </section>
          <section aria-labelledby="career-skills" className="resume__section">
            <h2 id="career-skills">Technical skills</h2>
            <dl className="resume__skills">
              {skills.map((group) => <div key={group.name}><dt>{group.name}</dt><dd>{group.technologies.join(" · ")}</dd></div>)}
            </dl>
          </section>
          <section aria-labelledby="career-education" className="resume__section">
            <h2 id="career-education">Education</h2>
            <div className="resume__entries">
              {education.map((entry) => (
                <article className="resume__entry" key={entry.school}>
                  <div className="resume__entry-meta"><time dateTime={entry.year}>{entry.year}</time></div>
                  <div><h3>{entry.school}</h3><p>{entry.qualification}{entry.distinction && ` · ${entry.distinction}`}</p></div>
                </article>
              ))}
            </div>
          </section>
          <footer className="resume__footer">Updated <time dateTime={profile.updated}>{profile.updatedLabel}</time> · <Link href="/v2/projects">Explore all project case studies</Link></footer>
        </article>
      </main>
    </>
  );
}
