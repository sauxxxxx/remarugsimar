import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./v2-project-pages.module.css";

export function V2ProjectPageHeader({ backHref = "/#v2-projects", backLabel = "Portfolio", editorial = false }: {
  backHref?: string;
  backLabel?: string;
  editorial?: boolean;
}) {
  return (
    <header className={`${styles.header} ${editorial ? styles.editorialHeader : ""}`}>
      <Link aria-label="Remar Ugsimar portfolio" className={styles.brand} href={editorial ? "/v2" : "/"}>
        {editorial ? "Remar Ugsimar" : <>REMAR<br />UGSIMAR</>}
      </Link>
      <nav aria-label="V2 project navigation">
        <Link href={backHref}><ArrowLeft aria-hidden="true" size={16} /> {backLabel}</Link>
        <a href={`mailto:${siteConfig.email}`}>Let&apos;s talk <ArrowUpRight aria-hidden="true" size={16} /></a>
      </nav>
    </header>
  );
}
