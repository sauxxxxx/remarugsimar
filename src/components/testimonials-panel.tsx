import { testimonialCopy } from "@/lib/content-data";
import { TranslatedText } from "@/features/translation/translation-provider";
import { SectionLabel } from "./section-label";

export function TestimonialsPanel() {
  return (
    <section aria-labelledby="testimonials-heading" className="testimonials-panel" id="testimonials">
      <SectionLabel note={<TranslatedText text="awaiting client approval" />}>
        <TranslatedText text="testimonials" />
      </SectionLabel>
      <div className="testimonials-empty">
        <p className="testimonials-empty__status"><TranslatedText text="feedback in progress" /></p>
        <h2 id="testimonials-heading"><TranslatedText text={testimonialCopy.heading} /></h2>
        <p><TranslatedText text={testimonialCopy.body} /></p>
        <small><TranslatedText text={testimonialCopy.note} /></small>
      </div>
    </section>
  );
}
