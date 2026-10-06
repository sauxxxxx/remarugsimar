import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./v2-project-pages.module.css";

export function V2ProjectPageHeader({ backHref = "/#v2-projects", backLabel = "Portfolio" }: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className={styles.header}>
      <Link aria-label="Remar Ugsimar portfolio" className={styles.brand} href="/">REMAR<br />UGSIMAR</Link>
      <nav aria-label="V2 project navigation">
        <Link href={backHref}><ArrowLeft aria-hidden="true" size={16} /> {backLabel}</Link>
        <a href={`mailto:${siteConfig.email}`}>Let&apos;s talk <ArrowUpRight aria-hidden="true" size={16} /></a>
      </nav>
    </header>
  );
}
