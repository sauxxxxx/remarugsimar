import Image from "next/image";
import Link from "next/link";
import { selectedProjects } from "@/lib/portfolio-data";
import { TranslatedText } from "@/features/translation/translation-provider";
import { SectionLabel } from "./section-label";
import { TechnologyTags } from "./technology-tags";

export function ProjectsPanel() {
  return (
    <section aria-labelledby="projects-heading" className="projects-panel" id="projects">
      <SectionLabel note={(
        <Link aria-label="View all projects" className="projects-view-all" href="/projects">
          <TranslatedText text="view all" /><span aria-hidden="true" className="project-link__arrow">↗</span>
        </Link>
      )}>
        <TranslatedText text="projects" />
        <span className="projects-label__count">~ <TranslatedText text={`${selectedProjects.length} selected`} /></span>
      </SectionLabel>
      <h2 className="sr-only" id="projects-heading">Selected projects</h2>

      <ul className="projects-list">
        {selectedProjects.map((project) => (
          <li className="project-row" key={project.name}>
            <Link
              aria-label={`View ${project.name} case study`}
              className="project-thumbnail"
              href={`/projects/${project.slug}`}
            >
              <Image
                alt={`${project.name} interface preview`}
                className="project-thumbnail__image"
                fill
                loading="lazy"
                sizes="(max-width: 560px) calc(100vw - 88px), 176px"
                src={project.thumbnailUrl}
              />
            </Link>
            <article className="project-content">
              <header className="project-header">
                <div>
                  <h3>
                    <Link className="project-link" href={`/projects/${project.slug}`} title={`View ${project.name} project details`}>
                      <span>{project.name}</span><span aria-hidden="true" className="project-link__arrow">↗</span>
                    </Link>
                  </h3>
                  <p><TranslatedText text={project.category} /></p>
                </div>
                <time dateTime={String(project.year)}>{project.year}</time>
              </header>
              <p className="project-description"><TranslatedText text={project.description} /></p>
              <TechnologyTags label={`${project.name} technologies`} technologies={project.technologies} />
              <Link className="project-case-study-link" href={`/projects/${project.slug}`}>
                <TranslatedText text="project case study" />
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
