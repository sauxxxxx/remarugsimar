import { TranslatedText } from "@/features/translation/translation-provider";
import { selectedTechnologies, technologyGroups } from "@/lib/portfolio-data";
import { SectionLabel } from "./section-label";
import { TechnologyTags } from "./technology-tags";

export function StackPanel() {
  return (
    <section aria-labelledby="stack-heading" className="stack-panel" id="stack">
      <SectionLabel note={<TranslatedText text="full toolkit" />}>
        <TranslatedText text="stack" />
        <span className="stack-label__count">
          ~ {selectedTechnologies.length} <TranslatedText text="selected" />
        </span>
      </SectionLabel>
      <h2 className="sr-only" id="stack-heading">
        Technology stack
      </h2>

      <div className="stack-selected">
        <h3><TranslatedText text="Selected technologies" /></h3>
        <TechnologyTags
          label="Selected technologies"
          technologies={selectedTechnologies}
          variant="selected"
        />
      </div>

      <div className="stack-groups">
        {technologyGroups.map((group) => (
          <section className="stack-group" key={group.name}>
            <h3><TranslatedText text={group.name} /></h3>
            <ul>
              {group.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
