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
    locale: "en_US",
    url: "/writing",
    siteName: `${siteConfig.name} Portfolio`,
    title: `Writing — ${siteConfig.name}`,
    description,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Writing — ${siteConfig.name}`,
    description,
    images: [socialImage.url],
  },
};

export default function WritingPage() {
  return (
    <>
      <a className="skip-link" href="#all-writing">Skip to writing</a>
      <main className="projects-page content-page">
        <SitePageHeader />
        <div id="all-writing" tabIndex={-1}>
          <ContentPageIntro
            count={writingEntries.length}
            description={description}
            eyebrow="all writing"
            title="Writing"
          />
        </div>
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
    </>
  );
}
