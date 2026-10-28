import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./v2-project-pages.module.css";
import { V2SharedImageLink } from "./v2-shared-image";

export function V2ProjectPageHeader({ backHref = "/#v2-projects", backLabel = "Portfolio", editorial = false, returnSlug }: {
  backHref?: string;
  backLabel?: string;
  editorial?: boolean;
  /** On a case study: morph the hero back into this project's gallery card. */
  returnSlug?: string;
}) {
  return (
    <header className={`${styles.header} ${editorial ? styles.editorialHeader : ""}`}>
      <Link aria-label="Remar Ugsimar portfolio" className={styles.brand} href="/">
        {editorial ? "Remar Ugsimar" : <>REMAR<br />UGSIMAR</>}
      </Link>
      <nav aria-label="V2 project navigation">
        {returnSlug ? (
          <V2SharedImageLink fromHero href={backHref} returnTo={returnSlug}><ArrowLeft aria-hidden="true" size={16} /> {backLabel}</V2SharedImageLink>
        ) : (
          <Link href={backHref}><ArrowLeft aria-hidden="true" size={16} /> {backLabel}</Link>
        )}
        <a href={`mailto:${siteConfig.email}`}>Let&apos;s talk <ArrowUpRight aria-hidden="true" size={16} /></a>
      </nav>
    </header>
  );
}
