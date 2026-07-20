import { aboutParagraphs } from "@/lib/portfolio-data";
import { TranslatedText } from "@/features/translation/translation-provider";
import { ProjectsPanel } from "./projects-panel";
import { ExperiencePanel } from "./experience-panel";
import { SectionLabel } from "./section-label";
import { StackPanel } from "./stack-panel";
import { ServicesPanel } from "./services-panel";
import { TestimonialsPanel } from "./testimonials-panel";
import { WritingPanel } from "./writing-panel";
import { ContactPanel } from "./contact-panel";

export function AboutPanel() {
  return (
    <section aria-labelledby="about-heading" className="about-panel" id="about">
      <div className="about-card">
        <SectionLabel note={<TranslatedText text="a brief introduction" />}>
          <TranslatedText text="about" />
        </SectionLabel>
        <div className="about-card__body">
          <h2 className="sr-only" id="about-heading">
            About Remar Ugsimar
          </h2>
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>
              <TranslatedText text={paragraph} />
            </p>
          ))}
        </div>
      </div>

      <ProjectsPanel />
      <ServicesPanel />
      <ExperiencePanel />
      <StackPanel />
      <WritingPanel />
      <TestimonialsPanel />
      <ContactPanel />
    </section>
  );
}
