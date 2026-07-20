import { services } from "@/lib/content-data";
import { TranslatedText } from "@/features/translation/translation-provider";
import { SectionLabel } from "./section-label";

export function ServicesPanel() {
  return (
    <section aria-labelledby="services-heading" className="services-panel" id="services">
      <SectionLabel note={<TranslatedText text={`${services.length} ways I can help`} />}>
        <TranslatedText text="services" />
      </SectionLabel>
      <h2 className="sr-only" id="services-heading">Services</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <article className="service-item" key={service.title}>
            <span className="service-item__number">{String(index + 1).padStart(2, "0")}</span>
            <h3><TranslatedText text={service.title} /></h3>
            <p><TranslatedText text={service.description} /></p>
            <ul aria-label={`${service.title} capabilities`}>
              {service.capabilities.map((capability) => (
                <li key={capability}><TranslatedText text={capability} /></li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
