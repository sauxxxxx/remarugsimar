import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PortfolioVersionSwitch } from "@/components/portfolio-version-switch";
import { V2HeroArtwork } from "./v2-hero-artwork";
import styles from "./v2-hero.module.css";

export function V2Hero() {
  return (
    <main className={`${styles.page} v2-portfolio-page`} id="v2-main">
      <a className={styles.skipLink} href="#v2-hero-copy">
        Skip to introduction
      </a>

      <section aria-labelledby="v2-title" className={styles.hero}>
        <header className={styles.header}>
          <Link aria-label="Remar Ugsimar home" className={styles.brand} href="/v2">
            <span>REMAR</span>
            <span>UGSIMAR<i aria-hidden="true" /></span>
          </Link>

          <nav aria-label="V2 navigation" className={styles.navigation}>
            <Link href="/projects">Work</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </nav>

          <PortfolioVersionSwitch
            className={styles.versionSwitch}
            currentVersion="v2"
          />
        </header>

        <div className={styles.heroGrid}>
          <div className={styles.copy} id="v2-hero-copy">
            <p className={styles.eyebrow}>
              <span aria-hidden="true" /> Full-stack developer
            </p>

            <h1 id="v2-title">
              <span>I build</span>
              <span>digital things</span>
              <em>
                that solve <strong>real problems.</strong>
              </em>
            </h1>

            <p className={styles.introduction}>
              I build operational CRM systems, SaaS platforms, and AI-assisted workflows for
              real business needs.
            </p>

            <Link className={styles.exploreLink} href="/projects">
              <span className={styles.exploreIcon}>
                <ArrowDownRight aria-hidden="true" size={15} strokeWidth={1.6} />
              </span>
              Explore selected work
            </Link>
          </div>

          <V2HeroArtwork />
        </div>

        <footer className={styles.heroFooter}>
          <p>Based in Cebu, Philippines</p>
          <span aria-hidden="true" />
          <Link href="mailto:jarinaremar13@gmail.com">
            Available for selected projects
            <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.5} />
          </Link>
          <p className={styles.sectionNumber}>01 / 07</p>
        </footer>
      </section>
    </main>
  );
}
