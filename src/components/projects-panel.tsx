import Image from "next/image";
import { selectedProjects } from "@/lib/portfolio-data";
import { TranslatedText } from "@/features/translation/translation-provider";
import { SectionLabel } from "./section-label";
import { TechnologyTags } from "./technology-tags";

export function ProjectsPanel() {
  return (
    <section aria-labelledby="projects-heading" className="projects-panel" id="projects">
      <SectionLabel
        note={
          <a aria-label="View all projects" className="projects-view-all" href="/projects">
            <TranslatedText text="view all" />
            <span aria-hidden="true" className="project-link__arrow">
              ↗
            </span>
          </a>
        }
      >
        <TranslatedText text="projects" />
        <span className="projects-label__count">
          ~ <TranslatedText text={`${selectedProjects.length} selected`} />
        </span>
      </SectionLabel>
      <h2 className="sr-only" id="projects-heading">
        Selected projects
      </h2>

      <ul className="projects-list">
        {selectedProjects.map((project) => (
          <li className="project-row" key={project.name}>
            <div className="project-thumbnail">
              <Image
                alt=""
                className="project-thumbnail__image"
                height={76}
                loading="lazy"
                src={project.thumbnailUrl}
                width={112}
              />
            </div>

            <article className="project-content">
              <header className="project-header">
                <div>
                  <h3>
                    <a
                      className="project-link"
                      href={project.url || `/projects#${project.slug}`}
                      rel={project.url ? "noreferrer" : undefined}
                      target={project.url ? "_blank" : undefined}
                      title={project.url ? undefined : `View ${project.name} project details`}
                    >
                      <span>{project.name}</span>
                      <span aria-hidden="true" className="project-link__arrow">
                        ↗
                      </span>
                    </a>
                  </h3>
                  <p>
                    <TranslatedText text={project.category} />
                  </p>
                </div>
                <time dateTime={String(project.year)}>{project.year}</time>
              </header>

              <p className="project-description">
                <TranslatedText text={project.description} />
              </p>

              <TechnologyTags
                label={`${project.name} technologies`}
                technologies={project.technologies}
              />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
