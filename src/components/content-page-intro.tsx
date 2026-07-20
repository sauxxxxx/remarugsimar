import { TranslatedText } from "@/features/translation/translation-provider";

type ContentPageIntroProps = {
  count?: number;
  description: string;
  eyebrow: string;
  title: string;
};

export function ContentPageIntro({ count, description, eyebrow, title }: ContentPageIntroProps) {
  return (
    <section className="projects-page__intro">
      <div className="projects-page__eyebrow">
        <span aria-hidden="true" />
        <TranslatedText text={eyebrow} />
        {typeof count === "number" ? <span>~ {count}</span> : null}
      </div>
      <h1><TranslatedText text={title} /></h1>
      <p><TranslatedText text={description} /></p>
    </section>
  );
}
