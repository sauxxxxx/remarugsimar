import Link from "next/link";
import { TranslatedText } from "@/features/translation/translation-provider";
import { type WritingEntry, writingEntries } from "@/lib/content-data";
import { SitePageHeader } from "./site-page-header";

type ArticleShellProps = {
  children: React.ReactNode;
  entry: WritingEntry;
};

export function ArticleShell({ children, entry }: ArticleShellProps) {
  const currentIndex = writingEntries.findIndex((item) => item.slug === entry.slug);
  const nextEntry = writingEntries[(currentIndex + 1) % writingEntries.length];

  return (
    <main className="projects-page content-page article-page">
      <SitePageHeader backHref="/writing" backLabel="all writing" />
      <article>
        <header className="article-header">
          <p className="article-header__category"><TranslatedText text={entry.category} /></p>
          <h1><TranslatedText text={entry.title} /></h1>
          <p><TranslatedText text={entry.summary} /></p>
          <div className="article-header__meta">
            <time dateTime={entry.publishedAt}>{entry.displayDate}</time>
            <span>{entry.readingTime}</span>
          </div>
        </header>
        <div className="article-prose">{children}</div>
        <footer className="article-next">
          <span><TranslatedText text="Read next" /></span>
          <Link href={`/writing/${nextEntry.slug}`}>
            <TranslatedText text={nextEntry.title} /> <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </article>
    </main>
  );
}
