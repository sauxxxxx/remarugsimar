import { contactCopy } from "@/lib/content-data";
import { profileLinks } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";
import { TranslatedText } from "@/features/translation/translation-provider";
import { SectionLabel } from "./section-label";

export function ContactPanel() {
  const contactLinks = profileLinks.filter(
    (link) => link.label !== "resume" && link.label !== "email",
  );

  return (
    <section aria-labelledby="contact-heading" className="contact-panel" id="contact">
      <SectionLabel note={<TranslatedText text="available for selected projects" />}>
        <TranslatedText text="contact" />
      </SectionLabel>
      <div className="contact-panel__body">
        <p className="contact-panel__eyebrow"><TranslatedText text="start a conversation" /></p>
        <h2 id="contact-heading"><TranslatedText text={contactCopy.heading} /></h2>
        <p><TranslatedText text={contactCopy.body} /></p>
        <div className="contact-panel__actions">
          <a
            className="contact-panel__email"
            href={`mailto:${siteConfig.email}?subject=Project%20inquiry`}
          >
            email a project brief <span aria-hidden="true">↗</span>
          </a>
          <a className="contact-panel__secondary" href="#projects">
            <TranslatedText text="Selected projects" /> <span aria-hidden="true">↑</span>
          </a>
        </div>
        <p className="contact-panel__address">{siteConfig.email}</p>
        <div className="contact-panel__links" aria-label="Contact links">
          {contactLinks.map((link) => (
            <a href={link.href} key={link.label} rel={link.external ? "noopener noreferrer" : undefined} target={link.external ? "_blank" : undefined}>
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
