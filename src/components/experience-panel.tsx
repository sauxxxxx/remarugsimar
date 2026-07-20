import { TranslatedText } from "@/features/translation/translation-provider";
import { experiences } from "@/lib/portfolio-data";
import { SectionLabel } from "./section-label";
import { TechnologyTags } from "./technology-tags";

export function ExperiencePanel() {
  return (
    <section aria-labelledby="experience-heading" className="experience-panel" id="experience">
      <SectionLabel note={<TranslatedText text={`${experiences.length} roles`} />}>
        <TranslatedText text="experience" />
      </SectionLabel>
      <h2 className="sr-only" id="experience-heading">
        Professional experience
      </h2>

      <ol className="experience-list">
        {experiences.map((experience) => (
          <li className="experience-row" key={`${experience.company}-${experience.role}`}>
            <div className="experience-meta">
              <time dateTime={experience.dateTime}>
                <TranslatedText text={experience.period} />
              </time>
              <span>{experience.company}</span>
            </div>

            <article className="experience-content">
              <h3><TranslatedText text={experience.role} /></h3>
              <p><TranslatedText text={experience.description} /></p>
              <TechnologyTags
                label={`${experience.role} technologies`}
                technologies={experience.technologies}
              />
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
