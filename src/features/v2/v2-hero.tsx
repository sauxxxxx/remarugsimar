"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { PortfolioVersionSwitch } from "@/components/portfolio-version-switch";
import { RuMark } from "./brand/ru-mark";
import { V2ProjectMarquee } from "./hero/v2-project-marquee";
import styles from "./v2-hero.module.css";

export type V2HeroDestination = "work" | "capabilities" | "about" | "contact";

const destinations = [
  { key: "work", href: "#v2-projects", label: "Work" },
  { key: "capabilities", href: "#v2-what-i-do", label: "Services" },
  { key: "about", href: "#v2-about", label: "About" },
  { key: "contact", href: "#v2-contact", label: "Contact" },
] as const;

export function V2Hero({ active = true, onNavigate }: {
  active?: boolean;
  onNavigate?: (destination: V2HeroDestination) => void;
}) {
  function navigate(event: MouseEvent<HTMLAnchorElement>, destination: V2HeroDestination) {
    if (!onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(destination);
  }

  return (
    <main className={`${styles.page} v2-portfolio-page`} id="v2-main">
      <a className={styles.skipLink} href="#v2-hero-copy">Skip to introduction</a>
      <section aria-labelledby="v2-title" className={styles.hero}>
        <header className={styles.header}>
          <Link aria-label="Remar Ugsimar home" className={styles.brand} data-v2-brand-mark href="/"><RuMark /></Link>
          <nav aria-label="V2 navigation" className={styles.navigation}>
            {destinations.map(({ key, href, label }) => (
              <a href={href} key={key} onClick={(event) => navigate(event, key)}>{label}</a>
            ))}
          </nav>
          <a className={styles.availability} href="#v2-contact" onClick={(event) => navigate(event, "contact")}>
            <span aria-hidden="true" /> Limited availability
          </a>
          <PortfolioVersionSwitch className={styles.versionSwitch} currentVersion="v2" />
        </header>

        <div className={styles.copy} id="v2-hero-copy" tabIndex={-1}>
          <h1 id="v2-title"><span>Custom software and websites</span><span>for your business.</span></h1>
          <p className={styles.introduction}>
            CRMs, accounting systems, AI tools, and websites for your team.{" "}
            <br className={styles.introductionBreak} />
            Built around how you work, from the first idea to launch.
          </p>
          <a className={styles.primaryAction} href="#v2-contact" onClick={(event) => navigate(event, "contact")}>
            <Image alt="" className={styles.avatar} height={36} src="/v2/remar-editorial-portrait.webp" width={36} />
            Discuss your project <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>

        <V2ProjectMarquee active={active} />
      </section>
    </main>
  );
}
