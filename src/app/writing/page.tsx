import type { Metadata } from "next";
import Link from "next/link";
import { ContentPageIntro } from "@/components/content-page-intro";
import { SitePageHeader } from "@/components/site-page-header";
import { TranslatedText } from "@/features/translation/translation-provider";
import { writingEntries } from "@/lib/content-data";
import { siteConfig, socialImage } from "@/lib/site-config";

const description =
  "Notes on product engineering, CRM systems, AI features, and building useful business software.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: "/writing",
    title: `Writing — ${siteConfig.name}`,
    description,
    images: [socialImage],
  },
};

export default function WritingPage() {
  return (
    <main className="projects-page content-page">
      <SitePageHeader />
      <ContentPageIntro
        count={writingEntries.length}
        description={description}
        eyebrow="all writing"
        title="Writing"
      />
      <section aria-label="All articles" className="writing-index">
        {writingEntries.map((entry, index) => (
          <article className="writing-index__item" key={entry.slug}>
            <span className="writing-index__number">{String(index + 1).padStart(2, "0")}</span>
            <div className="writing-index__content">
              <span className="writing-index__category"><TranslatedText text={entry.category} /></span>
              <h2>
                <Link href={`/writing/${entry.slug}`}>
                  <TranslatedText text={entry.title} /> <span aria-hidden="true">↗</span>
                </Link>
              </h2>
              <p><TranslatedText text={entry.summary} /></p>
            </div>
            <div className="writing-index__meta">
              <time dateTime={entry.publishedAt}>{entry.displayDate}</time>
              <span>{entry.readingTime}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
