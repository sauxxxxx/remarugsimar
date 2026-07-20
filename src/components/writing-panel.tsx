import Link from "next/link";
import { writingEntries } from "@/lib/content-data";
import { TranslatedText } from "@/features/translation/translation-provider";
import { SectionLabel } from "./section-label";

export function WritingPanel() {
  return (
    <section aria-labelledby="writing-heading" className="writing-panel" id="writing">
      <SectionLabel
        note={(
          <Link className="section-action" href="/writing">
            <TranslatedText text="view all" /> <span aria-hidden="true">↗</span>
          </Link>
        )}
      >
        <TranslatedText text="latest writing" />
      </SectionLabel>
      <h2 className="sr-only" id="writing-heading">Latest writing</h2>
      <ol className="writing-list">
        {writingEntries.map((entry, index) => (
          <li key={entry.slug}>
            <Link href={`/writing/${entry.slug}`}>
              <span className="writing-list__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="writing-list__content">
                <strong><TranslatedText text={entry.title} /></strong>
                <span><TranslatedText text={entry.summary} /></span>
              </span>
              <span className="writing-list__meta">
                <time dateTime={entry.publishedAt}>{entry.displayDate}</time>
                <span aria-hidden="true">↗</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
