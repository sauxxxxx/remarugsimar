import { testimonialCopy, testimonials } from "@/lib/content-data";
import { TranslatedText } from "@/features/translation/translation-provider";
import { SectionLabel } from "./section-label";

export function TestimonialsPanel() {
  return (
    <section aria-labelledby="testimonials-heading" className="testimonials-panel" id="testimonials">
      <SectionLabel note={<TranslatedText text="awaiting client approval" />}>
        <TranslatedText text="testimonials" />
      </SectionLabel>
      <div className="testimonials-list">
        <div className="testimonials-list__intro">
          <p className="testimonials-list__status"><TranslatedText text="feedback in progress" /></p>
          <h2 id="testimonials-heading"><TranslatedText text={testimonialCopy.heading} /></h2>
        </div>
        {testimonials.map((testimonial, index) => (
          <figure className="testimonial-item" key={`${testimonial.name}-${testimonial.project}`}>
            <span aria-hidden="true" className="testimonial-item__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <blockquote>
              <p>“{testimonial.quote}”</p>
            </blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role} · {testimonial.company}</span>
              <small>{testimonial.project}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
