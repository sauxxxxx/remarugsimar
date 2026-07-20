import Image from "next/image";
import Link from "next/link";
import { TranslatedText } from "@/features/translation/translation-provider";
import type { PortfolioProject } from "@/lib/portfolio-data";
import { TechnologyTags } from "./technology-tags";

type ExpandedProjectCardProps = {
  index: number;
  project: PortfolioProject;
};

export function ExpandedProjectCard({ index, project }: ExpandedProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="expanded-project" id={project.slug}>
      <div className="expanded-project__visual">
        <Image
          alt={`${project.name} interface preview`}
          className="expanded-project__image"
          fill
          loading={index === 0 ? "eager" : "lazy"}
          priority={index === 0}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 42vw, 520px"
          src={project.thumbnailUrl}
          unoptimized
        />
      </div>

      <div className="expanded-project__content">
        <header className="expanded-project__header">
          <div>
            <span className="expanded-project__number">{number}</span>
            <p className="expanded-project__category"><TranslatedText text={project.category} /></p>
          </div>
          <time dateTime={String(project.year)}>{project.year}</time>
        </header>

        <h2>
          <Link href={`/projects/${project.slug}`}>
            {project.name}<span aria-hidden="true">↗</span>
          </Link>
        </h2>
        <p className="expanded-project__overview"><TranslatedText text={project.overview} /></p>

        <div className="expanded-project__details">
          <div>
            <h3><TranslatedText text="Role" /></h3>
            <p><TranslatedText text={project.role} /></p>
          </div>
          <div>
            <h3><TranslatedText text="Key work" /></h3>
            <ul>
              {project.contributions.map((contribution) => (
                <li key={contribution}><TranslatedText text={contribution} /></li>
              ))}
            </ul>
          </div>
        </div>

        <TechnologyTags label={`${project.name} technologies`} technologies={project.technologies} />
        <div className="expanded-project__action">
          {project.url ? (
            <a href={project.url} rel="noreferrer" target="_blank"><TranslatedText text="visit website" /><span aria-hidden="true">↗</span></a>
          ) : <span><TranslatedText text="private project" /></span>}
        </div>
      </div>
    </article>
  );
}
