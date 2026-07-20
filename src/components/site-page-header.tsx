import Link from "next/link";
import { LanguageSelector } from "@/features/translation/language-selector";
import { PortfolioSearch } from "@/features/portfolio-search/portfolio-search";
import { TranslatedText } from "@/features/translation/translation-provider";
import { ThemeToggle } from "./theme-toggle";

type SitePageHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export function SitePageHeader({
  backHref = "/",
  backLabel = "portfolio",
}: SitePageHeaderProps) {
  return (
    <header className="projects-page__header">
      <Link className="projects-page__back" href={backHref}>
        <span aria-hidden="true">←</span>
        <span><TranslatedText text={backLabel} /></span>
      </Link>

      <div className="projects-page__utilities" aria-label="Page utilities">
        <ThemeToggle />
        <PortfolioSearch />
        <LanguageSelector />
      </div>
    </header>
  );
}
